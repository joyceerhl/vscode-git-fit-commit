import * as vscode from 'vscode';
import { GitCommitMessageFormatter } from './gitCommitMessageFormatter';
import { SummaryLineCompletionItemProvider } from './subjectLineCompletionItemProvider';

export function activate(context: vscode.ExtensionContext) {
    const gitFormatter = new GitCommitMessageFormatter();
    const summaryLineCompletionItemProvider = new SummaryLineCompletionItemProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('scminput', gitFormatter),
        vscode.languages.registerCodeActionsProvider('scminput', gitFormatter),
        vscode.languages.registerOnTypeFormattingEditProvider('scminput', gitFormatter, '\n'),
        summaryLineCompletionItemProvider,
        vscode.languages.registerCodeActionsProvider('scminput', summaryLineCompletionItemProvider),
        vscode.languages.registerCompletionItemProvider('scminput', summaryLineCompletionItemProvider)
    );
}

export function deactivate() {}