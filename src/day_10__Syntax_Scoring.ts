import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/10
 * 
 * https://www.reddit.com/r/adventofcode/comments/rd0s54/2021_day_10_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Syntax_Scoring.js
 * 
 * Day 10 - Syntax Scoring
 * 
 * cur input ()                             result =      0    -- OK --
 * cur input []                             result =      0    -- OK --
 * cur input {()()()}                       result =      0    -- OK --
 * cur input (((((((((())))))))))           result =      0    -- OK --
 * cur input [<>({}){}[([])<>]]             result =      0    -- OK --
 * cur input <([{}])>                       result =      0    -- OK --
 * cur input <([]){()}[{}])                 result =      3    ## ERROR ##
 * cur input (]                             result =     57    ## ERROR ##
 * cur input (((()))}                       result =   1197    ## ERROR ##
 * cur input {()()()>                       result =  25137    ## ERROR ##
 * 
 * Result Part 1 = 26394
 * Result Part 2 = 0
 * 
 * 
 * cur input [({(<(())[]>[[{[]{<()<>>       result =      0    -- OK --
 * cur input [(()[<>])]({[<{<<[]>>(         result =      0    -- OK --
 * cur input {([(<{}[<>[]}>{[]{[(<()>       result =   1197    ## ERROR ##
 * cur input (((({<>}<{<{<>}{[]{[]{}        result =      0    -- OK --
 * cur input [[<[([]))<([[{}[[()]]]         result =      3    ## ERROR ##
 * cur input [{[{({}]{}}([{[{{{}}([]        result =     57    ## ERROR ##
 * cur input {<[[]]>}<{[{[{[]{()[[[]        result =      0    -- OK --
 * cur input [<(<(<(<{}))><([]([]()         result =      3    ## ERROR ##
 * cur input <{([([[(<>()){}]>(<<{{         result =  25137    ## ERROR ##
 * cur input <{([{{}}[<[[[<>{}]]]>[]]       result =      0    -- OK --
 * 
 * Result Part 1 = 26397
 * Result Part 2 = 0
 * 
 * Day 10 - End
 * 
 * 
 */

class SyntaxStack 
{
    private items : string[] = [];

    push( pString : string ): void 
    {
        this.items.push( pString );
    }

    pop(): string | undefined 
    {
        return this.items.pop();
    }

    peek(): string | undefined 
    {
        return this.items[this.items.length - 1];
    }

    size(): number 
    {
        return this.items.length;
    }

    isEmpty(): boolean 
    {
        return this.items.length === 0;
    }

    toArray(): string[] 
    {
        return [...this.items];
    }

    private getItems() : string 
    {
        let str_result : string = "";

        for ( const str_x of this.items )
        {
            str_result += str_x + ", "
        }

        return str_result;
    }

    toString(): string
    {
        return this.getItems();
    }
}


function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
    }

    return str_result;
}


function checkSyntax( pInput : string ) : number
{
    let stack : SyntaxStack = new SyntaxStack();

    for ( const cur_char of pInput )
    {
             if ( cur_char === "(" ) { stack.push( ")" ); }
        else if ( cur_char === "[" ) { stack.push( "]" ); }
        else if ( cur_char === "{" ) { stack.push( "}" ); }
        else if ( cur_char === "<" ) { stack.push( ">" ); }
        else 
        {
           // wl( stack.toString() );

            if ( cur_char !== stack.pop() )
            {
                let result_val : number = 0;

                     if ( cur_char === ")" ) { result_val = 3; }
                else if ( cur_char === "]" ) { result_val = 57; }
                else if ( cur_char === "}" ) { result_val = 1197; }
                else if ( cur_char === ">" ) { result_val = 25137; }

                return result_val;
            }
        }
    }

    return 0;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    for ( const cur_input_str of pArray ) 
    {
        let cur_result : number = checkSyntax( cur_input_str ); 

        if ( pKnzDebug )
        {
            wl( "cur input " + padR( cur_input_str, 30 ) + " result = " + padL( cur_result, 6 ) + "   " + ( cur_result === 0 ? " -- OK -- " : " ## ERROR ## " ));
        }

       result_part_01 += cur_result;
    }
 
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day10_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "[({(<(())[]>[[{[]{<()<>>" );
    array_test.push( "[(()[<>])]({[<{<<[]>>("   );
    array_test.push( "{([(<{}[<>[]}>{[]{[(<()>" );
    array_test.push( "(((({<>}<{<{<>}{[]{[]{}"  );
    array_test.push( "[[<[([]))<([[{}[[()]]]"   );
    array_test.push( "[{[{({}]{}}([{[{{{}}([]"  );
    array_test.push( "{<[[]]>}<{[{[{[]{()[[[]"  );
    array_test.push( "[<(<(<(<{}))><([]([]()"   );
    array_test.push( "<{([([[(<>()){}]>(<<{{"   );
    array_test.push( "<{([{{}}[<[[[<>{}]]]>[]]" );

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "()" );
    array_test.push( "[]"   );
    array_test.push( "{()()()}" );
    array_test.push( "(((((((((())))))))))" );
    array_test.push( "[<>({}){}[([])<>]]"   );
    array_test.push( "<([{}])>" );

    array_test.push( "<([]){()}[{}])" );
    array_test.push( "(]"   );
    array_test.push( "(((()))}" );
    array_test.push( "{()()()>" );

    return array_test;
}


wl( "" );
wl( "Day 10 - Syntax Scoring" );
wl( "" );

//calcArray( getTestArray2(), true );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 10 - End " );
