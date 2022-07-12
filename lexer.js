//Detailed markdown explanation of the file overhaul located below this module
function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
	//UPDATED VARIABLE WITH NEW NAME. 'symbol_bits' to 'opkeys'
	var opkeys = /[-&|!\+\*\/=<>%?]/;
	//NEW VARIABLE
	var symbols = /[.,;:\[\]\{\}\(\)]/;
	//NEW VARIABLE. COMMENT KEYS
	var ignoreme = /[`#]/;
	var space = /[ ]/;

	for (let where = 0; where < expr.length; where++) {
		var el = expr[where];

		//white space handler
		if (el.match(space)) {
			console.log(`Ignoring whitespace on index ${where}`);
		}
		//digit handler
		else if (el.match(digits)) {
			var number = '';

			while (el.match(digits)) {
				number += el;

				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];

				
				if (el.match(/[\.]/)) {
					
					number += el;
					if (where == expr.length - 1) {
						break;
					}
					el = expr[++where];
				}
			}
			
			if(number.match(/^([-+]\d+|[0-9]+)$/)){
                		tokens.push({ type: 'integer', value: number });
            		} else if (number.match(/^([-+]\d+\.[0-9]*|[0-9]+\.\d*)$/)) {
				tokens.push({ type: 'double', value: number });
			} else if (number.match(/^(([-+]\d{1,2}|\d{1,2})\.[0-9]+[Ee]([-+]\d{1,2}|\d{1,2}))$/)) {
				tokens.push({ type: 'scientific', value: number });	
			} else {
				console.log(`Invalid digit lexeme: ${number}`)
			}
			
		}
		//identifier handler
		else if (el.match(identifier_chars)) {
			var identifier = '';

			while (el.match(identifier_chars)) {
				identifier += el;
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			//CHANGED TOKEN TYPE VALUES

			//words				 old name            new name
			//and, or, not      		'logical'      to     'logic'
			//non-reserved			'identifier'   to     'name'
			//var, let, bool:   		'declarator'   to     'declare'
			//continue:					      'skip'
			//break:               		'jumper'       to     'jump'
			//for, while, do:      		'looper'       to     'loop'
			//switch,else,if:  		'conditional'    to   'decision'
			if (identifier.match(/^(this|class|return|null|function|pass)$/)) {
				tokens.push({ type: 'reserved', value: identifier });
			} else if (identifier.match(/^(and|or|not)$/)) {
				tokens.push({ type: 'logic', value: identifier });
			//PUT KEYWORD CONTINUE ON A SEPARATE STATEMENT. TOKEN TYPE IS SKIP
			} else if (identifier.match(/^(continue)$/)) {
				tokens.push({ type: 'skip', value: identifier });
			} else if (identifier.match(/^(break)$/)) {
				tokens.push({ type: 'jump', value: identifier });
			} else if (identifier.match(/^(for|while|do|in|of)$/)) {
				tokens.push({ type: 'loop', value: identifier });
			} else if (identifier.match(/^(switch|case|if|else|default|elif)$/)) {
				tokens.push({ type: 'decision', value: identifier });
			} else if (identifier.match(/^(true|false)$/)) {
				tokens.push({ type: 'boolean', value: identifier });
			} else if (identifier.match(/^(var|string|bool|double|float|int|let|const|void)$/)) {
				tokens.push({ type: 'declare', value: identifier });
			} else {
				tokens.push({ type: 'name', value: identifier });
			}
		//UPDATED THIS CONDITION. ACCEPTS OP KEYS OR IGNORE KEYS
		} else if (el.match(opkeys) || el.match(ignoreme)) {
			var op = '';
			
			
			while (el.match(opkeys) || el.match(ignoreme)) {
				op += el;
				
				//SINGLE LINE COMMENT IGNORER UPDATED
				if (op.match(/^([\/]{2})$/) || el.match(/^#$/)) {
					
					console.log(`[${op}] Single line comment found. Ignore`);
					el = expr[++where];
					
					while (el.match(/[^\n]/)) {
						
						if (where == expr.length - 1) {
							break;
						}
			
						//ADDED THIS STATEMENT.
						if (el.match(/\n/)) {
							break;
						}
						el = expr[++where];
					}
				}
				
				
				// MULTI LINE COMMENT IGNORER. SEMI OPERATIONAL. NEEDS FIXING
				/*
				if (op.match(/^(\/\*|`{3})$/)) {
					el = expr[++where];

					console.log(`[${op}] Multi line comment found. Ignore`);

					let brake = '';
					if (el.match(/[`\*\/]/)) {
						brake += el;
					}

					while (!(brake.match(/^(`{3}|\*\/)$/))) {
						if (where == expr.length - 1) {
							break;
						}
						el = expr[++where];
					}
				}*/
				///////////////////////////////////////////////

				//REMOVED 2ND CONDITION  el.match(/\n/)
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			//UPDATED THIS CONDITIONAL BLOCK
			if (op.match(/^([|]{2}|[&]{2}|!)$/)) {
				tokens.push({ type: 'logic', value: op });
			} else if (op.match(/^([-]{1,2}|[+]{1,2}|[*]{1,2}|[\/%])$/)) {
				tokens.push({ type: 'math', value: op });
				
			/*REMOVED THIS ELSE IF STATEMENT. WILL BE USED TO FORM SYMBOL HANDLER
			} else if (op.match(/^([\[\]\(\)\{\}]|\.{3}|\.|[,;&:])$/)) {
				tokens.push({ type: 'punctuation', value: op });*/
				
			} else if (op.match(/^([<>?]|[<>!=]=|[!=]==)$/)) {
				tokens.push({ type: 'compare', value: op });
				
			//UPDATED THIS REGEX CONDITION. = OP NOW ACCEPTED
			} else if (op.match(/^([-+*\/%*]=|\*{2}=|=)$/)) {
				tokens.push({ type: 'assign', value: op });
			} else {
				console.log(`Invalid operator lexeme: ${op}`);
			}
			
		//ADDED THIS BLOCK
		} else if (el.match(symbols)) {

			if (el.match(/^[\(\)]$/)) {
				tokens.push({ type: 'specific', value: el });
			} else if (el.match(/^[\{\}:]$/)) {
				tokens.push({ type: 'group', value: el });
			} else if (el.match(/^[\[\]]$/)) {
				tokens.push({ type: 'order', value: el });
			} else if (el.match(/^;$/)) {
				tokens.push({ type: 'endline', value: el });
			} else if (el.match(/^,$/)) {
				tokens.push({ type: 'next', value: el });
			} else if (el.match(/^\.$/)) {
				tokens.push({ type: 'access', value: el });
			}
		
		////////////////////////////////////////////////////////////////////////////	
		//////////////MERGE THESE QUOTE HANDLERS ///////////////////////////////////
			
		//DOUBLE QUOTE HANDLER IS NOW OPERATIONAL
		} else if (el.match(/^["]$/)) {
			let stringDouble = '';

			//Add opening quote
			stringDouble += el;
			el = expr[++where];

			while (el.match(/[^"]/)) {
				//break loop if EOF is reached
				if (where == expr.length - 1) {
					break;
				}
				//otherwise, add any character then skip 
				stringDouble += el;
				el = expr[++where];
				
			}
			//Finally, add closing quote
			stringDouble += el;

			//Check if opening and closing strings match
			if (stringDouble[stringDouble.length - 1].match(/"/)) {
				tokens.push({ type: 'double quote string', value: stringDouble });
			} else {
				console.log(`Double quote string ${stringDouble} improperly set. `);
			}
			
		//SINGLE QUOTE HANDLER IS NOW OPERATIONAL
		} else if (el.match(/^[']$/)) {
			let stringSingle = '';

			//Add opening quote then skip  
			stringSingle += el; 
			el = expr[++where];

			while (el.match(/[^']/)) {
				//break loop if EOF is reached
				if (where == expr.length - 1) {
					break;
				}
				//otherwise, add any character then skip 
				stringSingle += el;
				el = expr[++where];

			}
			//Finally, add closing quote
			stringSingle += el;

			//Check if opening and closing strings match
			if (stringSingle[stringSingle.length - 1].match(/'/)) {
				tokens.push({ type: 'single quote string', value: stringSingle });
			} else {
				console.log(`Single quote string ${stringSingle} improperly set. `);
			}
	
		//////////////MERGE THESE QUOTE HANDLERS ///////////////////////////////////
		////////////////////////////////////////////////////////////////////////////	
			
			
		} else {
			console.log(`Unknown character at index #${where}: ${el}`);
		}
	
	}

	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

module.exports = {Lexer}

/*
VERY DETAILED EXPLANATION OF UPDATES TO THIS COMMIT: In markdown
*Already included in Lexer Tune Up page of the project wiki but putting this here*

*   Added conditional block that makes tokens from individual symbol characters
    *  `.`  `,`  `;`  `:`  `[`  `]`  `{`  `}`  `(`  `)`
*   Rewrote block that makes tokens from a sequence of operator characters
    *   `-` `&` `|` `+` `*` `/` `=` `<` `>` `%` `?` `!`
    * Also includes alternative characters for comments
        *  `#` `<backtick * 3>` 
    *   Updated the single line comment ignorer code
    *   Included the multi line comment ignorer. Still needs fixing
*   Changed token type names representing different categories of reserved keywords in id token generator block 
    * Reasons:
        1. to make the lexical info a bit more meaningful for Syntax and/or Semantic Analyses
        2. because the names were better than the generic, bland ones like `reserved_keyword` or `identifier` or `operator`
*   Updated the regex condition that makes assign type tokens so the `=` sign can be accepted
    * New regex:  `/^([-+*\/%*]=|\*{2}=|=)$/`
*   Added two blocks that each make string literal tokens. 
    *   The bodies of the single quote and double quote handlers are nearly the same, so I'll merge them
        *   Quote is added first, then other characters, and finally the closing quote
            *   The string literal is inspected to see if the quotes match.
    *   These handlers can be updated.



*/

