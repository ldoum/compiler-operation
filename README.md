My save point.

I screwed up my lexer when I was trying to upgrade it. For example, I wanted my lexer to accept numbers with decimal points and some critical blocks of my code were buggy. Luckily I made markdown notes so I can learn from my mistakes.

I wanted my lexer to do some stuff like:

* Accept numbers with decimal points
* Ignore single line and multi line comments
* Accept string characters

I managed to have my lexer generate boolean type tokens from the string character sequences true or false.
I also managed to have my lexer generate string type tokens after typing the `"` or `'` characters.

I want my lexer to generate detailed tokens that best explain what category they are in. For example, if the string input is true, the lexer should make a lexeme out of that sequence `t` `r` `u` `e` and make that into a token of type boolean and the lexeme value. 

And for a lexeme with the sequence `8` `6` `.` `7` `4` , the lexer should turn that into a token of type double and carrying a value of `86.74`.

I'm aware that the lexer is very simple since it's meant to make tokens out of a specific set of characters and nothing more. But I wanted to make my parser's job easier by having my lexer distinguish the type of the lexemes better. The more defined the tokens are, the easier it'll be for the parser to organize the parse tree and clarify some things when the tree undergoes semantic analysis. I still have a long way to go.


Also, I got carried away with my lexer being able to handle single line and multi line comments. That functionality is not needed.




