
function repeat(s, count) {
  if(count<=0)
    return '';
  return new Array(count + 1).join(s);
}

function unIndent(tab,input) {
  return input.substring(0,input.length-tab.length);
}

function format(lexer, indentChars) {
  var i           = 0,
      il          = 0,
      tab         = (typeof indentChars !== "undefined") ? indentChars : "    ",
      lexedOutput     = "",
      indentLevel = 0,
      inString    = false,
      currToken = null;
      prevToken = null;
      lastLineIsNewLine = false;
  currToken = lexer.lex();
  while ( currToken != 1) { 
      
      var type = currToken.type;
      var content = currToken.content;
      
      switch (type) {
      case 'NEWLINE':
          var array = ['COMMENT'];
          if(array.includes(prevToken.type) && !lastLineIsNewLine){
              lexedOutput = unIndent(repeat(tab,indentLevel),lexedOutput);
              lexedOutput += '\n'+repeat(tab,indentLevel);
          }
          break;
      case '{':  
          if (!inString) { 
              lexedOutput += ' ' +content + "\n"+repeat(tab, indentLevel+1);
              indentLevel += 1; 
          } else { 
              lexedOutput += content; 
          }
          break; 
      case '}': 
          if (!inString) { 
              indentLevel -= 1;
              lexedOutput = unIndent(tab,lexedOutput);
              if(prevToken.type=='}'){
                  lexedOutput = unIndent("\n",lexedOutput);
              }
              lexedOutput += content+"\n\n"+ repeat(tab, indentLevel) ; 
          } else { 
              lexedOutput += content; 
          } 
          break;
      case 'COMMENT':
        lexedOutput += content + repeat(tab, indentLevel);
        break;  
      case "else":  
          if(prevToken.type == '}'){
            lexedOutput = unIndent(repeat(tab,indentLevel)+"\n",lexedOutput)+repeat(tab,indentLevel);
          }
          lexedOutput += content;
          break;
      case ";":
          if(prevToken.type == 'return'){
            lexedOutput = unIndent(" ",lexedOutput);
          }
          lexedOutput += content + "\n"+repeat(tab, indentLevel);
          break;
      case "func":
      case "if":
      
      case "case":
      case "static":
      case "super":
      case "override":
      case "return":
      case "while":
      case "var":	
      case ",":
      case ":":
      case "->":
        if (!inString) {
            lexedOutput += content+" ";
        }
        break; 
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
      case "<=":
      case ">=":
      case ">":
      case "<":
      if (!inString) {
              lexedOutput += " "+content+" ";
          }
          break; 
      case "\n":
      case "\t":
          if (inString) {
              lexedOutput += content;
          }
          break;
      case '"': 
          if (i > 0 && prevToken.type !== '\\') {
              inString = !inString; 
          }
          lexedOutput += content; 
          break;
      default: 
          lexedOutput += content; 
          break;                    
      } 
      if(currToken.type!=='NEWLINE'){
         prevToken = currToken;
         lastLineIsNewLine = false;
      } else{
         lastLineIsNewLine = true;
      }
      currToken = lexer.lex();
      

  } 

  return lexedOutput; 
}

var JisonLex = require('jison-lex');
fs = require('fs');

var filename = process.argv.slice(1)[1];
var input = require('fs').readFileSync(require('path').normalize(filename), "utf8");
//var input = fs.readFileSync('./test.tasty', 'utf8');

var grammar = fs.readFileSync('./hasty-for-linter.l', 'utf8');
var lexer = new JisonLex(grammar);
lexer.setInput(input);


fs.writeFile('./'+filename.split('.')[0]+'Linted.tasty', format(lexer,'    '), err => {
  if (err) {
    console.error(err)
    return
  }
  //file written successfully
});