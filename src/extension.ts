/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code belo
import * as vscode from 'vscode';
import * as path from 'path';

// imports for linting 
var lintPath = path.join(__dirname, '../src/linting/hasty-linter');
var lint = require(lintPath).lint;
var jisonLex = require('jison-lex');
var fs = require('fs');
var grammarPath = path.join(__dirname, '../src/linting/hasty-for-linter.l');
var grammar = fs.readFileSync(grammarPath, 'utf8');
var lexer = new jisonLex(grammar);

// imports for parsing
const parser = require('../parsing/hasty');

// diagnostics about the current documents (e.g. parse errors)
let diagnosticCollection: vscode.DiagnosticCollection;

// whenever the parser says that only one token is expected,
// we'll offer to autofill that token.
const singleTokenInsertions : any = {
  "'EQ'": ' = ',
  "'QUERYQUERY'": ' ?? ',
  "'ARROW'": ' -> ',
  "'SEMI'": ';',
  "'LPAREN'": '(',
  "'RPAREN'": ')',
  "'LBRACKET'": '[',
  "'RBRACKET'": ']',
  "'LBRACE'": '{',
  "'RBRACE'": '}',
  "'QUERY'": ' ? ',
  "'COMMA'": ', ',
  "'COLON'": ' : ',
  "'DOT'": '.',
  "'ELSE'": ' else ',
  "'IF'": ' if ',
  "'NIL'": ' nil ',
  "'INIT'": ' init ',
};

const getParseError = (document: vscode.TextDocument): {diagnostic: vscode.Diagnostic, range: vscode.Range, hash: any} | null => {
    const text = document.getText();
    try {
      parser.parse(text);
    } catch (e: any) {
      const {hash} = e;
      const {loc, line, expected, text, token} = e.hash;
      const {first_line: firstLine, last_line: lastLine, first_column: firstCol, last_column: lastCol} = loc;
      const startPos = new vscode.Position(firstLine - 1, firstCol);
      const endPos = new vscode.Position(lastLine - 1, lastCol);
      const range = new vscode.Range(startPos, endPos);
      const message = `Parse error on line ${line} at '${text}': expected ${expected}`;
      const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
      return {diagnostic, range, hash: e.hash};
    }
    return null;
};

const validateDocument = (document: vscode.TextDocument) => {
  diagnosticCollection.clear();

  const parseError = getParseError(document);
  if (parseError) {
    const {diagnostic} = parseError;
    diagnosticCollection.set(document.uri, [diagnostic]);
  }
};

const onChange = (e: vscode.TextDocumentChangeEvent) => {
  const document = e.document;
  validateDocument(document);
};


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
  
  const parsing = vscode.commands.registerCommand('cs132-hasty.parse', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hasty parsing!');
    const editor = vscode.window.activeTextEditor;
    if (editor === undefined) {
      return;
    }
    const document = editor.document;
    const text = document.getText();
    try {
      const ast = parser.parse(text);
      vscode.window.showInformationMessage(JSON.stringify(ast));
    } catch (e: any) {
      vscode.window.showErrorMessage(e.message);
    }

  });

  context.subscriptions.push(parsing);

  vscode.languages.registerDocumentFormattingEditProvider('hasty', {
    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions) {
      var space = '\t';
      if (options.insertSpaces) {
        space = ' '.repeat(options.tabSize);
      }
      var output = getLintedText(document, space);
      return [output];
    }
  });

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
        return { uri: document.uri, range: range };
      } else {
        return;
      }
    }
  });

  // validate document and display problems
  diagnosticCollection = vscode.languages.createDiagnosticCollection('hasty');
  vscode.workspace.onDidOpenTextDocument(validateDocument, null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument(onChange, null, context.subscriptions);
  vscode.workspace.onDidCloseTextDocument(validateDocument, null, context.subscriptions);

  vscode.workspace.textDocuments.forEach(validateDocument);

  // test code action
  vscode.languages.registerCodeActionsProvider('hasty', {
    provideCodeActions(document, range, context, token) {
      // get diagnostics
      const diagnostics = diagnosticCollection.get(document.uri);
      if (diagnostics === undefined) {
        return;
      }

      // see if there are any diagnostics (aka parse errors) for this particular location in the document.
      const diagnostic = diagnostics.find(d => d.range.contains(range.start));
      if (diagnostic === undefined) {
        return;
      }

      const parseError = getParseError(document);
      if (parseError === null) {
        return;
      }
      const {hash} = parseError;
      const {expected} = parseError.hash;

      if(expected.includes("'SEMI'")) {
        const action = new vscode.CodeAction('Insert semicolon', vscode.CodeActionKind.QuickFix);
        action.edit = new vscode.WorkspaceEdit();
        action.edit.insert(document.uri, range.end, ';');
        return [action];
      }

      if(expected.length === 1 && singleTokenInsertions[expected[0]]) {
        const suggestion = singleTokenInsertions[expected[0]];

        if(suggestion) {
          const action = new vscode.CodeAction(`Insert ${suggestion}`, vscode.CodeActionKind.QuickFix);
          action.edit = new vscode.WorkspaceEdit();
          action.edit.insert(document.uri, range.end, suggestion);
          return [action];
        }
      }

      return [];
    }
  });
}

function getLintedText(document: vscode.TextDocument, space: string) {
  var input = document.getText();
  lexer.setInput(input);
  var output = lint(lexer, space);
  var startPos = new vscode.Position(0, 0);
  var endPos = document.lineAt(document.lineCount - 1).range.end;
  var range = new vscode.Range(startPos, endPos);
  var edit = new vscode.TextEdit(range, output);
  return edit;
}

function findDefinition(
  document: vscode.TextDocument,
  position: vscode.Position,
): vscode.Range | undefined {
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
    document.positionAt(start + len)
  );
}

// this method is called when your extension is deactivated
export function deactivate() { }
