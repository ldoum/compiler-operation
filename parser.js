function Parser(){

    let ast = {
		  type: 'Base',
		  body: []
	  };

	  ast.body.push(walk(tokens,0));
	
	  return ast;

}

module.exports = {Parser}
