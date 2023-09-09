import CommitMessageFormatter, { CommitMessageFormatterOptions } from '@bendera/commit-message-formatter';
import * as vscode from 'vscode';

export class GitCommitMessageFormatter implements vscode.OnTypeFormattingEditProvider, vscode.DocumentFormattingEditProvider, vscode.CodeActionProvider {

  private _formatter: CommitMessageFormatter;

  constructor() {
    this._formatter = new CommitMessageFormatter(this._getFormatterOptions());

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("git.inputValidationLength")
      || e.affectsConfiguration("git.inputValidationSubjectLength")
      || e.affectsConfiguration("gitCommit.subjectLine.overflowStrategy")) {
        this._formatter = new CommitMessageFormatter(this._getFormatterOptions());
      }
    });
  }

  provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    const edits = this._provideFormatTextEdit(document);
    if (edits.length === 0) {
      return [];
    }

    const quickFix = new vscode.CodeAction(vscode.l10n.t('Format commit message'), vscode.CodeActionKind.QuickFix);
    quickFix.edit = new vscode.WorkspaceEdit();
    quickFix.edit.set(document.uri, edits);
    
    return [quickFix];
  }

  provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
    return this._provideFormatTextEdit(document);
  }

  provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this._provideFormatTextEdit(document);
  }

  getTriggerCharacters(): string[] {
    return ['\n'];
  }

  private _getFormatterOptions(): CommitMessageFormatterOptions {
    const gitConfig = vscode.workspace.getConfiguration("git");
    return {
      lineLength: gitConfig.get("inputValidationLength", 72),
      subjectLength: gitConfig.get("inputValidationSubjectLength", 50),
      subjectMode: vscode.workspace.getConfiguration("gitCommit").get("subjectLine.overflowStrategy", "split"),
      collapseMultipleEmptyLines: true
    }
  }

  private _provideFormatTextEdit(document: vscode.TextDocument): vscode.TextEdit[] {
    const formatted = this._provideFormattedText(document);
    if (formatted === document.getText()) {
      return [];
    }

    return [vscode.TextEdit.replace(
      new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(document.lineCount, 0)
      ),
      formatted
    )];
  }

  private _provideFormattedText(document: vscode.TextDocument) {
    return this._formatter.format(document.getText());
  }
}
