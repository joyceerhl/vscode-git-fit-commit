# Git 50/72 Commit Message Formatter

This is a Visual Studio Code extension that formats git commit messages in the source control input box according to the 50/72 rule. It also supports optional linting and quick fixes for missing `type:` subject line prefixes.

## Usage

1. Install the extension in VS Code.
2. Write a commit message in the source control view input box.
3. If either the subject line or the body exceeds the configured limit, a validation message will appear in the source control input box. Use the Quick Fix command (`Ctrl+.`) to access and run the `Format commit message` code action.

    ![Commit message quick fix](format-quick-fix.gif)

4. If your commit message lacks a `type:` prefix, a validation message will appear in the source control input box. Use the Quick Fix command (`Ctrl+.`) to access and run the `Add commit type` code action.

    ![Commit message type warning and quick fix](commit-type-fix.gif)

5. Happy committing!

## Configuration options

* Configure how long your commit message subject lines and bodies should be with the following settings:
    - `git.inputValidationSubjectLength` (default: 50 chars)
    - `git.inputValidationLength` (default: 72 chars)
* Enable `editor.formatOnType` to automatically format your commit message when you insert a newline.
* Configure how overly long subject lines should wrap when formatted with `gitCommit.subjectLine.overflowStrategy` (default: `split`)
* Configure whether you want validation and quick fixes for commit types in the subject line:
    - `gitCommit.subjectLine.lint.enabled`: (default: `false`) 
    - `gitCommit.subjectLine.lint.types` (default: `feat:`, `fix:` [and other Conventional Commit types](https://www.conventionalcommits.org/en/v1.0.0/))

## Development

### Prerequisites

- Node.js
- Visual Studio Code

### Setup

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Open the project in VS Code.

### Build

Press `F5` to compile the extension source code and launch the extension development host.

### Test

Run `npm test` to run the tests.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)