/* generated by jison-lex 0.3.4 */
var hastyLexerForLinting = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"moduleName":"hastyLexerForLinting"},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return {type:  'NEWLINE', 'content':yy_.yytext}
break;
case 2:return {type:  'COMMENT', 'content':yy_.yytext}
break;
case 3:return {type: '==', 'content':yy_.yytext}
break;
case 4:return {type: '!=', 'content':yy_.yytext}
break;
case 5:return {type: '<=', 'content':yy_.yytext}
break;
case 6:return {type: '>=', 'content':yy_.yytext}
break;
case 7:return {type: '<', 'content':yy_.yytext}
break;
case 8:return {type: '>', 'content':yy_.yytext}
break;
case 9:return {type: '&&', 'content':yy_.yytext}
break;
case 10:return {type: '||', 'content':yy_.yytext}
break;
case 11:return {type: '??', 'content':yy_.yytext}
break;
case 12:return {type: '->', 'content':yy_.yytext}
break;
case 13:return {type: ';', 'content':yy_.yytext}
break;
case 14:return {type: '+', 'content':yy_.yytext}
break;
case 15:return {type: '-', 'content':yy_.yytext}
break;
case 16:return {type: '*', 'content':yy_.yytext}
break;
case 17:return {type: '/', 'content':yy_.yytext}
break;
case 18:return {type: '(', 'content':yy_.yytext}
break;
case 19:return {type: ')', 'content':yy_.yytext}
break;
case 20:return {type: '=', 'content':yy_.yytext}
break;
case 21:return {type: '{', 'content':yy_.yytext}
break;
case 22:return {type: '}', 'content':yy_.yytext}
break;
case 23:return {type: '[', 'content':yy_.yytext}
break;
case 24:return {type: ']', 'content':yy_.yytext}
break;
case 25:return {type: '?', 'content':yy_.yytext}
break;
case 26:return {type: '!', 'content':yy_.yytext}
break;
case 27:return {type: ',', 'content':yy_.yytext}
break;
case 28:return {type: ':', 'content':yy_.yytext}
break;
case 29:return {type: '.', 'content':yy_.yytext}
break;
case 30:return {type: 'else', 'content':yy_.yytext}
break;
case 31:return {type: 'func', 'content':yy_.yytext}
break;
case 32:return {type: 'if', 'content':yy_.yytext}
break;
case 33:return {type: 'nil', 'content':yy_.yytext}
break;
case 34:return {type: 'print', 'content':yy_.yytext}
break;
case 35:return {type: 'return', 'content':yy_.yytext}
break;
case 36:return {type: 'while', 'content':yy_.yytext}
break;
case 37:return {type: 'var', 'content':yy_.yytext}
break;
case 38:return {type: 'true', 'content':yy_.yytext}
break;
case 39:return {type: 'false', 'content':yy_.yytext}
break;
case 40:return {type: 'Int', 'content':yy_.yytext}
break;
case 41:return {type: 'Bool', 'content':yy_.yytext}
break;
case 42:return {type: 'String', 'content':yy_.yytext}
break;
case 43:return {type: 'Void', 'content':yy_.yytext}
break;
case 44:return {type: 'cast', 'content':yy_.yytext}
break;
case 45:return {type: 'class', 'content':yy_.yytext}
break;
case 46:return {type: 'init', 'content':yy_.yytext}
break;
case 47:return {type: 'static', 'content':yy_.yytext}
break;
case 48:return {type: 'super', 'content':yy_.yytext}
break;
case 49:return {type: 'override', 'content':yy_.yytext}
break;
case 50:return {type:  'ICONST', 'content':yy_.yytext}
break;
case 51:return {type:  'ICONST', 'content':yy_.yytext}
break;
case 52:return {type:  'IDENT', 'content':yy_.yytext}
break;
case 53:return {type:  'CLASSNAME', 'content':yy_.yytext}
break;
case 54:return {type:  'SCONST', 'content':yy_.yytext}
break;
case 55:return {type:  'EOF', 'content':yy_.yytext}
break;
case 56:return {type:  'INVALID', 'content':yy_.yytext}
break;
}
},
rules: [/^(?:[\ \t]+)/,/^(?:\n)/,/^(?:\/\/.*\n)/,/^(?:==)/,/^(?:!=)/,/^(?:<=)/,/^(?:>=)/,/^(?:<)/,/^(?:>)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:\?\?)/,/^(?:->)/,/^(?:;)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:\()/,/^(?:\))/,/^(?:=)/,/^(?:\{)/,/^(?:\})/,/^(?:\[)/,/^(?:\])/,/^(?:\?)/,/^(?:!)/,/^(?:,)/,/^(?::)/,/^(?:\.)/,/^(?:else\b)/,/^(?:func\b)/,/^(?:if\b)/,/^(?:nil\b)/,/^(?:print\b)/,/^(?:return\b)/,/^(?:while\b)/,/^(?:var\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:Int\b)/,/^(?:Bool\b)/,/^(?:String\b)/,/^(?:Void\b)/,/^(?:cast\b)/,/^(?:class\b)/,/^(?:init\b)/,/^(?:static\b)/,/^(?:super\b)/,/^(?:override\b)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:0x[0-9A-Fa-f]+)/,/^(?:[a-z][a-zA-Z0-9]*)/,/^(?:[A-Z][a-zA-Z0-9]*)/,/^(?:[\"]([^\\\"]|\\.)*[\"])/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56],"inclusive":true}}
});
return lexer;
})();

export {hastyLexerForLinting};