import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/9
 * 
 * https://www.reddit.com/r/adventofcode/comments/rca6vp/2021_day_9_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day09/day_09__Smoke_Basin.js
 * 
 * Day 09 - Smoke Basin
 * 
 * -------------------------------------------------------------------------------------
 * 
 *      0123456789        0123456789
 *   0  2199943210     0  .1.......0
 *   1  3987894921     1  ..........
 *   2  9856789892     2  ..5.......
 *   3  8767896789     3  ..........
 *   4  9899965678     4  ......5...
 * 
 * 
 * (4) [2, 1, 6, 6]
 * 
 * Result Part 1 = 15
 * Result Part 2 = 0
 * 
 * Day 09 - End
 * 
 * Result Part 1 = 631
 * Result Part 2 = 0
 * 
 */

type PropertieMap = Record< string, number >;

const STR_COMBINE_SPACER : string = "   "; 


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


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null ) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number ): string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
    {
        str_result += cur_col % 10;
    }

    str_result += "\n";

    for ( let cur_row = 0; cur_row < pMaxRows; cur_row++ )
    {
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = 0; cur_col < pMaxCols; cur_col++ )
        {
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? ".";
        }

        str_result += "\n";
    }

    return str_result;
}


const VALUE_NOT_PRESENT = -1;

function isLowSpot( pHashMap : PropertieMap, pMaxRows : number, pMaxCols : number, pRow : number, pCol : number, pKnzDebug : boolean ) : boolean
{
    let number_check         : number = pHashMap[ "R" + pRow + "C" + pCol ]!;

    let value_right  : number = pHashMap[ "R" + pRow + "C" + ( pCol + 1 ) ] ?? VALUE_NOT_PRESENT;
    let value_left   : number = pHashMap[ "R" + pRow + "C" + ( pCol - 1 ) ] ?? VALUE_NOT_PRESENT;
    let value_above  : number = pHashMap[ "R" + ( pRow - 1 ) + "C" + pCol ] ?? VALUE_NOT_PRESENT;
    let value_below  : number = pHashMap[ "R" + ( pRow + 1 ) + "C" + pCol ] ?? VALUE_NOT_PRESENT;

    let knz_x_right : boolean = ( value_right > number_check );
    let knz_x_left  : boolean = ( value_left  > number_check );
    let knz_x_above : boolean = ( value_above > number_check );
    let knz_x_below : boolean = ( value_below > number_check );

    /*
     * Edges
     */

    if ( ( pRow === 0        ) && ( pCol === 0        ) ) { return knz_x_below && knz_x_right; }

    if ( ( pRow === 0        ) && ( pCol === pMaxCols ) ) { return knz_x_below && knz_x_left;  }

    if ( ( pRow === pMaxRows ) && ( pCol === 0        ) ) { return knz_x_above && knz_x_right; }

    if ( ( pRow === pMaxRows ) && ( pCol === pMaxCols ) ) { return knz_x_above && knz_x_left;  }

    /*
     * Top and Bottom Row
     */

    if ( pRow === 0        ) { return knz_x_below && knz_x_left && knz_x_right; }

    if ( pRow === pMaxRows ) { return knz_x_above && knz_x_left && knz_x_right; }

    /*
     * Left and right Col
     */
    
    if ( pCol === 0        ) { return knz_x_below && knz_x_above && knz_x_right; }

    if ( pCol === pMaxCols ) { return knz_x_below && knz_x_above && knz_x_left;  }

    /*
     * All values in the "infield"
     */

    return knz_x_below && knz_x_above && knz_x_left && knz_x_right;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating Map
     * *******************************************************************************************************
     */

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_rows      : number = 0; 
    let grid_cols      : number = 0;

    let map_input      : PropertieMap = {};
    
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            grid_cols = cur_col1;

            let cur_char_input : string = cur_input_str[ grid_cols ] ?? ".";

            map_input[ "R" + grid_rows + "C" + grid_cols ] = parseInt( cur_char_input );
        }

        grid_rows++;
    }

    grid_cols++;


    let grid_rows_idx : number = grid_rows - 1; 
    let grid_cols_idx : number = grid_cols - 1;


    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */


    let low_spot_numbers : number[] = [];

    let low_spot_map  : PropertieMap = {};

    for ( let cur_row = 0; cur_row < grid_rows; cur_row++ )
    {
        for ( let cur_col = 0; cur_col < grid_cols; cur_col++ )
        {
            let cur_number : number = map_input[ "R" + cur_row + "C" + cur_col ]!;

            if ( cur_number === 9 ) continue;

            let knz_is_low_spot : boolean = isLowSpot( map_input, grid_rows_idx, grid_cols_idx, cur_row, cur_col, pKnzDebug );

            if ( knz_is_low_spot )
            {
                result_part_01 += cur_number + 1;

                low_spot_numbers.push( cur_number + 1 );

                low_spot_map[ "R" + cur_row + "C" + cur_col ] = cur_number;
            }
        }
    }


    if ( pKnzDebug )
    {
        wl( "" );
        wl( "-------------------------------------------------------------------------------------" );
        wl( "" );
        wl( combineStrings( getDebugMap( map_input, grid_rows, grid_cols ), getDebugMap( low_spot_map, grid_rows, grid_cols ) ) );
        wl( "" );

        console.log( low_spot_numbers );
    }

    /*
     * *******************************************************************************************************
     * Calculating the result-values for part 1 and 2
     * *******************************************************************************************************
     */

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day09_input.txt";

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

    array_test.push( "2199943210" );
    array_test.push( "3987894921" );
    array_test.push( "9856789892" );
    array_test.push( "8767896789" );
    array_test.push( "9899965678" );

    return array_test;
}


wl( "" );
wl( "Day 09 - Smoke Basin" );
wl( "" );

calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 09 - End " );
