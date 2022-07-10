
const {Lexer} = require('./lab.js') 


function Compiler(input_string){
    var tokens = Lexer(input_string)
    return tokens
}

//Input
console.log(Compiler("!!"))




