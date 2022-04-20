
/* description: Parses and executes mathematical expressions. */

/* lexical grammar */
%lex
%%

[\ \t\n]+                   /* skip whitespace */
"//".*\n                    /* comments */

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

/lex

/* operator associations and precedence */

%right QUERY COLON
%left OROR
%left ANDAND
%nonassoc EQEQ NEQEQ LESS GREATER LESSEQ GREATEREQ
%right QUERYQUERY
%left PLUS MINUS
%left STAR SLASH
%right BANG UNARY_MINUS
%left DOT

%start Program

%% /* language grammar */

Program
    : Declarations EOF
        { typeof console !== 'undefined' ? console.log($1) : print($1);
          return $1; }
    ;

Statement
    : IF Expression Block                            { $$ = ['SIf', $2, $3, ['SBlock', []]]; }
    | IF Expression Block ELSE Statement             { $$ = ['SIf', $2, $3, $5]; }
    | Block                                          { $$ = [$1]; }
    | WHILE Expression Block                         { $$ = ['SWhile', $2, $3]; }
    | RETURN SEMI                                    { $$ = ['SReturn', ['Nothing']]; }
    | RETURN Expression SEMI                         { $$ = ['SReturn', ['Just', $2]]; }
    | PRINT LPAREN Expression RPAREN SEMI            { $$ = ['SPrint', $3]; }
    | Expression ASSIGN Expression SEMI              { $$ = ['SAssign', $1, $3]; }
    | VAR IDENT COLON Type ASSIGN Expression SEMI    { $$ = ['SVarDecl', $2, $4, $6]; }
    | Expression SEMI                                { $$ = ['SExpr', $1]; }
    ;

Statements 
    :                      { $$ = [] }
    | Statement Statements { $$ = $1.concat($2) }
    ;

Block
    : LBRACE Statements RBRACE  { $$ = ['SBlock', $2] }
    ;

Expression
    : ICONST                                                   { $$ = ['EConstI', Number($1)]; }
    | BCONST                                                   { $$ = ['EConstB', Boolean($1)]; }
    | SCONST                                                   { $$ = ['EConstS', $1]; }
    | IDENT                                                    { $$ = ['EVar', $1]; }

    | MINUS Expression %prec UNARY_MINUS                       { $$ = ['EUop', 'NegOp', $2]; }
    | BANG Expression                                          { $$ = ['EUop', 'NotOp', $2]; }

    | Expression PLUS Expression                               { $$ = ['EBop', $1, 'PlusOp', $3]; }
    | Expression MINUS Expression                              { $$ = ['EBop', $1, 'MinusOp', $3]; }
    | Expression STAR Expression                               { $$ = ['EBop', $1, 'TimesOp', $3]; }
    | Expression SLASH Expression                              { $$ = ['EBop', $1, 'DivOp', $3]; }

    | Expression EQEQ Expression                               { $$ = ['EBop', $1, 'EqOp', $3]; }
    | Expression NEQEQ Expression                              { $$ = ['EBop', $1, 'NeOp', $3]; }
    | Expression LESS Expression                               { $$ = ['EBop', $1, 'LtOp', $3]; }
    | Expression GREATER Expression                            { $$ = ['EBop', $1, 'GtOp', $3]; }
    | Expression LESSEQ Expression                             { $$ = ['EBop', $1, 'LeOp', $3]; }
    | Expression GREATEREQ Expression                          { $$ = ['EBop', $1, 'GeOp', $3]; }

    | Expression ANDAND Expression                             { $$ = ['EBop', $1, 'AndOp', $3]; }
    | Expression OROR Expression                               { $$ = ['EBop', $1, 'OrOp', $3]; }

    | Expression DOT IDENT                                     { $$ = ['EProj', $1, $3]; }

    | CAST Type LPAREN Expression RPAREN                       { $$ = ['EConvert', $2, $4]; }

    | NIL                                                      { $$ = ['ENil']; }
    | Expression QUERYQUERY Expression                         { $$ = ['ECoalesce', $1, $3]; }

    | Expression QUERY Expression COLON Expression             { $$ = ['ETernary', $1, $3, $5]; }

    | IDENT LPAREN Expressionz RPAREN                          { $$ = ['ECall', $1, $3]; }

    | LPAREN Expression RPAREN                                 { $$ = [$2]; }

    | CLASSNAME DOT IDENT LPAREN Expressionz RPAREN            { $$ = ['EStaticCall', $1, $3, $5]; }
    | Expression DOT IDENT LPAREN Expressionz RPAREN           { $$ = ['EInvoke', $1, $3, $5]; }
    | CLASSNAME LPAREN Expressionz RPAREN                      { $$ = ['ENew', $1, $3]; }

    | LBRACKET Recordz RBRACKET                                { $$ = ['ERecord', $2]; }

    ;

Expressionz
    :                                                          { $$ = [] }
    | Expressions                                              { $$ = $1 }
    ;

Expressions
    : Expression { $$ = [$1] }
    | Expression COMMA Expressions { $$ = $1.concat($3) }
    ;

Type 
    : INT    { $$ = ['IntTy']; }
    | BOOL   { $$ = ['BoolTy']; }
    | STRING { $$ = ['StringTy']; }
    | Type QUERY { $$ = ['OptionalTy', $1]; }
    | VOID   { $$ = ['VoidTy']; }
    | CLASSNAME   { $$ = ['ClassTy', $1]; }
    | LBRACKET Parameterz RBRACKET { $$ = ['RecordTy', $2]; }
    ;

Declaration
    : FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block  { $$ = ['DeclFunc', $2, $4, $7, $8]; }
    | CLASS CLASSNAME Superclass LBRACE Fieldz Constructor Methodz RBRACE { $$ = ['DeclClass', $2, $3, $5, $6, $7]; }
    ;

Declarations
    : { $$ = []; }
    | Declaration Declarations { $$ = $1.concat($2); }
    ;

Parameterz
    : { $$ = []; }
    | Parameters { $$ = $1; }
    ;

Parameters
    : Parameter { $$ = [$1]; }
    | Parameter COMMA Parameters { $$ = $1.concat($3); }
    ;

Parameter
    : IDENT COLON Type { $$ = [$1, $3]; }
    ;

Recordz 
    : { $$ = []; }
    | Records { $$ = $1; }
    ;

Records
    : Record { $$ = [$1]; }
    | Record COMMA Records { $$ = $1.concat($3); }
    ;

Record
    : IDENT ASSIGN Expression { $$ = [$1, $3]; }
    ;

Superclass
    :                   { $$ = ['Nothing']; }
    | COLON CLASSNAME   { $$ = ['Just', $2]; }
    ;

Field
    : VAR IDENT COLON Type SEMI   { $$ = [$2, $4]; }
    ;

Fieldz
    : { $$ = [] }
    | Field Fieldz { $$ = $1.concat($2) }
    ;

Constructor
    : INIT LPAREN Parameterz RPAREN SuperInit Block { $$ = [$3, $5, $6]; }
    ;

SuperInit
    :                                         { $$ = ['Nothing'] }
    | COLON SUPER LPAREN Expressionz RPAREN   { $$ = ['Just', $4]; }
    ;

Method
    : FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = ['Virtual', $2, $4, $7, $8]; }
    | OVERRIDE FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = ['Override', $3, $5, $8, $9]; }
    | STATIC FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = ['Static', $3, $5, $8, $9]; }
    ;

Methodz
    : { $$ = []; }
    | Method Methodz { $$ = $1.concat($2); }
    ;
