import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/14
 * 
 * https://www.reddit.com/r/adventofcode/comments/rfzq6f/2021_day_14_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day14/day_14__Extended_Polymerization.js
 * 
 * Day14 - Extended Polymerization
 * 
 * Rule Nr.   2 Pattern CH  Insert B
 * Rule Nr.   3 Pattern HH  Insert N
 * Rule Nr.   4 Pattern CB  Insert H
 * Rule Nr.   5 Pattern NH  Insert C
 * Rule Nr.   6 Pattern HB  Insert C
 * Rule Nr.   7 Pattern HC  Insert B
 * Rule Nr.   8 Pattern HN  Insert C
 * Rule Nr.   9 Pattern NN  Insert C
 * Rule Nr.  10 Pattern BH  Insert H
 * Rule Nr.  11 Pattern NC  Insert B
 * Rule Nr.  12 Pattern NB  Insert B
 * Rule Nr.  13 Pattern BN  Insert B
 * Rule Nr.  14 Pattern BB  Insert N
 * Rule Nr.  15 Pattern BC  Insert B
 * Rule Nr.  16 Pattern CC  Insert N
 * Rule Nr.  17 Pattern CN  Insert C
 * 
 * Iteration   0 String NCNBCHB
 * Iteration   1 String NBCCNBBBCBHCB
 * Iteration   2 String NBBBCNCCNBBNBNBBCHBHHBCHB
 * Iteration   3 String NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB
 * Iteration   4 String NBBNBBNBBBNBBNBBCNCCNBBBCCNBCNCCNBBNBBNBBNBBNBBNBNBBNBBNBBNBBNBBCHBHHBCHBHHNHCNCHBCHBNBBCHBHHBCHB
 * 
 * (4) [161, 298, 865, 1749]
 * 
 * low_count  =     161
 * high_count =    1749
 * 
 * Result Part 1 = 1588
 * 
 * Day 14 - End
 */

type PropertieMap   = Record< string, string >;

type PropertieCount = Record< string, number >;


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


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01  : number = 0;

    let insert_map      : PropertieMap = {};

    /*
     * *******************************************************************************************************
     * Reading the insert rules from input
     * *******************************************************************************************************
     */

    for ( let index_rule : number = 2; index_rule < pArray.length; index_rule++ )
    {
        let [ char_pattern, insert_char ] : string[] = pArray[ index_rule ]!.split( " -> " );

        wl( "Rule Nr. " + padL( index_rule, 3 ) + " Pattern " + char_pattern + "  Insert " + insert_char  );

        insert_map[ char_pattern! ] = insert_char!;
    }

    /*
     * *******************************************************************************************************
     * Doing the iterations
     * *******************************************************************************************************
     */

    let cur_polymer_string : string = pArray[ 0 ]!;

    for ( let iteration_nr = 0; iteration_nr < 10; iteration_nr++ )
    {
        let char_1 : string = cur_polymer_string.charAt( 0 );

        let new_polymer_string : string = char_1;

        for ( let index_str = 1; index_str < cur_polymer_string.length; index_str++ )
        {
            let char_2 : string = cur_polymer_string.charAt( index_str );

            let insert_str : string | undefined = insert_map[ char_1 + char_2 ] ?? undefined;

            if ( insert_str !== undefined )
            { 
                new_polymer_string += insert_str;
            }

            new_polymer_string += char_2;

            char_1 = char_2;
        }

        if ( ( pKnzDebug ) && ( iteration_nr < 5 ) )
        {
            wl( "Iteration " + padL( iteration_nr, 3 ) + " String " + new_polymer_string );
        }

        cur_polymer_string = new_polymer_string;
    }

    /*
     * *******************************************************************************************************
     * Counting the number of occurences in the result string 
     * *******************************************************************************************************
     */

    let count_nr_prop : PropertieCount = {};

    for ( let index_str = 0; index_str < cur_polymer_string.length; index_str++ )
    {
        let char_2 : string = cur_polymer_string.charAt( index_str );

        count_nr_prop[ char_2! ] = ( count_nr_prop[ char_2! ] ?? 0 ) + 1
    }

    /*
     * *******************************************************************************************************
     * Number of occurences to vektor, sort, determine low and high value, Calculating part 1
     * *******************************************************************************************************
     */

    let count_nr_vector: number[] = Object.values( count_nr_prop );

    count_nr_vector.sort( ( a, b ) => a - b );

    console.log( count_nr_vector );

    let low_count  : number = count_nr_vector[ 0 ]!;
    let high_count : number = count_nr_vector[ count_nr_vector.length - 1 ]!;

    wl( "" );
    wl( "low_count  = " + padL( low_count,  7 ) );
    wl( "high_count = " + padL( high_count, 7 ) );
    wl( "" );

    result_part_01 = high_count - low_count;

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day14_input.txt";

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

    array_test.push( "NNCB"    );
    array_test.push( ""        );
    array_test.push( "CH -> B" );
    array_test.push( "HH -> N" );
    array_test.push( "CB -> H" );
    array_test.push( "NH -> C" );
    array_test.push( "HB -> C" );
    array_test.push( "HC -> B" );
    array_test.push( "HN -> C" );
    array_test.push( "NN -> C" );
    array_test.push( "BH -> H" );
    array_test.push( "NC -> B" );
    array_test.push( "NB -> B" );
    array_test.push( "BN -> B" );
    array_test.push( "BB -> N" );
    array_test.push( "BC -> B" );
    array_test.push( "CC -> N" );
    array_test.push( "CN -> C" );

    return array_test;
}


wl( "" );
wl( "Day14 - Extended Polymerization" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 14 - End " );
