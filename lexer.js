function Lexer(expr) {
	
	var tokens = [];
	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
	var opkeys = /[-&|!\+\*\/=<>%?]/;
	var symbols = /[.,;:\[\]\{\}\(\)]/;
	var space = /[ ]/;

	//expression substring reader head
	for (let readhead = 0; readhead < expr.length; readhead++) {
		//start from the first element
		var el = expr[readhead];

		//white space ignorer
		if (el.match(space)) {
			console.log(`Ignoring whitespace on index ${readhead}`);
			
		//digit handler
		} else if (el.match(digits)) {
			
			//number literal variable
			var number = '';

			while (el.match(digits)) {
				//add digit character
				number += el;

				//If End Of String (EOS) reached, stop
				if (readhead == expr.length - 1) {
					//notify when lexer finishes reading this string
					console.log(`Finished reading the string`);
					break;
				}
				//go to next element
				el = expr[++readhead];

				//updated this block for scientific notation
				if (el.match(/[-+\.Ee]/)) {
					
					//add that character leading the number literal
					number += el;
					//If End Of String (EOS) reached, stop
					if (readhead == expr.length - 1) {
						//notify when lexer finishes reading this string
						console.log(`Finished reading the string`);
						break;
					}
					//go to next element
					el = expr[++readhead];
				}
			}
			
			//DIGIT TOKEN VALIDATOR AND GENERATOR
			if(number.match(/^(\d+)$/)){
                tokens.push({ type: 'integer', value: number });
            } else if (number.match(/^(\d+\.\d*)$/)) {
				tokens.push({ type: 'double', value: number });
			//Updated regex on this line's condition
			} else if (number.match(/^(\d{1,2}\.[0-9]*[Ee]([-+]\d{1,2}|\d{1,2}))$/)) {
				tokens.push({ type: 'scientific', value: number });	
			} else {
				console.log(`Invalid digit lexeme: ${number}`);
				//included this line so lexer can stop reading the rest of the string. The lexemes before this invalid one will still be tokenized
				break; 
			}
			
		//identifier handler
		} else if (el.match(identifier_chars)) {
			
			//identifier literal variable
			var identifier = '';

			while (el.match(identifier_chars)) {
				
				//Add alphabet character
				identifier += el;
				
				//If EOS reached, stop
				if (readhead == expr.length - 1) {
					console.log(`Finished reading the string`);
					break;
				}
				//go to next element
				el = expr[++readhead];
			}

			//IDENTIFIER TOKEN VALIDATOR AND GENERATOR
			if (identifier.match(/^(this|class|return|null|function|pass)$/)) {
				tokens.push({ type: 'reserved', value: identifier });
			} else if (identifier.match(/^(and|or|not)$/)) {
				tokens.push({ type: 'logic', value: identifier });
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
			
		//MAJOR UPDATE TO THE OPERATOR HANDLER 
		} else if (el.match(opkeys)) {
			
			//operator literal variable
			var op = '';

			while (el.match(opkeys)) {
				//Add operator character
				op += el;

				//If EOS reached, stop
				if (readhead == expr.length - 1) {
					console.log(`Finished reading the string`);
					break;
				}
				
				//go to next element
				el = expr[++readhead];
			}

			//SINGLE LINE COMMENT IGNORER
			if (op.match(/^([\/]{2})$/)) {
				console.log(`[${op}] Single line comment. Start ignoring`);

				//go to next element
				el = expr[++readhead];

				//as long as there is a character that isn't a newline, keep skipping
				while (el.match(/[^\n]/)) {
					//If EOS reached, stop
					if (readhead == expr.length - 1) {
						console.log(`Finished reading the string`);
						break;
					}

					//If newline found, stop ignoring stuff
					if (el.match(/\n/)) {
						break;
					}

					//go to next element
					el = expr[++readhead];
				}
			
			//MULTI LINE COMMENT IGNORER
			} else if (op.match(/^(\/\*)$/)) {
				console.log(`[${op}] Multi line comment. Start ignoring`);

				//go to next element
				el = expr[++readhead];

				//stopper variable
				let stop = ""
				
				//as long as there is a character that isn't a newline, keep skipping 
				while (el.match(/[^\n]/)) {
					//If EOF reached, stop
					if (readhead == expr.length - 1) {
						console.log(`Finished reading the string`);
						break;
					}

					//accepts * or /. update later
					if(el.match(/[\/\*]/)){
						stop += el
					}

					//if stop is */ stop loop
					if (stop.match(/\*\//)) {
						break;
					}
					//go to next element
					el = expr[++readhead];
				}
				console.log(`[${stop}] Multi line comment end`);

			//OPERATOR TOKEN VALIDATOR AND GENERATOR
			} else if (op.match(/^([|]{2}|[&]{2}|!)$/)) {
				tokens.push({ type: 'logic', value: op });
			} else if (op.match(/^([-]{1,2}|[+]{1,2}|[*]{1,2}|[\/%])$/)) {
				tokens.push({ type: 'math', value: op });
			} else if (op.match(/^([<>?]|[<>!=]=|[!=]==)$/)) {
				tokens.push({ type: 'compare', value: op });
			} else if (op.match(/^([-+*\/%*]=|\*{2}=|=)$/)) {
				tokens.push({ type: 'assign', value: op });
			} else {
				console.log(`Invalid operator lexeme: ${op}`);
				break
			}
			
		} else if (el.match(symbols)) {
			//SYMBOL TOKEN VALIDATOR AND GENERATOR
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
	
		//QUOTE HANDLERS HAVE BEEN MERGED
		} else if (el.match(/^["']$/)) {
			
			//string literal variable
			let string = '';

			//Add opening quote then jump  
			string += el;
			el = expr[++readhead];

			//Single quote
			if(string[0] == "'"){
				while (el.match(/[^']/)) {
					//If EOS reached, stop
					if (readhead == expr.length - 1) {
						console.log(`Finished reading the string`);
						break;
					}
					//store any character after that quote and read next character
					string += el;
					el = expr[++readhead];
				}
			}
			//Double quote
			if(string[0] == '"'){
				while (el.match(/[^"]/)) {
					//If EOS reached, stop
					if (readhead == expr.length - 1) {
						console.log(`Finished reading the string`);
						break;
					}
					//store any character after that quote and read next character
					string += el;
					el = expr[++readhead];
				}
			}

			//Add closing quote then jump
			string += el;

			//STRING TOKEN VALIDATOR AND GENERATOR
			if (string[0] == '"' && string[string.length - 1] == '"') {
				tokens.push({ type: 'double quoted', value: string });
			} else if (string[0] == "'" && string[string.length - 1] == "'") {
				tokens.push({ type: 'single quoted', value: string });
			} else {
				console.log(`String ${string} improperly set. `);
				break
			}
	
		} else {
			console.log(`Unknown character at index #${readhead}: ${el}`);
		}
	
	}

	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

module.exports = {Lexer}
