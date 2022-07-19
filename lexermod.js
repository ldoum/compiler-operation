
const { readFileSync, writeFileSync } = require('fs');

//////////////////////SCANNING PROCESS////////////////////////////////
//lexeme array
var divvy = [];
const ALPHABET_SOUP = /[A-Za-z]/
const NUMBER_STEW = /[0-9]/
const OPERATOR_KEYS = /[-&|!\+\*\/=<>%?^]/    
const PUNCTUATION = /['.,;:\[\]\{\}\(\)]/
const LITERAL_STRING = /["]/
const NEWLINE = /[\n]/
const SPACEBAR = /[ ]/

//the filepath may vary
var everything = readFileSync('./streamer.txt', 'utf-8')
console.log(`Total number of input characters: ${everything.length}`);
console.log(`Whitespaces to ignore: ${everything.match(/[ ]/g).length}`);

//scanner
for (let index = 0; index < everything.length; index++) {
	var char = everything[index];
	var lexeme = ''

	if (char.match(ALPHABET_SOUP)) {
		
		while (char.match(ALPHABET_SOUP)) {
			if (index + 1 == everything.length) {
				break;
			}
			
			lexeme += char;
			char = everything[++index];
		}

		divvy.push(lexeme);
		char = everything[--index] 

	} else if (char.match(NUMBER_STEW)) {
		
		while (char.match(NUMBER_STEW)) {
			if (index + 1 == everything.length) {
				break;
			}
			
			lexeme += char;
			char = everything[++index];
		}

		divvy.push(lexeme);
		char = everything[--index] 

	} else if (char.match(OPERATOR_KEYS)) {
		
		while (char.match(OPERATOR_KEYS)) {
			if (index + 1 == everything.length) {
				break;
			}
			
			lexeme += char;
			char = everything[++index];
		}

		divvy.push(lexeme);
		char = everything[--index] 

	} else if (char.match(PUNCTUATION)) {
		
		while (char.match(PUNCTUATION)) {
			if (index + 1 == everything.length) {
				break;
			}
			
			lexeme += char;
			char = everything[++index];
		}

		divvy.push(lexeme);
		char = everything[--index] 

	} else if (char.match(LITERAL_STRING)) {

		lexeme += char;
		char = everything[++index];

		while (!char.match(LITERAL_STRING)) {
			if (index + 1 == everything.length) {
				break;
			}
			
			lexeme += char;
			char = everything[++index];
		}

		lexeme += char;
		char = everything[++index];
	
		divvy.push(lexeme);
		char = everything[--index];
		
	} else if (char.match(NEWLINE)) {
		divvy.push("\n");
	} else if (char.match(SPACEBAR)) {
		//console.log(`Whitespace found. Index ${index}`)	
	} else {
		console.log(`Unknown character present: ${char}`)
	}
}

////////////LEXEME PRINTER//////////////
try {
  //the filepath may vary
  writeFileSync('./wordplay.txt', divvy.join("\n").toString());
  console.log('Lexing complete!')
} catch (err) {
  console.error(err);
}
console.log(`Total number of lexemes: ${divvy.length}`);


//////////////////////TOKENIZING PROCESS////////////////////////////////

//tokens array
var bucks = [];

//evaluator
for (let index = 0; index < divvy.length; index++) {
        var wordup = divvy[index];

	if (wordup.match(/^".*"$/)){
		bucks.push({type: 'string' , value: wordup});
	} else if (wordup.match(/^\d+$/)){
		bucks.push({type: 'number' , value: wordup});
	} else if (wordup.match(/^[A-Za-z_]+$/)) {
		switch (wordup){
			case "this":     
                        case "class":     
                        case "return":     
                        case "null":     
                        case "function":     
                        case "pass":				
		        case "and":     
                        case "or":     
                        case "not":				
			case "continue":				
			case "break":			
			case "for":     
                        case "while":     
                        case "do":     
                        case "in":     
                        case "of":				
			case "switch":     
                        case "case":     
                        case "if":    
                        case "else":     
                        case "default":     
                        case "elif":		
			case "true":     
                        case "false":
			case "var":     
                        case "string":    
                        case "bool":     
                        case "double":     
                        case "float":     
                        case "int":     
                        case "let":     
                        case "const":     
                        case "void":
                        case "new":
			case "def":
				bucks.push({ type: 'reserved', value: wordup });
				break;
			default:
				bucks.push({ type: 'identifier', value: wordup });
		}
	} else if (wordup.match(/^['.,;:\[\]\{\}\(\)]$/)){
		switch (wordup){
			case "(":
			case ")":
			case "{":
			case "}":
			case ":":
			case "[":
			case "]":
			case ";":
			case ",":
			case ".":
			case "'":
				bucks.push({type: 'punctuator' , value: wordup});
		}
	} else if (wordup.match(/^[-&|!\+\*\/=<>%?^]+$/)) { //condition updated
		switch (wordup){
			case "||":
			case "&&":
			case "!":
			case "-":
			case "--":
			case "+":
			case "++":
			case "*":
			case "**":
			case "/":
			case "%":	
			case "<":
			case ">":
			case "^": 
			case "?":
			case "<=":
			case ">=":
			case "!=":
			case "==":
			case "!==":
			case "===":			
			case "-=":
			case "+=":
			case "*=":
			case "/=":
			case "%=":
			case "**=":
			case "=":
				bucks.push({type: 'operator' , value: wordup});
				break;
			case "//":
				while(!wordup.match(/^\n$/)){
					wordup = divvy[++index]
					if (index + 1 == divvy.length) {
						break;
					}
				}
				break;
			case "/*":
			case "*/":	
				while(!wordup.match(/^\*\/$/)){
					wordup = divvy[++index]
					if (index + 1 == divvy.length) {
						break;
					}
				}
				break;
			default:
				console.log(`${wordup} is not a valid operator lexeme`)
		}
	} 
}

////////////TOKEN PRINTER//////////////
var seer = []
for (let index = 0; index < bucks.length; index++) {
    seer.push(`{  type: ${Object.values(bucks[index]).join(", value: ").toString()}  }`)
}

try {
  //the filepath may vary
  writeFileSync('./money.txt', seer.join("\n").toString());
  console.log('Tokenizing complete!')
} catch (err) {
  console.error(err);
}
console.log(`Total number of tokens: ${bucks.length}`);


