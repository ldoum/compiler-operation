//Lexical analysis in a nutshell.
// 10ish pm 7/13/2022 Wednesday
//Modified version of lexical analyzer

const { readFileSync } = require('fs');

var everything = readFileSync('./streamer.txt', 'utf-8')

///////////////////ILLUSTRATION ONLY///////////////////////////////////

//character array
var train = [];
//input
for (let index = 0; index < everything.length; index++) {
	train.push(everything[index]);
}

console.log('Total number of input characters: ');
console.log(train.length);
console.log('Whitespaces to ignore: ');
console.log(everything.match(/[ ]/g).length);

//////////////////////SCANNING PROCESS////////////////////////////////
//lexeme array
var divvy = [];
const ALPHABET_SOUP = /[A-Za-z]/
const NUMBER_STEW = /[0-9]/
const OPERATOR_KEYS = /[-&|!\+\*\/=<>%?]/
const PUNCTUATION = /['.,;:\[\]\{\}\(\)]/
const LITERAL_STRING = /["]/
const NEWLINE = /[\n]/
const SPACEBAR = /[ ]/

//scanner
for (let index = 0; index < train.length; index++) {
	var char = train[index];
	var lexeme = ''

	if (char.match(ALPHABET_SOUP)) {
		
		while (char.match(ALPHABET_SOUP)) {
			if (index + 1 == train.length) {
				break;
			}
			
			lexeme += char;
			char = train[++index];
		}

		divvy.push(lexeme);
		char = train[--index] 

	} else if (char.match(NUMBER_STEW)) {
		
		while (char.match(NUMBER_STEW)) {
			if (index + 1 == train.length) {
				break;
			}
			
			lexeme += char;
			char = train[++index];
		}

		divvy.push(lexeme);
		char = train[--index] 

	} else if (char.match(OPERATOR_KEYS)) {
		
		while (char.match(OPERATOR_KEYS)) {
			if (index + 1 == train.length) {
				break;
			}
			
			lexeme += char;
			char = train[++index];
		}

		divvy.push(lexeme);
		char = train[--index] 

	} else if (char.match(PUNCTUATION)) {
		
		while (char.match(PUNCTUATION)) {
			if (index + 1 == train.length) {
				break;
			}
			
			lexeme += char;
			char = train[++index];
		}

		divvy.push(lexeme);
		char = train[--index] 

	} else if (char.match(LITERAL_STRING)) {

		lexeme += char;
		char = train[++index];

		while (!char.match(LITERAL_STRING)) {
			if (index + 1 == train.length) {
				break;
			}
			
			lexeme += char;
			char = train[++index];
		}

		lexeme += char;
		char = train[++index];
	
		divvy.push(lexeme);
		char = train[--index];
		
	} else if (char.match(NEWLINE)) {
		divvy.push("\n");
	} else if (char.match(SPACEBAR)) {
		console.log(`Whitespace found. Index ${index}`)	
	} else {
		console.log(`Unknown character present: ${char}`)
	}
}

console.log('Lexeme array: ');
console.log(divvy);


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
	} else if (wordup.match(/^[-&|!\+\*\/=<>%?]+$/)) {
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
			default:
				console.log(`${wordup} is not a valid operator lexeme`)
		}
	} else {
		while(!wordup.match(/^(\n|\*\/)$/)){
			wordup = divvy[++index]
			if (index + 1 == divvy.length) {
				break;
			}
		}
		divvy[--index]
    }
}

console.log('Tokens array: ');
console.log(bucks);
