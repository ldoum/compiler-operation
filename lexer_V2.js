//VERSION 2
const { writeFileSync } = require('fs');

const ALPHABET_SOUP = /[A-Za-z_]/;
const NUMBER_STEW = /[0-9]/;
const OPERATOR_KEYS = /[-\.&|!\+\*\/=<>%?^]/;
const PUNCTUATION = /[,;:\[\]\{\}\(\)]/;
const LITERAL_STRING = /["]/;
const NEWLINE = /\n/;
const SPACEBAR = / /;

function Scanner(characters) {

	var divvy = [];
	console.log(`Total number of input characters: ${characters.length}`);
	console.log(`Whitespaces to ignore: ${characters.match(/[ ]/g).length}`);

	for (let index = 0; index < characters.length; index++) {
		var char = characters[index];
		var lexeme = '';

		if (char.match(ALPHABET_SOUP)) {
			while (char.match(ALPHABET_SOUP)) {
				if (index + 1 == characters.length) {
					break;
				}

				lexeme += char;
				char = characters[++index];
			}

			divvy.push(lexeme);
			char = characters[--index];
		} else if (char.match(NUMBER_STEW)) {
			while (char.match(NUMBER_STEW)) {
				if (index + 1 == characters.length) {
					break;
				}

				lexeme += char;
				char = characters[++index];

				while (char.match(/[-+\.Ee]/)) {
					lexeme += char;
					char = characters[++index];
				}
			}

			divvy.push(lexeme);
			char = characters[--index];
		} else if (char.match(OPERATOR_KEYS)) {
			while (char.match(OPERATOR_KEYS)) {
				if (index + 1 == characters.length) {
					break;
				}

				lexeme += char;
				char = characters[++index];
			}

			divvy.push(lexeme);
			char = characters[--index];
		} else if (char.match(PUNCTUATION)) {
			lexeme = char;
			divvy.push(lexeme);
		} else if (char.match(LITERAL_STRING)) {
			lexeme += char;
			char = characters[++index];

			while (!char.match(LITERAL_STRING)) {
				if (index + 1 == characters.length) {
					break;
				}

				lexeme += char;
				char = characters[++index];
			}

			lexeme += char;
			char = characters[++index];

			divvy.push(lexeme);
			char = characters[--index];
		} else if (char.match(NEWLINE)) {
			divvy.push('\n');
		} else if (char.match(SPACEBAR)) {
			divvy.push(' ');
		} else {
			console.log(`Unknown character present in index #${index}: ${char}`);
			divvy.splice(0, divvy.length);
		}
	}

	return divvy;
}

function Evaluator(lexemes) {
	
	var bucks = [];
	for (let index = 0; index < lexemes.length; index++) {
		var wordup = lexemes[index];

		if (wordup.match(/^".*"$/)) {
			bucks.push({ type: 'string', value: wordup });
			//updating
		} else if (wordup.match(NUMBER_STEW)) {
			const NUMBER_LITERAL = /^(\d+|(\d+\.\d*|\d*\.\d+)|(\d+|\d+\.\d*|\d*\.\d+)[Ee]([-+]\d{1,2}|\d{1,2}))$/;
			if (wordup.match(NUMBER_LITERAL)) {
				bucks.push({ type: 'number', value: wordup });
			} else {
				console.log(`Invalid digit lexeme: ${wordup}`);
				bucks.splice(0, bucks.length);
				break;
			}
		} else if (wordup.match(/^[A-Za-z_]+$/)) {
			switch (wordup) {
				case 'this':
				case 'class':
				case 'return':
				case 'null':
				case 'function':
				case 'pass':
				case 'and':
				case 'or':
				case 'not':
				case 'continue':
				case 'break':
				case 'for':
				case 'while':
				case 'do':
				case 'in':
				case 'of':
				case 'switch':
				case 'case':
				case 'if':
				case 'else':
				case 'default':
				case 'elif':
				case 'true':
				case 'false':
				case 'var':
				case 'string':
				case 'bool':
				case 'double':
				case 'float':
				case 'int':
				case 'let':
				case 'const':
				case 'void':
				case 'new':
				case 'def':
					bucks.push({ type: 'reserved', value: wordup });
					break;
				default:
					bucks.push({ type: 'identifier', value: wordup });
			}
		} else if (wordup.match(PUNCTUATION)) {
			switch (wordup) {
				case '(':
				case ')':
				case '{':
				case '}':
				case ':':
				case '[':
				case ']':
				case ';':
				case ',':
					bucks.push({ type: 'punctuator', value: wordup });
			}
		} else if (wordup.match(/^[-\.&|!\+\*\/=<>%?^]+$/)) {
			switch (wordup) {
				case '||':
				case '&&':
				case '!':
				case '-':
				case '--':
				case '+':
				case '++':
				case '*':
				case '**':
				case '/':
				case '%':
				case '^':
				case '<':
				case '>':
				case '?':
				case '<=':
				case '>=':
				case '!=':
				case '==':
				case '!==':
				case '===':
				case '-=':
				case '+=':
				case '*=':
				case '/=':
				case '%=':
				case '**=':
				case '=':
				case '.':
				case '...':
					bucks.push({ type: 'operator', value: wordup });
					break;
				case '//':
					while (!wordup.match(NEWLINE)) {
						wordup = divvy[++index];
						if (index + 1 == divvy.length) {
							break;
						}
					}
					break;
				case '/*':
				case '*/':
					while (!wordup.match(/\*\//)) {
						wordup = divvy[++index];
						if (index + 1 == divvy.length) {
							break;
						}
					}
					break;
				default:
					console.log(`${wordup} is not a valid operator lexeme`);
					bucks.splice(0, bucks.length);
			}
		}
	}

	//OPTIONAL
	try {
		writeFileSync('./Compilation/SavePoint/money.txt', JSON.stringify(bucks));
		console.log('Tokenizing complete!');
	} catch (err) {
		console.log('Token error!');
		console.error(err);
	}

	//This line stays
	console.log(`Total number of tokens: ${bucks.length}`);

	return bucks;
}

function Lexer(source_blob) {
	var words = Scanner(source_blob);
	var tokens = Evaluator(words);
	return tokens;
}

module.exports = {Lexer}
