//The lexical analyzer is a module now.
function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
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
			
			//UPDATING THIS BLOCK TO ACCOMODATE THE SCIENTIFIC NOTATION FEATURE
			//and also, the digit literal lexemes can now store negative whole numbers,
			//negative decimal places, and last but deffo not least, negative coefficients with negative
			//exponents. The exponent range is from +99 to -99.
			//The digits are positive by default. Put a negative sign before a digit to make the literal
			//negative. Putting a positive sign before a digit is totally optional.
			if(number.match(/^([-+]\d+|[0-9]+)$/)){
                		tokens.push({ type: 'integer', value: number });
            		} else if (number.match(/^([-+]\d+\.[0-9]*|[0-9]+\.\d*)$/)) {
				tokens.push({ type: 'double', value: number });
			//ADDED THIS LINE
			} else if (number.match(/^(([-+]\d{1,2}|\d{1,2})\.[0-9]+[Ee]([-+]\d{1,2}|\d{1,2}))$/)) {
				tokens.push({ type: 'scientific', value: number });	
			} else {
				console.log(`Invalid digit lexeme: ${number}`)
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

			
			if (identifier.match(/^(this|class|return|null|function|pass)$/)) {
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
				
				//SINGLE COMMENT IGNORER IS NOW FULLY OPERATIONAL
				if (op.match(/^([\/]{2})$/) || el.match(/^#$/)) {
					el = expr[++where];
					while (el.match(/[^\n]/)) {
						if (where == expr.length - 1) {
							break;
						}
						el = expr[++where];
					}
				}
				/////////////////////////////
				
				
				/* multi comment handler is next.
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

				//UPDATED BREAK LOOP CONDITION
				if (where == expr.length - 1 || el.match(/\n/)) {
					break;
				}
				el = expr[++where];
			}

			////////////MADE SLIGHTLY BETTER SEARCH PATTERNS 
			if (op.match(/^([|]{2}|[&]{2}|!)$/)) {
				tokens.push({ type: 'logical', value: op });
				//fixed this regexp
			} else if (op.match(/^([-]{1,2}|[+]{1,2}|[*]{1,2}|[\/%])$/)) {
				tokens.push({ type: 'math', value: op });
			} else if (op.match(/^([\[\]\(\)\{\}]|\.{3}|\.|[,;&:])$/)) {
				tokens.push({ type: 'punctuation', value: op });
			} else if (op.match(/^([<>?]|[<>!=]=|[!=]==)$/)) {
				tokens.push({ type: 'comparisons', value: op });
			} else if (op.match(/^([-+*\/%*]=|\*{2}=)$/)) {
				tokens.push({ type: 'assignments', value: op });
			//ADDED THIS LINE
			} else if (op.match(/^([\/]{2})$/)) {
				console.log(`Single line comment found. Ignore`);
			//ADDED THIS LINE AS WELL
			} else if (op.match(/^(\/[*]|[*]\/)$/)) {
				console.log(`Multi line comment found. Ignore`);		
			} else {
				console.log(`Invalid operator lexeme: ${op}`);
			}
		} 
		
		else if (el.match(/['"]/)){
		/*Please work on the string handler
			let stringValue = '';
	
			el = expr[++where];

			/////Specifically this loop//////
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
			
			
		} else {
			console.log(`Invalid character: ${el}`);
		}
	
	}

	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

module.exports = {Lexer}

