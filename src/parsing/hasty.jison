
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
        { return $1; }
    ;

Statement
    : IF Expression Block                            { $$ = {statementType: 'If', condition: $2, ifCase: $3, elseCase: {statementType: 'Block', block: []}, startLine: @$.first_line, endLine: @$.last_line, hasElse: 0}; }
    | IF Expression Block ELSE Statement             { $$ = {statementType: 'If', condition: $2, ifCase: $3, elseCase: $5, startLine: @$.first_line, endLine: @$.last_line, hasElse: 1}; }
    | Block                                          { $$ = {statementType: 'Block', block: $1, startLine: @$.first_line, endLine: @$.last_line}; }
    | WHILE Expression Block                         { $$ = {statementType: 'While', condition: $2, body: $3, startLine: @$.first_line, endLine: @$.last_line}; }
    | RETURN SEMI                                    { $$ = {statementType: 'Return'}; }
    | RETURN Expression SEMI                         { $$ = {statementType: 'Return', returnValue: $2}; }
    | PRINT LPAREN Expression RPAREN SEMI            { $$ = {statementType: 'Print', printValue: $3}; }
    | Expression ASSIGN Expression SEMI              { $$ = {statementType: 'Assign', leftSide: $1, rightSide: $3}; }
    | VAR IDENT COLON Type ASSIGN Expression SEMI    { $$ = {statementType: 'VarDecl', leftSide: $2, type: $4, rightSide: $6}; }
    | Expression SEMI                                { $$ = {statementType: 'Expr', expr: $1}; }
    ;

Statements 
    :                         { $$ = [] }
    | Statement Statements    { $$ = [$1].concat($2) }
    ;

Block
    : LBRACE Statements RBRACE    { $$ = {statementType: 'Block', block: $2, startLine: @$.first_line, endLine: @$.last_line} }
    ;

Expression
    : ICONST                                                   { $$ = {exprType: 'ConstI', value: Number($1)}; }
    | BCONST                                                   { $$ = {exprType: 'ConstB', value: Boolean($1)}; }
    | SCONST                                                   { $$ = {exprType: 'ConstS', value: $1}; }
    | IDENT                                                    { $$ = {exprType: 'Var', identifier: $1}; }

    | MINUS Expression %prec UNARY_MINUS                       { $$ = {exprType: 'Uop', op: 'Neg', expr: $2}; }
    | BANG Expression                                          { $$ = {exprType: 'Uop', op: 'Not', expr: $2}; }

    | Expression PLUS Expression                               { $$ = {exprType: 'Bop', expr1: $1, op: 'Plus', expr2: $3}; }
    | Expression MINUS Expression                              { $$ = {exprType: 'Bop', expr1: $1, op: 'Minus', expr2: $3}; }
    | Expression STAR Expression                               { $$ = {exprType: 'Bop', expr1: $1, op: 'Times', expr2: $3}; }
    | Expression SLASH Expression                              { $$ = {exprType: 'Bop', expr1: $1, op: 'Div', expr2: $3}; }

    | Expression EQEQ Expression                               { $$ = {exprType: 'Bop', expr1: $1, op: 'Eq', expr2: $3}; }
    | Expression NEQEQ Expression                              { $$ = {exprType: 'Bop', expr1: $1, op: 'Ne', expr2: $3}; }
    | Expression LESS Expression                               { $$ = {exprType: 'Bop', expr1: $1, op: 'Lt', expr2: $3}; }
    | Expression GREATER Expression                            { $$ = {exprType: 'Bop', expr1: $1, op: 'Gt', expr2: $3}; }
    | Expression LESSEQ Expression                             { $$ = {exprType: 'Bop', expr1: $1, op: 'Le', expr2: $3}; }
    | Expression GREATEREQ Expression                          { $$ = {exprType: 'Bop', expr1: $1, op: 'Ge', expr2: $3}; }

    | Expression ANDAND Expression                             { $$ = {exprType: 'Bop', expr1: $1, op: 'And', expr2: $3}; }
    | Expression OROR Expression                               { $$ = {exprType: 'Bop', expr1: $1, op: 'Or', expr2: $3}; }

    | Expression DOT IDENT                                     { $$ = {exprType: 'Proj', expr: $1, value: $3}; }

    | CAST Type LPAREN Expression RPAREN                       { $$ = {exprType: 'Convert', targetType: $2, expr: $4}; }

    | NIL                                                      { $$ = {exprType: 'Nil'}; }
    | Expression QUERYQUERY Expression                         { $$ = {exprType: 'Coalesce', expr1: $1, expr2: $3}; }

    | Expression QUERY Expression COLON Expression             { $$ = {exprType: 'Ternary', expr1: $1, expr2: $3, expr3: $5}; }

    | IDENT LPAREN Expressionz RPAREN                          { $$ = {exprType: 'Call', functionName: $1, arguments: $3}; }

    | LPAREN Expression RPAREN                                 { $$ = $2; }

    | CLASSNAME DOT IDENT LPAREN Expressionz RPAREN            { $$ = {exprType: 'StaticCall', className: $1, functionName: $3, arguments: $5}; }
    | Expression DOT IDENT LPAREN Expressionz RPAREN           { $$ = {exprType: 'Invoke', className: $1, functionName: $3, arguments: $5}; }
    | CLASSNAME LPAREN Expressionz RPAREN                      { $$ = {exprType: 'New', className: $1, arguments: $3}; }

    | LBRACKET Recordz RBRACKET                                { $$ = {exprType: 'Record', records: $2}; }

    ;

Expressionz
    :                { $$ = [] }
    | Expressions    { $$ = $1 }
    ;

Expressions
    : Expression                      { $$ = [$1] }
    | Expression COMMA Expressions    { $$ = [$1].concat($3) }
    ;

Type 
    : INT                             { $$ = {type: 'Int'}; }
    | BOOL                            { $$ = {type: 'Bool'}; }
    | STRING                          { $$ = {type: 'String'}; }
    | Type QUERY                      { $$ = {type: 'Optional', optionalType: $1}; }
    | VOID                            { $$ = {type: 'Void'}; }
    | CLASSNAME                       { $$ = {type: 'Class', className: $1}; }
    | LBRACKET Parameterz RBRACKET    { $$ = {type: 'Record', parameters: $2}; }
    ;

Declaration
    : FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block  
        { $$ = {declType: 'Func', functionName: $2, parameters: $4, returnType: $7, body: $8, startLine: @$.first_line, endLine: @$.last_line}; }
    | CLASS CLASSNAME Superclass LBRACE Fieldz Constructor Methodz RBRACE 
        { $$ = {declType: 'Class', className: $2, superClass: $3, fields: $5, constructor: $6, methods: $7, startLine: @$.first_line, endLine: @$.last_line}; }
    ;

Declarations
    :                             { $$ = []; }
    | Declaration Declarations    { $$ = [$1].concat($2); }
    ;

Parameterz
    :               { $$ = []; }
    | Parameters    { $$ = $1; }
    ;

Parameters
    : Parameter                     { $$ = [$1]; }
    | Parameter COMMA Parameters    { $$ = [$1].concat($3); }
    ;

Parameter
    : IDENT COLON Type    { $$ = {identifier: $1, type: $3}; }
    ;

Recordz 
    :            { $$ = []; }
    | Records    { $$ = $1; }
    ;

Records
    : Record                  { $$ = [$1]; }
    | Record COMMA Records    { $$ = [$1].concat($3); }
    ;

Record
    : IDENT ASSIGN Expression    { $$ = {identifier: $1, value: $3}; }
    ;

Superclass
    :                    { $$ = undefined; }
    | COLON CLASSNAME    { $$ = $2; }
    ;

Field
    : VAR IDENT COLON Type SEMI    { $$ = {identifier: $2, type: $4}; }
    ;

Fieldz
    :                 { $$ = [] }
    | Field Fieldz    { $$ = [$1].concat($2) }
    ;

Constructor
    : INIT LPAREN Parameterz RPAREN SuperInit Block    { $$ = {parameters: $3, superInit: $5, body: $6, startLine: @$.first_line, endLine: @$.last_line}; }
    ;

SuperInit
    :                                          { $$ = undefined }
    | COLON SUPER LPAREN Expressionz RPAREN    { $$ = $4; }
    ;

Method
    : FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = {type: 'Virtual', name: $2, parameters: $4, returnType: $7, body: $8, startLine: @$.first_line, endLine: @$.last_line}; }
    | OVERRIDE FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = {type: 'Override', name: $3, parameters: $5, returnType: $8, body: $9, startLine: @$.first_line, endLine: @$.last_line}; }
    | STATIC FUNC IDENT LPAREN Parameterz RPAREN ARROW Type Block         
         { $$ = {type: 'Static', name: $3, parameters: $5, returnType: $8, body: $9, startLine: @$.first_line, endLine: @$.last_line}; }
    ;

Methodz
    :                   { $$ = []; }
    | Method Methodz    { $$ = [$1].concat($2); }
    ;
