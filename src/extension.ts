import * as vscode from 'vscode';
import { GitCommitMessageFormatter } from './gitCommitMessageFormatter';

export function activate(context: vscode.ExtensionContext) {
    const gitFormatter = new GitCommitMessageFormatter();
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('scminput', gitFormatter),
        vscode.languages.registerCodeActionsProvider('scminput', gitFormatter),
        vscode.languages.registerOnTypeFormattingEditProvider('scminput',gitFormatter, '\n')
    );
}

export function deactivate() {}