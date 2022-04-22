/* lexical grammar */
%%

[\ \t]+                   /* skip whitespace */
[\n]+				return {type:  'NEWLINE', 'content':yytext}
"//".*\n				return {type:  'COMMENT', 'content':yytext}

"=="				return {type: '==', 'content':yytext}
"!="				return {type: '!=', 'content':yytext}
"<="				return {type: '<=', 'content':yytext}
">="				return {type: '>=', 'content':yytext}
"<"				return {type: '<', 'content':yytext}
">"				return {type: '>', 'content':yytext}

"&&"				return {type: '&&', 'content':yytext}
"||"				return {type: '||', 'content':yytext}

"??"				return {type: '??', 'content':yytext}

"->"				return {type: '->', 'content':yytext}
";"				return {type: ';', 'content':yytext}
"+"				return {type: '+', 'content':yytext}
"-"				return {type: '-', 'content':yytext}
"*"				return {type: '*', 'content':yytext}
"/"				return {type: '/', 'content':yytext}
"("				return {type: '(', 'content':yytext}
")"				return {type: ')', 'content':yytext}
"="				return {type: '=', 'content':yytext}
"{"				return {type: '{', 'content':yytext}
"}"				return {type: '}', 'content':yytext}
"["				return {type: '[', 'content':yytext}
"]"				return {type: ']', 'content':yytext}
"?"				return {type: '?', 'content':yytext}
"!"				return {type: '!', 'content':yytext}
","				return {type: ',', 'content':yytext}
":"				return {type: ':', 'content':yytext}
"."				return {type: '.', 'content':yytext}

"else"				return {type: 'else', 'content':yytext}
"func"				return {type: 'func', 'content':yytext}
"if"				return {type: 'if', 'content':yytext}
"nil"				return {type: 'nil', 'content':yytext}
"print"				return {type: 'print', 'content':yytext}
"return"				return {type: 'return', 'content':yytext}
"while"				return {type: 'while', 'content':yytext}
"var"				return {type: 'var', 'content':yytext}

"true"				return {type: 'true', 'content':yytext}
"false"				return {type: 'false', 'content':yytext}

"Int"				return {type: 'Int', 'content':yytext}
"Bool"				return {type: 'Bool', 'content':yytext}
"String"				return {type: 'String', 'content':yytext}
"Void"				return {type: 'Void', 'content':yytext}

"cast"				return {type: 'cast', 'content':yytext}

"class"				return {type: 'class', 'content':yytext}
"init"				return {type: 'init', 'content':yytext}
"static"				return {type: 'static', 'content':yytext}
"super"				return {type: 'super', 'content':yytext}
"override"				return {type: 'override', 'content':yytext}

[0-9]+("."[0-9]+)?\b				return {type:  'ICONST', 'content':yytext}
"0x"[0-9A-Fa-f]+				return {type:  'ICONST', 'content':yytext}
[a-z][a-zA-Z0-9]*				return {type:  'IDENT', 'content':yytext}
[A-Z][a-zA-Z0-9]*				return {type:  'CLASSNAME', 'content':yytext}
[\"]([^\\\"]|\\.)*[\"]				return {type:  'SCONST', 'content':yytext}

<<EOF>>				return {type:  'EOF', 'content':yytext}
.				return {type:  'INVALID', 'content':yytext}
%%