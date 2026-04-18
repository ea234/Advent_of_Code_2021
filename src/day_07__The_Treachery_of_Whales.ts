import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/7
 * 
 * https://www.reddit.com/r/adventofcode/comments/rar7ty/2021_day_7_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day07/day_07__The_Treachery_of_Whales.js
 * 
 * Day 07 - The Treachery of Whales
 * 
 * Nr.   0 =  16
 * Nr.   1 =   1
 * Nr.   2 =   2
 * Nr.   3 =   0
 * Nr.   4 =   4
 * Nr.   5 =   2
 * Nr.   6 =   7
 * Nr.   7 =   1
 * Nr.   8 =   2
 * Nr.   9 =  14
 * 
 * MIN 0  MAX 16
 * 
 * Nr.   0  cur_fuel  49   min fuel at pos   0  val   49
 * Nr.   1  cur_fuel  41   min fuel at pos   1  val   41
 * Nr.   2  cur_fuel  37   min fuel at pos   2  val   37
 * Nr.   3  cur_fuel  39   min fuel at pos   2  val   37
 * Nr.   4  cur_fuel  41   min fuel at pos   2  val   37
 * Nr.   5  cur_fuel  45   min fuel at pos   2  val   37
 * Nr.   6  cur_fuel  49   min fuel at pos   2  val   37
 * Nr.   7  cur_fuel  53   min fuel at pos   2  val   37
 * Nr.   8  cur_fuel  59   min fuel at pos   2  val   37
 * Nr.   9  cur_fuel  65   min fuel at pos   2  val   37
 * Nr.  10  cur_fuel  71   min fuel at pos   2  val   37
 * Nr.  11  cur_fuel  77   min fuel at pos   2  val   37
 * Nr.  12  cur_fuel  83   min fuel at pos   2  val   37
 * Nr.  13  cur_fuel  89   min fuel at pos   2  val   37
 * Nr.  14  cur_fuel  95   min fuel at pos   2  val   37
 * Nr.  15  cur_fuel 103   min fuel at pos   2  val   37
 * Nr.  16  cur_fuel 111   min fuel at pos   2  val   37
 * 
 * Nr.   0  cur_fuel 290   min fuel at pos   0  val  290
 * Nr.   1  cur_fuel 242   min fuel at pos   1  val  242
 * Nr.   2  cur_fuel 206   min fuel at pos   2  val  206
 * Nr.   3  cur_fuel 183   min fuel at pos   3  val  183
 * Nr.   4  cur_fuel 170   min fuel at pos   4  val  170
 * Nr.   5  cur_fuel 168   min fuel at pos   5  val  168
 * Nr.   6  cur_fuel 176   min fuel at pos   5  val  168
 * Nr.   7  cur_fuel 194   min fuel at pos   5  val  168
 * Nr.   8  cur_fuel 223   min fuel at pos   5  val  168
 * Nr.   9  cur_fuel 262   min fuel at pos   5  val  168
 * Nr.  10  cur_fuel 311   min fuel at pos   5  val  168
 * Nr.  11  cur_fuel 370   min fuel at pos   5  val  168
 * Nr.  12  cur_fuel 439   min fuel at pos   5  val  168
 * Nr.  13  cur_fuel 518   min fuel at pos   5  val  168
 * Nr.  14  cur_fuel 607   min fuel at pos   5  val  168
 * Nr.  15  cur_fuel 707   min fuel at pos   5  val  168
 * Nr.  16  cur_fuel 817   min fuel at pos   5  val  168
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Result Part 1 = 37
 * Result Part 2 = 168
 * 
 * Day 07 - End
 * 
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Result Part 1 = 336721
 * Result Part 2 = 91638945
 * 
 * 
 */

type PropertieMap = Record< number, number >;

let fuel_map : PropertieMap = {};


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


function getFuel( pDistance : number ) : number 
{
    let fuel_value : number = fuel_map[ pDistance ] ?? -1;

    if ( fuel_value === -1 ) 
    {
        fuel_value = 0;

        for ( let step_nr = 1; step_nr <= pDistance; step_nr++ )
        {
            fuel_value += step_nr;
        }

        fuel_map[ pDistance ] = fuel_value;
    }

    return fuel_value;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    const number_array : number[] = pArray[0]!.trim().split( "," ).map( Number ); 

    let min_pos : number = Number.MAX_SAFE_INTEGER;

    let max_pos : number = 0;

    for ( let idx_num_array : number = 0; idx_num_array < number_array.length; idx_num_array++ )
    {
        wl( "Nr. " + padL( idx_num_array, 3 ) + " = " + padL( number_array[ idx_num_array ] ?? -4 , 3 ) )

        min_pos = Math.min( min_pos, number_array[ idx_num_array ] ?? Number.MAX_SAFE_INTEGER );
        max_pos = Math.max( max_pos, number_array[ idx_num_array ] ?? 0 );
    }

    wl( "MIN " + min_pos + "  MAX " + max_pos );

    /*
     * *******************************************************************************************************
     * Callculating Part 1 
     * *******************************************************************************************************
     */

    let min_fuel_val_01 : number = Number.MAX_SAFE_INTEGER;
    let min_fuel_pos_01 : number = Number.MAX_SAFE_INTEGER;

    for ( let cur_pos : number = min_pos; cur_pos <= max_pos; cur_pos++ )
    {
        let cur_fuel : number = 0;

        for ( let idx_num_array : number = 0; idx_num_array < number_array.length; idx_num_array++ )
        {
            cur_fuel += Math.abs( cur_pos - number_array[ idx_num_array ]! );
        }

        if ( cur_fuel < min_fuel_val_01 )
        {
            min_fuel_val_01 = Math.min( min_fuel_val_01, cur_fuel );
            min_fuel_pos_01 = cur_pos;
        }

        wl( "Nr. " + padL( cur_pos, 3 ) + "  cur_fuel " + padL( cur_fuel, 3 ) + "   min fuel at pos " + padL( min_fuel_pos_01, 3 ) + "  val  " + padL( min_fuel_val_01, 3 ) + " "  )
    }

    /*
     * *******************************************************************************************************
     * Callculating Part 2 
     * *******************************************************************************************************
     */

    wl( "" );

    let min_fuel_val_02 : number = Number.MAX_SAFE_INTEGER;
    let min_fuel_pos_02 : number = Number.MAX_SAFE_INTEGER;

    for ( let cur_pos : number = min_pos; cur_pos <= max_pos; cur_pos++ )
    {
        let cur_distance : number = 0;

        let cur_fuel : number = 0;

        for ( let idx_num_array : number = 0; idx_num_array < number_array.length; idx_num_array++ )
        {
            cur_distance = Math.abs( cur_pos - number_array[ idx_num_array ]! );

            cur_fuel += getFuel( cur_distance );
        }

        if ( cur_fuel < min_fuel_val_02 )
        {
            min_fuel_val_02 = Math.min( min_fuel_val_02, cur_fuel );
            min_fuel_pos_02 = cur_pos;
        }

        wl( "Nr. " + padL( cur_pos, 3 ) + "  cur_fuel " + padL( cur_fuel, 3 ) + "   min fuel at pos " + padL( min_fuel_pos_02, 3 ) + "  val  " + padL( min_fuel_val_02, 3 ) + " "  )
    }

    wl( "" );
    wl( "-------------------------------------------------------------------------------------" );
    wl( "" );

    result_part_01 = min_fuel_val_01;

    result_part_02 = min_fuel_val_02;

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day07_input.txt";

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

    array_test.push( "16,1,2,0,4,2,7,1,2,14" );

    return array_test;
}


wl( "" );
wl( "Day 07 - The Treachery of Whales" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 07 - End " );
