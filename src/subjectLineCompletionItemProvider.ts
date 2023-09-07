import * as vscode from 'vscode';

export class SummaryLineCompletionItemProvider implements vscode.CompletionItemProvider, vscode.CodeActionProvider, vscode.Disposable {

    private disposables: vscode.Disposable[] = [];
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('scm-input-conventional-commit');
        this.disposables.push(
            this.diagnosticCollection,
            vscode.workspace.onDidOpenTextDocument((d) => this._lintSubjectLine(d)),
            vscode.workspace.onDidChangeTextDocument((e) => this._lintSubjectLine(e.document))
        );
    }

    dispose() {
        this.disposables.forEach(d => d.dispose());
    }

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        if (this._isValidSubjectLine(document) !== true) {
            const suggestWidget = new vscode.CodeAction(vscode.l10n.t('Add commit type'), vscode.CodeActionKind.QuickFix);
            suggestWidget.isPreferred = true;
            suggestWidget.command = {
                command: 'editor.action.triggerSuggest',
                title: vscode.l10n.t('Add commit type'),
            };
            return [suggestWidget];
        }
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        // If we are at the start of the commit message, provide all configured item types
        const existingPrefix = this._isValidSubjectLine(document);
        if (existingPrefix !== true && position.line === 0) {
            const allowedPrefixes = this._getAllowedPrefixes();
            const completions = allowedPrefixes.map(prefix => {
                const completionItem = new vscode.CompletionItem(`${prefix}:`, vscode.CompletionItemKind.Text);
                const startPosition = new vscode.Position(0, 0);
                completionItem.sortText = prefix;
                completionItem.insertText = '';
                if (typeof existingPrefix === 'string' && existingPrefix.length > 0) {
                    // If there's an existing invalid prefix, replace it
                    const endPosition = new vscode.Position(0, existingPrefix.length);
                    completionItem.additionalTextEdits = [vscode.TextEdit.replace(new vscode.Range(startPosition, endPosition), prefix)];
                } else {
                    const lineText = document.lineAt(0);
                    // Don't use label as filter text so that completions aren't filtered out when the cursor is at the end of the word and we want to insert some other text prior
                    completionItem.filterText = lineText.text;
                    completionItem.additionalTextEdits = [vscode.TextEdit.insert(lineText.range.start, `${prefix}: `)];
                }
                return completionItem;
            });
            return completions;
        }
    }

    private _lintSubjectLine(document: vscode.TextDocument): void {
        if (document.languageId !== 'scminput') {
            return;
        }

        if (this._isValidSubjectLine(document) !== true) {
            const allowedPrefixes = this._getAllowedPrefixes();
            const range = document.lineAt(0).range;
            const diagnostic = new vscode.Diagnostic(
                range,
                vscode.l10n.t(`Subject line should start with one of the following types:\n{0}`, allowedPrefixes.map(prefix => `${prefix}:`).join(', ')),
                vscode.DiagnosticSeverity.Warning
            );
            this.diagnosticCollection.set(document.uri, [diagnostic]);
        } else {
            this.diagnosticCollection.clear();
        }
    }

    private _isValidSubjectLine(document: vscode.TextDocument): boolean | string {
        const config = vscode.workspace.getConfiguration('gitCommit');
        if (config.get('subjectLine.lint.enabled') !== true) {
            return true;
        }

        const text = document.lineAt(0).text.toLocaleLowerCase();
        if (!text.length) {
            // Don't lint, provide code actions or completions if the input box is empty
            return true;
        }

        const prefix = text.includes(':') ? text.split(':')[0] : '';
        const allowedPrefixes = this._getAllowedPrefixes();
        return allowedPrefixes.includes(prefix) ? true : prefix;
    }

    private _getAllowedPrefixes(): string[] {
        const config = vscode.workspace.getConfiguration('gitCommit');
        return config.get('subjectLine.lint.types', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert']);
    }
}
