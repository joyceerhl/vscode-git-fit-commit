import * as vscode from 'vscode';
import * as assert from 'assert';
import { GitCommitMessageFormatter } from '../gitCommitMessageFormatter';

suite('Git commit message formatter', () => {
    test('Does not provide code actions if message will be unchanged', async () => {
        const formatter = new GitCommitMessageFormatter();
        const document = {
            getText: () => 'Initial commit',
        } as vscode.TextDocument;

        const disposable = new vscode.CancellationTokenSource();
        const edits = await formatter.provideCodeActions(
            document,
            new vscode.Range(new vscode.Position(0, 0), new vscode.Position(2, 0)),
            { triggerKind: vscode.CodeActionTriggerKind.Invoke, diagnostics: [], only: undefined },
            disposable.token
        );
        assert.strictEqual(edits?.length, 0);
    });
});