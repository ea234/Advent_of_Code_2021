
import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/3
 * 
 * https://www.reddit.com/r/adventofcode/comments/r7r0ff/2021_day_3_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day03/day_03__Binary_Diagnostic.js
 * 
 * Day 03 - Binary Diagnostic
 * 
 * (15) [0, 5, 7, 8, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 * 
 *  1 bit_mask      1 bit count      5       B
 *  2 bit_mask      2 bit count      7   A
 *  3 bit_mask      4 bit count      8   A
 *  4 bit_mask      8 bit count      5       B
 *  5 bit_mask     16 bit count      7   A
 * 
 * gamma_rate   10110 =         22
 * epsilon_rate 01001 =          9
 * 
 * Result Part 1 = 198
 * Result Part 2 = 0
 * 
 * ----------------------------------------------------------------------------
 * 
 * (15) [0, 490, 494, 504, 504, 504, 508, 488, 521, 505, 493, 530, 522, 0, 0]
 * 
 *  1 bit_mask      1 bit count    490       B
 *  2 bit_mask      2 bit count    494       B
 *  3 bit_mask      4 bit count    504   A
 *  4 bit_mask      8 bit count    504   A
 *  5 bit_mask     16 bit count    504   A
 *  6 bit_mask     32 bit count    508   A
 *  7 bit_mask     64 bit count    488       B
 *  8 bit_mask    128 bit count    521   A
 *  9 bit_mask    256 bit count    505   A
 * 10 bit_mask    512 bit count    493       B
 * 11 bit_mask   1024 bit count    530   A
 * 12 bit_mask   2048 bit count    522   A
 * 
 * gamma_rate   110110111100 =       3516
 * epsilon_rate 001001000011 =        579
 * 
 * Result Part 1 = 2035764
 * Result Part 2 = 0
 */

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


function calcArray( pArray : string[], pBitCount : number,  pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let bit_count : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    for ( const cur_input_str of pArray ) 
    {
        const dec_nr : number = parseInt( cur_input_str, 2 ); 

        let bit_mask : number = 1;

        for ( let bit_nummer : number = 1; bit_nummer <= pBitCount; bit_nummer++ )
        {
            //wl( padL( bit_nummer, 2 ) + " bit_mask " + padL( bit_mask, 6 ) + " " + ( ( dec_nr & bit_mask ) > 0 ? "1" : "0" ) );

            bit_count[ bit_nummer ]!  +=  ( dec_nr & bit_mask ) > 0 ? 1 : 0;

            bit_mask = bit_mask * 2;
        }
    }

    let half_count : number = pArray.length / 2;

    wl( "" );
    console.log( bit_count );
    wl( "" );

    let bit_mask           : number = 1;

    let gamma_rate_value   : number = 0;

    let epsilon_rate_value : number = 0;

    let gamma_rate_string   : string = "";

    let epsilon_rate_string : string = "";

    for ( let bit_nummer : number = 1; bit_nummer <= pBitCount; bit_nummer++ )
    {
        wl( padL( bit_nummer, 2 ) + " bit_mask " + padL( bit_mask, 6 ) + " bit count " + padL( bit_count[ bit_nummer ]!, 6 ) + "   " + ( bit_count[ bit_nummer ]! > half_count ? "A" : " " )  + "   " + ( bit_count[ bit_nummer ]! > half_count ? " " : "B" ) );

        gamma_rate_value   += ( bit_count[ bit_nummer ]! > half_count ? bit_mask : 0 );

        //epsilon_rate_value += ( bit_count[ bit_nummer ]! > half_count ? 0 : bit_mask );

        gamma_rate_string   = ( bit_count[ bit_nummer ]! > half_count ? "1" : "0" ) + gamma_rate_string;

        epsilon_rate_string = ( bit_count[ bit_nummer ]! > half_count ? "0" : "1" ) + epsilon_rate_string;

        bit_mask = bit_mask * 2;
    }

    epsilon_rate_value != gamma_rate_value;

    wl( "" );
    wl( "gamma_rate   " + gamma_rate_string   + " = " + padL( gamma_rate_value,   10 ) );
    wl( "epsilon_rate " + epsilon_rate_string + " = " + padL( epsilon_rate_value, 10 ) );

    result_part_01 = gamma_rate_value * epsilon_rate_value;

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day03_input.txt";

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

        calcArray( arrFromFile, 12, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "00100" );
    array_test.push( "11110" );
    array_test.push( "10110" );
    array_test.push( "10111" );
    array_test.push( "10101" );
    array_test.push( "01111" );
    array_test.push( "00111" );
    array_test.push( "11100" );
    array_test.push( "10000" );
    array_test.push( "11001" );
    array_test.push( "00010" );
    array_test.push( "01010" );

    return array_test;
}


wl( "" );
wl( "Day 03 - Binary Diagnostic" );
wl( "" );

calcArray( getTestArray1(), 5, true );

checkReaddatei();

wl( "" )
wl( "Day 03 - End " );
