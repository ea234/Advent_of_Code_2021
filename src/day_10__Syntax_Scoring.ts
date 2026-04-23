import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/10
 * 
 * https://www.reddit.com/r/adventofcode/comments/rd0s54/2021_day_10_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Syntax_Scoring.js
 * 
 * Day 10 - Syntax Scoring
 * 
 * Part 1 ()                               Score-Value  =      0    -- OK --
 * Part 1 []                               Score-Value  =      0    -- OK --
 * Part 1 {()()()}                         Score-Value  =      0    -- OK --
 * Part 1 (((((((((())))))))))             Score-Value  =      0    -- OK --
 * Part 1 [<>({}){}[([])<>]]               Score-Value  =      0    -- OK --
 * Part 1 <([{}])>                         Score-Value  =      0    -- OK --
 * Part 1 <([]){()}[{}])                   Score-Value  =      3    ## ERROR ##
 * Part 1 (]                               Score-Value  =     57    ## ERROR ##
 * Part 1 (((()))}                         Score-Value  =   1197    ## ERROR ##
 * Part 1 {()()()>                         Score-Value  =  25137    ## ERROR ##
 * 
 * Part 2 ()                             = Completion String             Score-Value =       0
 * Part 2 []                             = Completion String             Score-Value =       0
 * Part 2 {()()()}                       = Completion String             Score-Value =       0
 * Part 2 (((((((((())))))))))           = Completion String             Score-Value =       0
 * Part 2 [<>({}){}[([])<>]]             = Completion String             Score-Value =       0
 * Part 2 <([{}])>                       = Completion String             Score-Value =       0
 * 
 * (6) [0, 0, 0, 0, 0, 0]
 * 
 * Mid Index 3
 * 
 * Result Part 1 = 26394
 * Result Part 2 = 0
 * 
 * 
 * Part 1 [({(<(())[]>[[{[]{<()<>>         Score-Value  =      0    -- OK --
 * Part 1 [(()[<>])]({[<{<<[]>>(           Score-Value  =      0    -- OK --
 * Part 1 {([(<{}[<>[]}>{[]{[(<()>         Score-Value  =   1197    ## ERROR ##
 * Part 1 (((({<>}<{<{<>}{[]{[]{}          Score-Value  =      0    -- OK --
 * Part 1 [[<[([]))<([[{}[[()]]]           Score-Value  =      3    ## ERROR ##
 * Part 1 [{[{({}]{}}([{[{{{}}([]          Score-Value  =     57    ## ERROR ##
 * Part 1 {<[[]]>}<{[{[{[]{()[[[]          Score-Value  =      0    -- OK --
 * Part 1 [<(<(<(<{}))><([]([]()           Score-Value  =      3    ## ERROR ##
 * Part 1 <{([([[(<>()){}]>(<<{{           Score-Value  =  25137    ## ERROR ##
 * Part 1 <{([{{}}[<[[[<>{}]]]>[]]         Score-Value  =      0    -- OK --
 * 
 * Part 2 [({(<(())[]>[[{[]{<()<>>       = Completion String }}]])})]    Score-Value =  288957
 * Part 2 [(()[<>])]({[<{<<[]>>(         = Completion String )}>]})      Score-Value =    5566
 * Part 2 (((({<>}<{<{<>}{[]{[]{}        = Completion String }}>}>))))   Score-Value = 1480781
 * Part 2 {<[[]]>}<{[{[{[]{()[[[]        = Completion String ]]}}]}]}>   Score-Value =  995444
 * Part 2 <{([{{}}[<[[[<>{}]]]>[]]       = Completion String ])}>        Score-Value =     294
 * 
 * (5) [294, 5566, 288957, 995444, 1480781]
 * 
 * Mid Index 2
 * 
 * Result Part 1 = 26397
 * Result Part 2 = 288957
 * 
 * Day 10 - End
 * 
 */

type SyntaxOk = { result_val : number, completion_string : string };

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

    hasItems(): boolean 
    {
        return this.items.length > 0;
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


function checkSyntaxPart1( pInput : string ) : number
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

                     if ( cur_char === ")" ) { result_val =     3; }
                else if ( cur_char === "]" ) { result_val =    57; }
                else if ( cur_char === "}" ) { result_val =  1197; }
                else if ( cur_char === ">" ) { result_val = 25137; }

                return result_val;
            }
        }
    }

    return 0;
}


function checkSyntaxPart2( pInput : string ) : SyntaxOk
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
            stack.pop();
        }
    }

    let result_completion_string : string = "";

    let result_val : number = 0;

    while( stack.hasItems() )
    {
        let cur_char : string = stack.pop()!;

        result_completion_string += cur_char;

        result_val = result_val * 5;

             if ( cur_char === ")" ) { result_val += 1; }
        else if ( cur_char === "]" ) { result_val += 2; }
        else if ( cur_char === "}" ) { result_val += 3; }
        else if ( cur_char === ">" ) { result_val += 4; }
    }

    return { result_val : result_val, completion_string : result_completion_string };
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

    let part2_input : string[] = [];

    for ( const cur_input_str of pArray ) 
    {
        let cur_result : number = checkSyntaxPart1( cur_input_str ); 

        if ( pKnzDebug )
        {
            wl( "Part 1 " + padR( cur_input_str, 30 ) + "   Score-Value  = " + padL( cur_result, 6 ) + "   " + ( cur_result === 0 ? " -- OK -- " : " ## ERROR ## " ));
        }

        if ( cur_result === 0 )
        {
            part2_input.push( cur_input_str );
        }

       result_part_01 += cur_result;
    }
 
    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    let score_array : number[] = [];

    wl( "" );

    for ( const cur_input_str of part2_input ) 
    {
        let cur_result : SyntaxOk = checkSyntaxPart2( cur_input_str ); 

        if ( pKnzDebug )
        {
            wl( "Part 2 " + padR( cur_input_str, 30 ) + " = Completion String " + padR( cur_result.completion_string, 10 ) + "  Score-Value = " + padL( cur_result.result_val, 7 ) );
        }

        score_array.push( cur_result.result_val );
    }

    score_array.sort( ( a, b ) => a - b );

    if ( pKnzDebug )
    {
        wl( "" );

        console.log( score_array );

        wl( "" );
        wl( "Mid Index " + Math.floor( score_array.length / 2 ));
    }

    result_part_02 = score_array[ Math.floor( score_array.length / 2 ) ]!;
 
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

calcArray( getTestArray2(), true );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 10 - End " );
