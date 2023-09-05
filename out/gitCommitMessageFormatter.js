"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCommitMessageFormatter = void 0;
const commit_message_formatter_1 = __importDefault(require("@bendera/commit-message-formatter"));
const vscode = __importStar(require("vscode"));
class GitCommitMessageFormatter {
    constructor() {
        const lineLength = vscode.workspace.getConfiguration("gitCommitFormatter").get("maxLineWidth", 80);
        this._formatter = new commit_message_formatter_1.default({ lineLength });
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("gitCommitFormatter.maxLineWidth")) {
                const lineLength = vscode.workspace.getConfiguration("gitCommitFormatter").get("maxLineWidth", 80);
                this._formatter = new commit_message_formatter_1.default({ lineLength });
            }
        });
    }
    provideCodeActions(document, range, context, token) {
        const quickFix = new vscode.CodeAction('Format commit message', vscode.CodeActionKind.QuickFix);
        quickFix.edit = new vscode.WorkspaceEdit();
        const edits = this._provideFormatTextEdit(document);
        quickFix.edit.set(document.uri, edits);
        return [quickFix];
    }
    provideDocumentFormattingEdits(document, options, token) {
        return this._provideFormatTextEdit(document);
    }
    provideOnTypeFormattingEdits(document, position, ch, options, token) {
        return this._provideFormatTextEdit(document);
    }
    getTriggerCharacters() {
        return ['\n'];
    }
    _provideFormatTextEdit(document) {
        const formatted = this._provideFormattedText(document);
        return [vscode.TextEdit.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(document.lineCount, 0)), formatted)];
    }
    _provideFormattedText(document) {
        return this._formatter.format(document.getText());
    }
}
exports.GitCommitMessageFormatter = GitCommitMessageFormatter;
//# sourceMappingURL=gitCommitMessageFormatter.js.map