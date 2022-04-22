// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code belo
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cs132-hasty" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cs132-hasty.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from cs132-hasty!');
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerHoverProvider('hasty', {
		provideHover(document, position, token) {
			let range = findDefinition(document, position);
			if (range !== undefined) {
				var text = new vscode.MarkdownString();
				text.appendCodeblock(document.getText(range), 'hasty');
				return new vscode.Hover(text);
			} else {
				return;
			}
		}
	});

	vscode.languages.registerDefinitionProvider('hasty', {
		provideDefinition(document, position, token) {
			let range = findDefinition(document, position);
			if (range !== undefined) {
				return {uri: document.uri, range: range};
			} else {
				return;
			}
		}
	});
}

function findDefinition(
	document: vscode.TextDocument, 
	position: vscode.Position,
) : vscode.Range | undefined
{
	// find the word to search
	const searchRange = document.getWordRangeAtPosition(position);
	if (searchRange === undefined) {
		return;
	}
	const searchToken = document.getText(searchRange);

	const text = document.getText();

	let regexp;
	const endpos = searchRange.end;
	const nextchar = document.getText(new vscode.Range(endpos, endpos.translate(0, 1)));

	if (searchToken === "self") {
		// if token is self, search for class definition
		regexp = new RegExp(`class *[a-zA-Z0-9]+`, 'g');
	} else if (nextchar === "(") {
		// if token is function call, search for function definition
		regexp = new RegExp(`func ${searchToken} *\\(.*\\)`, 'g');
	} else {
		// otherwise, look for variable definition or parameter definition
		regexp = new RegExp(
			`(?:var *${searchToken} *: *[a-zA-Z0-9]+.*;)` + '|' + // variable definition
			`(?:func *[A-Za-z0-9]+\\(.*${searchToken} *: [A-Za-z0-9]+.*\\))` // parameter definition
		, 'g');
	}

	// use the regex to find matches
	console.log(searchToken);
	const matches = [...text.matchAll(regexp)];
	console.log(matches);
	if (matches.length === 0) {
		return;
	}

	// find closest location before search token
	let closestMatch;
	let searchTokenOffset = document.offsetAt(position);
	for (const match of matches) {
		if (match.index !== undefined && match.index < searchTokenOffset) {
			closestMatch = match;
		} else {
			break;
		}
	}
	if (closestMatch === undefined) { return; }

	let start = closestMatch.index;
	if (start === undefined) { return; }
	let len = closestMatch[0].length;

	// return the location and the type
	return new vscode.Range(
		document.positionAt(start),
		document.positionAt(start+len)
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
