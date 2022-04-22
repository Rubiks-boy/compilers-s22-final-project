"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lint = void 0;
function repeat(s: string, count: number) {
  if (count <= 0) {
    return '';
  }
  return new Array(count + 1).join(s);
}
function unIndent(tab: string, input: string) {
  return input.substring(0, input.length - tab.length);
}
function undoNewLine(tab: string, indentLevel: number, lexedOutput: string) {
  return unIndent(repeat(tab, indentLevel) + "\n", lexedOutput);
}

export function lint(lexer: any, indentChars: string) {

  var tab = (typeof indentChars !== "undefined") ? indentChars : "    ";
  var lexedOutput = "";
  var indentLevel = 0;

  var numNewLineBefore = 0;

  var prevToken = null;
  var currToken = lexer.lex();

  while (currToken !== 1) {
    var type = currToken.type;
    var content = currToken.content;

    switch (type) {
      // space after
      case "func":
      case "class":
        if (numNewLineBefore === 1 && prevToken.type === '}') {
          lexedOutput += '\n';
          lexedOutput += repeat(tab, indentLevel);
        }
        lexedOutput += content + " ";
        break;
      case "if":
      case "case":
      case "static":
      case "super":
      case "override":
      case "return":
      case "while":
      case "cast":
      case "var":
      case ",":
      case ":":
        lexedOutput += content + " ";
        break;
      // space between and after
      case "=":
      case "+":
      case "-":
      case "*":
      case "/":
      case "?":
      case "||":
      case "&&":
      case "??":
      case "==":
      case "!=":
      case "<=":
      case ">=":
      case ">":
      case "<":
      case "->":
        lexedOutput += " " + content + " ";
        break;
      case "else":
        lexedOutput = undoNewLine(tab, indentLevel, lexedOutput);
        lexedOutput += ' '+content;
        break;
      case 'NEWLINE':
        if (numNewLineBefore === 1 || (prevToken.type === 'COMMENT' && numNewLineBefore === 0)) {
          lexedOutput += '\n' + repeat(tab, indentLevel);
        }
        break;
      case '{':
        lexedOutput += ' ' + content + "\n" + repeat(tab, indentLevel + 1); // end of line character
        indentLevel += 1;
        break;
      case '}':
        indentLevel -= 1;
        lexedOutput = unIndent(tab, lexedOutput);
        lexedOutput += content + '\n' + repeat(tab, indentLevel);
        break;
      case ";":
        if (prevToken.type === 'return') {
          lexedOutput = unIndent(" ", lexedOutput);
        }
        lexedOutput += content + "\n" + repeat(tab, indentLevel); // end of line character
        break;
      case 'COMMENT':
        if (numNewLineBefore === 1 && prevToken.type === '}') {
          lexedOutput += '\n';
          lexedOutput += repeat(tab, indentLevel);
        }
        lexedOutput += content + repeat(tab, indentLevel);
        break;
      default:
        lexedOutput += content;
        break;
    }

    if (currToken.type !== 'NEWLINE') {
      prevToken = currToken;
      numNewLineBefore = 0;
    }
    else {
      numNewLineBefore += 1;
    }

    currToken = lexer.lex();
  }
  return lexedOutput;
}


//# sourceMappingURL=linter.js.map