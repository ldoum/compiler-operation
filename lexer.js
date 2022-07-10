
var input = ` true false`;

function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
	var symbol_bits = /[-&|!+*\/=<>%:]/;
	var space = /[ ]/;

	for (let where = 0; where < expr.length; where++) {
		var el = expr[where];

		//UPDATED WHITESPACE HANDLER. 
		//Statement is completely optional.
		if (space.test(el)) {
			console.log(`Ignoring whitespace on index ${where}`);
		}
		
		/*NUMBER LITERAL HANDLER IS FIXED. */
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
			
			if(number.match(/^[0-9]+$/)){
                		tokens.push({ type: 'integer', value: number });
            		} else if (number.match(/^[0-9]+\.[0-9]+$/)) {
				tokens.push({ type: 'double', value: number });
			} else {
				console.log(`Invalid digit sequence: ${number}`)
			}
			
		}
		
		//ID HANDLER FIXED
		else if (el.match(identifier_chars)) {
			var identifier = '';

			while (el.match(identifier_chars)) {
				identifier += el;
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			//////////NEW CODE HERE//////////////////
			if (identifier.match(/^(this|class|return|null|function|pass)$/)) {
				return { type: 'reserved', value: identifier };
			} else if (identifier.match(/^(and|or|not)$/)) {
				return { type: 'logical', value: identifier };
			} else if (identifier.match(/^(break|continue)$/)) {
				return { type: 'jumper', value: identifier };
			} else if (identifier.match(/^(for|while|do|in|of)$/)) {
				return { type: 'looper', value: identifier };
			} else if (identifier.match(/^(switch|case|if|else|default|elif)$/)) {
				return { type: 'conditonal', value: identifier };
			} else if (identifier.match(/^(true|false)$/)) {
				return { type: 'boolean', value: identifier };
			} else if (identifier.match(/^(var|string|bool|double|float|int|let|const|void)$/)) {
				return { type: 'declarator', value: identifier };
			} else {
				return { type: 'regular', value: identifier };
			}
		}
		
		//SYMBOL HANDLER FIXED
		else if (el.match(symbol_bits)) {
			var op = '';
			
			
			while (el.match(symbol_bits)) {
				op += el;
				/* KEEP THIS COMMENTED
				// single comment handler
				if (op == '//') {
					while (true) {
						if (where == expr.length - 1) {
							break;
						}

						if (expr[++where].match(/[~]/)) {
							break;
						}
					}
				}
				// multi comment handler
				if (op == '/*') {
					while (true) {
						if (where == expr.length - 1) {
							break;
						}

						if (expr[++where].match(/[*]|\//)) {
							op += el;
							console.log(op);
						}
						if (op.match(/^[*]\/$/)) {
							op = '';
							break;
						}
					}
				}
				*/

				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			//////////NEW CODE HERE//////////////////
			if (op.match(/[|]{2}|[&]{2}|!/)) {
				return { type: 'logical', value: op };
			} else if (op.match(/[-]{1,2}|[+]{1,2}|[*]{1,2}|[\/%]/)) {
				return { type: 'math', value: op };
			} else if (op.match(/[\[\]\(\)\{\}]|\.{3}|\.|[,;&:]/)) {
				return { type: 'punctuation', value: op };
			} else if (op.match(/[<>?]|^[<>!=]=$|[!=]==/)) {
				return { type: 'comparisons', value: op };
			} else if (op.match(/^[-+*\/%*]=$|^\*\*=$/)) {
				return { type: 'assignments', value: op };
			} else {
				console.log(`Invalid operator lexeme: ${op}`);
			}
		} 
		
		else if (el.match(/['"]/)){
		/*WORK ON THE STRING HANDLER
			let stringValue = '';
	
			el = expr[++where];

			while (el.match(/[^"]/)) {
				stringValue += el;

				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];

				if (el.match(/[']/)) {
					stringValue += el;
					if (where < expr.length - 1) {
						el = expr[++where];
					}
				}
			}

			tokens.push({ type: 'string', value: stringValue });*/
		else {
			console.log(`Invalid character: ${el}`);
		}
	
	}

	//This line is optional
	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

console.log(Lexer(input))
