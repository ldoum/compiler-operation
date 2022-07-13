
### Clarification

Since 240pm 7/13/2022

Lexeme - either a single character or a group of characters in the source code. *Not* just a group of **more than 1** characters. They are the words of the program.


# Lexical Analysis
1. Scanner - Reads the entire program. Turns 1 or more characters into lexical units or lexemes.
2. Lexer - takes the lexemes and declares what category they should be under. The certain category is a token. The token is *usually* paired with a name and a value.

>Lexers do not know nor care about the grammar of a sentence or the meaning of a text or program; all it knows about are the meaning of the words themselves.
>the compiler doesn’t know or have access to these “individual parts”. Rather, it has to first identify and find them, and then do the work of splitting apart the text into individual pieces.

spaces and punctuation divvy up the “words” of a sentence
it always does two important things: it scans the code, and then it evaluates it.

## Scanner
Reads everything *1 character* at a time. No matter how big the file is.

>The simplest way of diving up a giant chunk of text is by reading it slowly and systematically, one character at a time. And this is exactly what the compiler does.

For each character that the scanner reads, it marks the line and the position of where that character was found in the source text.

Basically, lines are rows, character positions are columns

```
                              Positions
                              
            0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20            
      ______________________________________________________________
          0 X X X X X X N
          1 T T T X X X X X X X X X N
          2 T T T T T X X X X X N
 Lines    3 T T T T X X X X X N
          4 T T T X X X X
          5 T X X X

```
Returns an array of lexemes. Newlines, eofs and spaces are the dividers.

## Evaluator

Determine what type of word it is. Then turn that word into a token. Tokens are lexemes/lexical units but with more information.

# Syntax Analysis
>the parse tree is built by looking at individual parts of the sentence and breaking down expressions into simpler parts.

Tokens ---> Syntax tree

Source:  Medium.com - Vaidehi Joshi
[A not so scary topic about compilers](https://medium.com/basecs/reading-code-right-with-some-help-from-the-lexer-63d0be3d21d)

Phase 0: Language A
Phase 1: Lexical Analysis
Phase 2: Syntax Analysis

