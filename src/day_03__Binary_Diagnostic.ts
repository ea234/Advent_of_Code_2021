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
 *   0   00100     4
 *   1   11110    30
 *   2   10110    22
 *   3   10111    23
 *   4   10101    21
 *   5   01111    15
 *   6   00111     7
 *   7   11100    28
 *   8   10000    16
 *   9   11001    25
 *  10   00010     2
 *  11   01010    10
 * 
 * (15) [0, 5, 7, 8, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0]
 * 
 *  1 bit_mask      1 bit count      5       B
 *  2 bit_mask      2 bit count      7   A
 *  3 bit_mask      4 bit count      8   A
 *  4 bit_mask      8 bit count      5       B
 *  5 bit_mask     16 bit count      7   A
 * 
 * (12) [4, 30, 22, 23, 21, 15, 7, 28, 16, 25, 2, 10]
 * 
 * -------------------------------------------------------------------------
 *  5 bit_mask_outer_loop     16 bit count      7   16
 * OXG   1      30  11110
 * OXG   2      22  10110
 * OXG   3      23  10111
 * OXG   4      21  10101
 * OXG   5      28  11100
 * OXG   6      16  10000
 * OXG   7      25  11001
 * 
 * CO2   1       4    100
 * CO2   2      15   1111
 * CO2   3       7    111
 * CO2   4       2     10
 * CO2   5      10   1010
 * 
 * -------------------------------------------------------------------------
 *  4 bit_mask_outer_loop      8 bit count      3   0
 * OXG   1      22  10110
 * OXG   2      23  10111
 * OXG   3      21  10101
 * OXG   4      16  10000
 * 
 * CO2   1      15   1111
 * CO2   2      10   1010
 * 
 * -------------------------------------------------------------------------
 *  3 bit_mask_outer_loop      4 bit count      3   4
 * OXG   1      22  10110
 * OXG   2      23  10111
 * OXG   3      21  10101
 * 
 * CO2   1      10   1010
 * 
 * -------------------------------------------------------------------------
 *  2 bit_mask_outer_loop      2 bit count      2   2
 * OXG   1      22  10110
 * OXG   2      23  10111
 * 
 * -------------------------------------------------------------------------
 *  1 bit_mask_outer_loop      1 bit count      1   1
 * OXG   1      23  10111
 * 
 * (1) [23]
 * (1) [10]
 * 
 * gamma_rate              10110 =         22
 * epsilon_rate             1001 =          9
 * 
 * oxygen_generator_rating 10111 =         23
 * co2_scrubber_rating      1010 =         10
 * 
 * Result Part 1 = 198
 * Result Part 2 = 230
 * 
 * Day 03 - End
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


function calcArray( pArray : string[], pBitCount : number, pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let input_str_count : number = 0;

    let dec_nr_arr_oxygen : number[] = [];

    let bit_count : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    for ( const cur_input_str of pArray ) 
    {
        const dec_nr : number = parseInt( cur_input_str, 2 ); 

        dec_nr_arr_oxygen.push( dec_nr );

        let bit_mask : number = 1;

        for ( let bit_nummer : number = 1; bit_nummer <= pBitCount; bit_nummer++ )
        {
            //if ( pKnzDebug )
            //{
            //    wl( padL( bit_nummer, 2 ) + " bit_mask " + padL( bit_mask, 6 ) + " " + ( ( dec_nr & bit_mask ) > 0 ? "1" : "0" ) );
            //}

            bit_count[ bit_nummer ]!  +=  ( dec_nr & bit_mask ) > 0 ? 1 : 0;

            bit_mask = bit_mask * 2;
        }

        if ( pKnzDebug )
        {
            wl( padL( input_str_count, 3 ) + "   " + cur_input_str + " " + padL( dec_nr, 5 ) + "" );
        }

        input_str_count++;
    }

    let half_count : number = pArray.length / 2;

    if ( pKnzDebug )
    {
        wl( "" );
        console.log( bit_count );
        wl( "" );
    }

    let bit_mask           : number = 1;

    let gamma_rate_value   : number = 0;

    let epsilon_rate_value : number = 0;

    for ( let bit_nummer : number = 1; bit_nummer <= pBitCount; bit_nummer++ )
    {
        wl( padL( bit_nummer, 2 ) + " bit_mask " + padL( bit_mask, 6 ) + " bit count " + padL( bit_count[ bit_nummer ]!, 6 ) + "   " + ( bit_count[ bit_nummer ]! > half_count ? "A" : " " )  + "   " + ( bit_count[ bit_nummer ]! > half_count ? " " : "B" ) );

        gamma_rate_value   += ( bit_count[ bit_nummer ]! > half_count ? bit_mask : 0 );

        epsilon_rate_value += ( bit_count[ bit_nummer ]! > half_count ? 0 : bit_mask );

        bit_mask <<= 1;
    }

    //epsilon_rate_value != gamma_rate_value;

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */

    let dec_nr_arr_co2 : number[] = [...dec_nr_arr_oxygen];

    if ( pKnzDebug )
    {
        wl( "" )
        console.log( dec_nr_arr_oxygen );
        wl( "" )
    }

    let temp_new_array          : number[] = [];

    let bit_mask_outer_loop     : number   = 2 ** ( pBitCount - 1 );
    
    let cur_bit_count_nr_oxygen : number   = bit_count[ pBitCount ]!;

    let cur_bit_count_nr_co2    : number   = bit_count[ pBitCount ]!;

    for ( let bit_nummer : number = pBitCount; bit_nummer > 0; bit_nummer-- )
    {
        /*
         * If 0 and 1 are equally common, keep values with a 1 in the position being considered.
         */
        let bit_oxygen_should_be = cur_bit_count_nr_oxygen >= ( dec_nr_arr_oxygen.length / 2 ) ? bit_mask_outer_loop : 0;

        let bit_co2_should_be    = cur_bit_count_nr_co2    >= ( dec_nr_arr_co2.length    / 2 ) ? 0 : bit_mask_outer_loop;

        if ( pKnzDebug )
        {
            wl( "\n-------------------------------------------------------------------------" )
        }

        wl( padL( bit_nummer, 2 ) + " bit_mask_outer_loop " + padL( bit_mask_outer_loop, 6 ) + " bit count " + padL( cur_bit_count_nr_oxygen, 6 ) + "   " + bit_oxygen_should_be );

        if ( dec_nr_arr_oxygen.length > 1 )     
        {
            temp_new_array = [];

            cur_bit_count_nr_oxygen = 0;

            let nr_count : number = 0;

            let bit_mask_count : number = bit_mask_outer_loop >> 1;

            for ( const cnr of dec_nr_arr_oxygen )
            {
                if ( ( cnr & bit_mask_outer_loop ) === bit_oxygen_should_be )
                {
                    temp_new_array.push( cnr );

                    nr_count++;

                    if ( pKnzDebug )
                    {
                        wl( "OXG " + padL( nr_count, 3 ) + "  " + padL( cnr, 6 ) + "  " + padL( cnr.toString( 2 ), pBitCount ) )
                    }

                    cur_bit_count_nr_oxygen += ( cnr & bit_mask_count ) > 0 ? 1 : 0;            
                }
            }

            dec_nr_arr_oxygen = [...temp_new_array];
        }

        if ( dec_nr_arr_co2.length > 1 )     
        {
            if ( pKnzDebug )
            {
                wl( "" )
            }

            temp_new_array = [];

            cur_bit_count_nr_co2 = 0;

            let nr_count : number = 0;

            let bit_mask_count : number = bit_mask_outer_loop >> 1;

            for ( const cnr of dec_nr_arr_co2 )
            {
                if ( ( cnr & bit_mask_outer_loop ) === bit_co2_should_be )
                {
                    temp_new_array.push( cnr );

                    nr_count++;

                    if ( pKnzDebug )
                    {
                        wl( "CO2 " + padL( nr_count, 3 ) + "  " + padL( cnr, 6 ) + "  " + padL( cnr.toString( 2 ), pBitCount ) )
                    }

                    cur_bit_count_nr_co2 +=  ( cnr & bit_mask_count ) > 0 ? 1 : 0;           
                }
            }

            dec_nr_arr_co2 = [...temp_new_array ];
        }

        bit_mask_outer_loop >>= 1;
    }

    if ( pKnzDebug )
    {
        wl( "" )
        console.log( dec_nr_arr_oxygen );
        console.log( dec_nr_arr_co2    );
        wl( "" )
    }

    let oxygen_generator_rating : number = dec_nr_arr_oxygen[0]!;
    let co2_scrubber_rating     : number = dec_nr_arr_co2[0]!;

    wl( "" );
    wl( "gamma_rate              " + padL( gamma_rate_value.toString(2),        pBitCount ) + " = " + padL( gamma_rate_value,   10 ) );
    wl( "epsilon_rate            " + padL( epsilon_rate_value.toString(2),      pBitCount ) + " = " + padL( epsilon_rate_value, 10 ) );
    wl( "" );
    wl( "oxygen_generator_rating " + padL( oxygen_generator_rating.toString(2), pBitCount ) + " = " + padL( oxygen_generator_rating, 10 ) );
    wl( "co2_scrubber_rating     " + padL( co2_scrubber_rating.toString(2),     pBitCount ) + " = " + padL( co2_scrubber_rating,     10 ) );

    result_part_01 = gamma_rate_value        * epsilon_rate_value;

    result_part_02 = oxygen_generator_rating * co2_scrubber_rating;

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

//checkReaddatei();

wl( "" )
wl( "Day 03 - End " );
