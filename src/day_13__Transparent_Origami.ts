import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/13
 * 
 * https://www.reddit.com/r/adventofcode/comments/rf7onx/2021_day_13_solutions/
 * 
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day13/day_13__Transparent_Origami.js
 * 
 * Day 13 - Transparent Origami
 * 
 * cur_col    6  cur_row   10
 * cur_col    0  cur_row   14
 * cur_col    9  cur_row   10
 * cur_col    0  cur_row    3
 * cur_col   10  cur_row    4
 * cur_col    4  cur_row   11
 * cur_col    6  cur_row    0
 * cur_col    6  cur_row   12
 * cur_col    4  cur_row    1
 * cur_col    0  cur_row   13
 * cur_col   10  cur_row   12
 * cur_col    3  cur_row    4
 * cur_col    3  cur_row    0
 * cur_col    8  cur_row    4
 * cur_col    1  cur_row   10
 * cur_col    2  cur_row   14
 * cur_col    8  cur_row   10
 * cur_col    9  cur_row    0
 * 
 * Instruction Nr  19  Folding Parameter   7   -> fold along y=7
 * 
 *      01234567890        01234567890
 *   0  ...#..#..#.     0  #.##..#..#.
 *   1  ....#......     1  #...#......
 *   2  ...........     2  ......#...#
 *   3  #..........     3  #...#......
 *   4  ...#....#.#     4  .#.#..#.###
 *   5  ...........     5  ...........
 *   6  ...........     6  ...........
 *   7  ...........     7  ...........
 *   8  ...........
 *   9  ...........
 *  10  .#....#.##.
 *  11  ....#......
 *  12  ......#...#
 *  13  #..........
 *  14  #.#........
 * 
 * Instruction Nr  20  Folding Parameter   5   -> fold along x=5
 * 
 *      01234567890        012345
 *   0  #.##..#..#.     0  #####.
 *   1  #...#......     1  #...#.
 *   2  ......#...#     2  #...#.
 *   3  #...#......     3  #...#.
 *   4  .#.#..#.###     4  #####.
 *   5  ...........     5  ......
 *   6  ...........     6  ......
 *   7  ...........     7  ......
 * 
 * Result Part 1 = 17
 * 
 * Result Part 2
 * 
 *      012345
 *   0  #####.
 *   1  #...#.
 *   2  #...#.
 *   3  #...#.
 *   4  #####.
 *   5  ......
 *   6  ......
 *   7  ......
 * 
 * Day 13 - End
 * 
 * 
 *      01234567890123456789012345678901234567890
 *   0  ###..####.#..#.###..#..#.###..#..#.###...
 *   1  #..#.#....#..#.#..#.#..#.#..#.#.#..#..#..
 *   2  #..#.###..#..#.#..#.#..#.#..#.##...#..#..
 *   3  ###..#....#..#.###..#..#.###..#.#..###...
 *   4  #.#..#....#..#.#....#..#.#....#.#..#.#...
 *   5  #..#.####..##..#.....##..#....#..#.#..#..
 *   6  .........................................
 * 
 *   REUPUPKR
 */

type Coords = { row: number; col: number; char : string };

type PropertieMap = Record< string, Coords >;

const CHAR_DOT   : string = "#";
const CHAR_SPACE : string = ".";

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


function combineStrings( pString1 : string | undefined | null, pString2 : string | undefined | null ) : string 
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


function getDebugMap( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            let cur_coords : Coords | undefined = pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? undefined;

            if ( cur_coords === undefined )
            {
                str_result += CHAR_SPACE;
            }
            else
            {
                str_result += cur_coords.char;
            }
        }
    }

    return str_result;
}


function foldUp( pMapInput : PropertieMap, pFoldRow : number ) : void
{
    for ( const key of Object.keys( pMapInput ) as Array<string> ) 
    { 
        const value = pMapInput[ key ]!; 

        if ( ( value.char === CHAR_DOT ) && ( value.row > pFoldRow ) )
        {
            let distance_from_fold_row = value.row - pFoldRow;

            let destination_row = pFoldRow - distance_from_fold_row;

            pMapInput[ "R" + destination_row  + "C" + value.col ] = { row : destination_row, col : value.col, char : CHAR_DOT };

            value.char = "A";
        }
    }
}


function foldLeft( pMapInput : PropertieMap, pFoldCol : number ) : void
{
    for ( const key of Object.keys( pMapInput ) as Array<string> ) 
    { 
        const value = pMapInput[ key ]!; 

        if ( ( value.char === CHAR_DOT ) && ( value.col > pFoldCol ) )
        {
            let distance_from_fold_col = value.col - pFoldCol;

            let destination_col = pFoldCol - distance_from_fold_col;

            pMapInput[ "R" + value.row + "C" + destination_col ] = { row : value.row, col : destination_col, char : CHAR_DOT };

            value.char = "A";
        }
    }
}


function countDots( pMapInput : PropertieMap ) : number 
{
    let result_value : number = 0;

    for ( const key of Object.keys( pMapInput ) as Array<string> ) 
    { 
        if ( pMapInput[ key ]!.char === CHAR_DOT )
        {
            result_value++;
        }
    }

    return result_value;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Reading the DOTs from the Input
     * *******************************************************************************************************
     */

    let result_part_01  : number = 0;

    let grid_rows       : number = 0; 
    let grid_cols       : number = 0;

    let dot_map         : PropertieMap = {};

    let index_start_cmd : number = 0;
    
    while ( ( index_start_cmd < pArray.length ) && ( pArray[ index_start_cmd ] !== "" ) )
    {
        let [ cur_col, cur_row ] : number[] = pArray[ index_start_cmd ]!.split( "," ).map( Number );

        wl( "cur_col " + padL( cur_col!, 4 )  + "  cur_row " + padL( cur_row!, 4 ) );

        if ( cur_row! > grid_rows ) 
        {
            grid_rows = cur_row!;
        }

        if ( cur_col! > grid_cols ) 
        {
            grid_cols = cur_col!;
        }

        dot_map[ "R" + cur_row  + "C" + cur_col ] = { row : cur_row!, col : cur_col!, char : CHAR_DOT };

        index_start_cmd++;
    }

    grid_cols++;
    grid_rows++;

    index_start_cmd++;

    /*
     * *******************************************************************************************************
     * Doing the folding instructions
     * *******************************************************************************************************
     */

    let dbg_map_start_folding : string = "";

    for( let cur_index_cmd : number = index_start_cmd; cur_index_cmd < pArray.length; cur_index_cmd++ )
    {
        if ( pKnzDebug )
        {
            dbg_map_start_folding = getDebugMap( dot_map, 0, 0, grid_rows, grid_cols );
        }

        let folding_instruction : string = pArray[ cur_index_cmd ]!;

        let folding_parameter   : number = parseInt( folding_instruction.substring( 13 ), 10 );

        wl( "" );
        wl( "" );
        wl( "Instruction Nr " + padL( cur_index_cmd, 3 ) + "  Folding Parameter " + padL( folding_parameter, 3 ) + "   -> " + folding_instruction );

        if ( folding_instruction.indexOf( "along x=" ) > 0 )
        {
           foldLeft( dot_map, folding_parameter );

           grid_cols = folding_parameter + 1
        }
        else if ( folding_instruction.indexOf( "along y=" ) > 0 )
        {
            foldUp( dot_map, folding_parameter );

            grid_rows = folding_parameter + 1;
        }

        if ( pKnzDebug )
        {
            let dbg_map_end_folding : string = getDebugMap( dot_map, 0, 0, grid_rows, grid_cols );

            wl( "" );
            wl( combineStrings( dbg_map_start_folding, dbg_map_end_folding ) );
        }

        if ( result_part_01 === 0 )
        {
            result_part_01 = countDots( dot_map );
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );

    let dbg_map_result_part2 : string = getDebugMap( dot_map, 0, 0, grid_rows, grid_cols );

    wl( "" );
    wl( "Result Part 2 " );
    wl( "" );
    wl( dbg_map_result_part2 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day13_input.txt";

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

    array_test.push( "6,10"           );
    array_test.push( "0,14"           );
    array_test.push( "9,10"           );
    array_test.push( "0,3"            );
    array_test.push( "10,4"           );
    array_test.push( "4,11"           );
    array_test.push( "6,0"            );
    array_test.push( "6,12"           );
    array_test.push( "4,1"            );
    array_test.push( "0,13"           );
    array_test.push( "10,12"          );
    array_test.push( "3,4"            );
    array_test.push( "3,0"            );
    array_test.push( "8,4"            );
    array_test.push( "1,10"           );
    array_test.push( "2,14"           );
    array_test.push( "8,10"           );
    array_test.push( "9,0"            );
    array_test.push( ""               );
    array_test.push( "fold along y=7" );
    array_test.push( "fold along x=5" );

    return array_test;
}


wl( "" );
wl( "Day 13 - Transparent Origami" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 13 - End " );
