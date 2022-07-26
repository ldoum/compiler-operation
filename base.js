const { readFileSync } = require('fs');
const { Lexer } = require('./lexer2');


function Compiler(input_string) {
	var tokens = Lexer(input_string);
	//the rest go here

	return tokens;
}

var everything = readFileSync('./Compilation/SavePoint/streamer.txt', 'utf-8');
console.log(Compiler(everything));


