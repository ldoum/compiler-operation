//BOJACK HORSEMAN
//DISSECTION TIME

var input = ` true false`;

function Lexer(expr) {
	var tokens = [];

	var digits = /[0-9]/;
	var identifier_chars = /[A-Za-z_]/;
	var symbol_bits = /[-&|!+*\/=<>%:]/;
	var space = /\s/;
	var spaces = 0

	for (let where = 0; where < expr.length; where++) {
		var el = expr[where];

		//whitespace handler [fixing now]
		if (space.test(el)) {
			spaces++
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

				if (el.match(/[.]/)) {
					number += el;
					if (where < expr.length - 1) {
						el = expr[++where];
					}
				}
			}

			if (number.match(/[\.]{1}/)) {
				tokens.push({ type: 'double', value: number })
			}
			else if (number.match(/^[0-9]$/)){
				tokens.push({ type: 'integer', value: number });
			} else {
				console.log(`Invalid digit sequence: ${number}`)
			}
		}
		//id handler
		else if (el.match(identifier_chars)) {
			var identifier = '';

			while (el.match(identifier_chars)) {
				identifier += el;
				if (where == expr.length - 1) {
					break;
				}
				el = expr[++where];
			}

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
			];

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
		//symbol handler
		else if (el.match(symbol_bits)) {
			var op = '';
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
			];
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
			case `{`:
				tokens.push({ type: 'left_brace', value: el });
				break;
			case `}`:
				tokens.push({ type: 'right_brace', value: el });
				break;
			
		}
	}

	console.log(`White spaces ignored: ${spaces}`);
	return tokens;
}

console.log(Lexer(input))
