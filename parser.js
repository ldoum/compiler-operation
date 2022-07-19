//currently going global
var current = 0

function walk() {
	let token = tokens[current];

	switch (token.type) {
		case 'number':
			current++;
			console.log(`Child node carrying number ${token.value} made.`)
			return {
				type: 'NumberLiteral',
				value: token.value
			};
		case 'string':
			current++;
			console.log(`Child node carrying string ${token.value} made.`)
			return {
				type: 'StringLiteral',
				value: token.value
			};
		case 'left_paren':
			// We'll increment `current` to skip the parenthesis since we don't care
			// about it in our AST.
			token = tokens[++current];

			let node = {
				type: 'CallExpression',
				name: token.value,
				params: []
			};
			console.log(`Parent node named ${token.value} made.`)

			// We increment `current` *again* to skip the name token.
			token = tokens[++current];

			while (token.type != 'right_paren') {
				node.params.push(walk());
				token = tokens[current];
			}
			current++;
			return node;
		default:
			//if unknown token value / type, skip token. Fix later 
			token = tokens[++current];
			break;
	}
}

function Parser(){

    let ast = {
	type: 'Base',
	body: []
    };

    console.log(`Root node representing ${ast.type} is built.`)

    while (current < tokens.length) {
	ast.body.push(walk());
    }
	
    return ast;

}

module.exports = {Parser}
