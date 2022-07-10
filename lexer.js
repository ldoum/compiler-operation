
var input = ` true false`;

function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	//CHANGE REGEXP FOR IDENTIFIER CHARACTERS
	//5th priority
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

				//LEAVE THIS CONDITION ALONE
				if (el.match(/[\.]/)) {
					
					number += el;
					if (where == expr.length - 1) {
						break;
					}
					el = expr[++where];
				}
			}
			
			//Updated my regexps for integer and double type tokens
			if(number.match(/^[0-9]+$/)){
                		tokens.push({ type: 'integer', value: number });
            		} else if (number.match(/^[0-9]+\.[0-9]+$/)) {
				tokens.push({ type: 'double', value: number });
			} else {
				console.log(`Invalid digit sequence: ${number}`)
			}
			
		}
		
		//FIX THE ID HANDLER
		//2nd priority fix.
		else if (el.match(identifier_chars)) {
			var identifier = '';

			while (el.match(identifier_chars)) {
				identifier += el;
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

			/*put reserved array as a separate module
			//Arrays in separate modules take 6th priority
			let reserved = [
				'for',
				'while',
				'const',
				'class',
				'if',
				'else',
				'elif',
				'def',
				'and',
				'var',
				'or',
				'not',
				'return',
				'break',
				'continue',
				'this',
				'try',
				'catch',
				'finally',
				'throw',
				'null',
				'string',
				'bool',
				'double',
				'float',
				'int',
				'char',
				'public',
				'protected',
				'private',
				'new',
				'switch',
				'case',
				'function',
				'let',
				'enum',
				'do',
				'in',
				'of'
			];*/

			for (let iter = 0; iter < reserved.length; iter++) {
				if (identifier == reserved[iter]) {
					tokens.push({ type: 'reserved_keyword', value: identifier });
				}
			}
			if (identifier.match(/^true$|^false$/)) {
				tokens.push({ type: 'boolean', value: identifier });
			} else {
				tokens.push({ type: 'identifier', value: identifier });
			}
		}
		
		/* FIX THE SYMBOL HANDLER
		//3rd priority fix
		else if (el.match(symbol_bits)) {
			var op = '';
			
			/*put operation array as a separate module
			let operation = [
				':',
				'::',
				'||',
				'&&',
				'!',
				'=',
				'+',
				'-',
				'*',
				'/',
				'%',
				'<',
				'>',
				'?',
				'==',
				'!=',
				'<=',
				'>=',
				'++',
				'--',
				'+=',
				'-=',
				'*=',
				'/=',
				'%=',
				'!==',
				'===',
				'&',
				'**',
				'=>',
				'->'
			];*/
			while (el.match(symbol_bits)) {
				op += el;
				/*
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

			for (let index = 0; index < operation.length; index++) {
				if (op == operation[index]) {
					tokens.push({
						type: 'operator',
						value: op
					});
				}
			}
			*/
		} else {
			console.log(`Invalid character: ${el}`);
		}
		switch (el) {
			case `(`:
				tokens.push({ type: 'left_paren', value: el });
				break;
			case `)`:
				tokens.push({ type: 'right_paren', value: el });
				break;
			case `[`:
				tokens.push({ type: 'left_bracket', value: el });
				break;
			case `]`:
				tokens.push({ type: 'right_bracket', value: el });
				break;
			case ';':
				tokens.push({ type: 'semi_colon', value: el });
				break;
			case `$`:
				tokens.push({ type: 'dollar_sign', value: el });
				break;
			case ',':
				tokens.push({ type: 'comma', value: el });
				break;
			case '.':
				tokens.push({ type: 'dot', value: el });
				break;
			//TEST THE STRING HANDLER AS WELL////////////
			//Testing this algorithm takes 4th priority.
			case `"`:
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

				tokens.push({ type: 'string', value: stringValue });
				break;
			////////////////////////////////////	
			case `{`:
				tokens.push({ type: 'left_brace', value: el });
				break;
			case `}`:
				tokens.push({ type: 'right_brace', value: el });
				break;
			
		}
	}

	//This line is optional
	console.log(`White spaces ignored: ${expr.match(/[ ]/g) ? expr.match(/[ ]/g).length : 0}`);
	//return array of tokens
	return tokens;
}

console.log(Lexer(input))
