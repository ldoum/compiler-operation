//The lexical analyzer is a module now.
function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
	//Regular expression for the operator lexeme handler updated.
	var symbol_bits = /[-&|!+*\/=<>%:\]\[\(\)\{\}\.,;?]/;
	var space = /[ ]/;

	for (let where = 0; where < expr.length; where++) {
		var el = expr[where];

		if (el.match(space)) {
			console.log(`Ignoring whitespace on index ${where}`);
		}
		
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
		
		else if (el.match(identifier_chars)) {
			var identifier = '';

			while (el.match(identifier_chars)) {
				identifier += el;
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			//UPDATED THIS
			if (identifier.match(/^(this|class|tokens.push()|null|function|pass)$/)) {
				tokens.push({ type: 'reserved', value: identifier })
			} else if (identifier.match(/^(and|or|not)$/)) {
				tokens.push({ type: 'logical', value: identifier })
			} else if (identifier.match(/^(break|continue)$/)) {
				tokens.push({ type: 'jumper', value: identifier })
			} else if (identifier.match(/^(for|while|do|in|of)$/)) {
				tokens.push({ type: 'looper', value: identifier })
			} else if (identifier.match(/^(switch|case|if|else|default|elif)$/)) {
				tokens.push({ type: 'conditonal', value: identifier })
			} else if (identifier.match(/^(true|false)$/)) {
				tokens.push({ type: 'boolean', value: identifier })
			} else if (identifier.match(/^(var|string|bool|double|float|int|let|const|void)$/)) {
				tokens.push({ type: 'declarator', value: identifier })
			} else {
				tokens.push({ type: 'regular', value: identifier })
			}
		}
		
		
		else if (el.match(symbol_bits)) {
			var op = '';
			
			
			while (el.match(symbol_bits)) {
				op += el;
				/* KEEP THIS COMMENTED STILL
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

			//////////UPDATED THIS TOO//////////////////
			if (op.match(/[|]{2}|[&]{2}|!/)) {
				tokens.push( { type: 'logical', value: op })
			} else if (op.match(/[-]{1,2}|[+]{1,2}|[*]{1,2}|[\/%]/)) {
				tokens.push( { type: 'math', value: op })
			} else if (op.match(/[\[\]\(\)\{\}]|\.{3}|\.|[,;&:]/)) {
				tokens.push( { type: 'punctuation', value: op })
			} else if (op.match(/[<>?]|^[<>!=]=$|[!=]==/)) {
				tokens.push( { type: 'comparisons', value: op })
			} else if (op.match(/^[-+*\/%*]=$|^\*\*=$/)) {
				tokens.push( { type: 'assignments', value: op })
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

	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

module.exports = {Lexer}

