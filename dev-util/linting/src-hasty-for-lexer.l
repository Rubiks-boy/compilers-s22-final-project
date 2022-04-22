/* lexical grammar */
%%

[\ \t]+                   /* skip whitespace */
\n                          return 'NEWLINE'
"//".*\n                    return 'COMMENT'

"=="                        return 'EQEQ'
"!="                        return 'NEQEQ'
"<="                        return 'LESSEQ'
">="                        return 'GREATEREQ'
"<"                         return 'LESS'
">"                         return 'GREATER'

"&&"                        return 'ANDAND'
"||"                        return 'OROR'

"??"                        return 'QUERYQUERY'

"->"                        return 'ARROW'
";"                         return 'SEMI'
"+"                         return 'PLUS'
"-"                         return 'MINUS'
"*"                         return 'STAR'
"/"                         return 'SLASH'
"("                         return 'LPAREN'
")"                         return 'RPAREN'
"="                         return 'ASSIGN'
"{"                         return 'LBRACE'
"}"                         return 'RBRACE'
"["                         return 'LBRACKET'
"]"                         return 'RBRACKET'
"?"                         return 'QUERY'
"!"                         return 'BANG'
","                         return 'COMMA'
":"                         return 'COLON'
"."                         return 'DOT'

"else"                      return 'ELSE'
"func"                      return 'FUNC'
"if"                        return 'IF'
"nil"                       return 'NIL'
"print"                     return 'PRINT'
"return"                    return 'RETURN'
"while"                     return 'WHILE'
"var"                       return 'VAR'

"true"                      return 'BCONST'
"false"                     return 'BCONST'

"Int"                       return 'INT'
"Bool"                      return 'BOOL'
"String"                    return 'STRING'
"Void"                      return 'VOID'

"cast"                      return 'CAST'

"class"                     return 'CLASS'
"init"                      return 'INIT'
"static"                    return 'STATIC'
"super"                     return 'SUPER'
"override"                  return 'OVERRIDE'

[0-9]+("."[0-9]+)?\b        return 'ICONST'
"0x"[0-9A-Fa-f]+            return 'ICONST'
[a-z][a-zA-Z0-9]*           return 'IDENT'
[A-Z][a-zA-Z0-9]*           return 'CLASSNAME'
[\"]([^\\\"]|\\.)*[\"]      return 'SCONST'

<<EOF>>                     return 'EOF'
.                           return 'INVALID'
%%