import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/r9824c/2021_day_5_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day05/day_05__Hydrothermal_Venture.js
 * 
 * Day 05 - Hydrothermal Venture
 * 
 * 0,9 -> 5,9
 * 8,0 -> 0,8
 * 9,4 -> 3,4
 * 2,2 -> 2,1
 * 7,0 -> 7,4
 * 6,4 -> 2,0
 * 0,9 -> 2,9
 * 3,4 -> 1,4
 * 0,0 -> 8,8
 * 5,5 -> 8,2
 * , R 9 C 0, R 9 C 5
 * , R 0 C 8, R 8 C 0
 * , R 4 C 9, R 4 C 3
 * , R 2 C 2, R 1 C 2
 * , R 0 C 7, R 4 C 7
 * , R 4 C 6, R 0 C 2
 * , R 9 C 0, R 9 C 2
 * , R 4 C 3, R 4 C 1
 * , R 0 C 0, R 8 C 8
 * , R 5 C 5, R 2 C 8
 * 
 *      012345678901        012345678901
 *   0         1         0  1 1    11
 *   1    1    1         1   111   2
 *   2    1    1         2    2 1 111
 *   3         1         3     1 2 2
 *   4   112111211       4   112313211
 *   5                   5     1 2
 *   6                   6    1   1
 *   7                   7   1     1
 *   8                   8  1       1
 *   9  222111           9  222111
 *  10                  10
 *  11                  11
 * 
 * Result Part 1 = 5
 * Result Part 2 = 12
 * 
 * ----------------------------------------------
 * 
 * Result Part 1 = 5294
 * Result Part 2 = 21698
 * 
 */

type Coords = { row : number; col : number };

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
            str_result += pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? " ";
        }
    }

    return str_result;
}


function countXFields( pHashMap : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : number
{
    let nr_result : number = 0;

    for ( let cur_row = pMinRows; cur_row < pMaxRows; cur_row++ )
    {
        for ( let cur_col = pMinCols; cur_col < pMaxCols; cur_col++ )
        {
            if ( ( pHashMap[ "R" + cur_row  + "C" + cur_col ] ?? 0 ) > 1 )
            {
                nr_result++;
            }
        }
    }

    return nr_result;
}


class Line 
{
    vektor_coords : Coords[] = [];

    y1            : number   = 0;
    x1            : number   = 0;
    y2            : number   = 0;
    x2            : number   = 0;

    constructor( pInput : string ) 
    {
        let [ sx1, sy1, sx2, sy2 ] : string[] = pInput.replace( " -> ", "," ).split( "," );

        this.y1 = parseInt( sy1! );
        this.x1 = parseInt( sx1! );
        this.y2 = parseInt( sy2! );
        this.x2 = parseInt( sx2! );

        this.vektor_coords.push( { row : parseInt( sy1! ), col : parseInt( sx1! ) } );
        this.vektor_coords.push( { row : parseInt( sy2! ), col : parseInt( sx2! ) } );
    }

    public getMaxRow() : number 
    {
        return Math.max( this.y1, this.y2 );
    }

    public getMaxCol() : number 
    {
        return Math.max( this.x1, this.x2 );
    }

    private drawLine( pMapInput : PropertieMap, pCoordsStart : Coords, pCoordsEnd : Coords ) : void 
    {
        let row_from  : number = pCoordsStart.row;
        let row_to    : number = pCoordsEnd.row;

        let col_from  : number = pCoordsStart.col;
        let col_to    : number = pCoordsEnd.col;

        let delta_row : number = Math.sign( row_to - row_from );
        let delta_col : number = Math.sign( col_to - col_from );

        let nr_coords : number = 0;

        if ( ( delta_row !== 0 ) && ( delta_col !== 0 ) )
        {
            let end_val_row = row_to + delta_row;
            let end_val_col = col_to + delta_col;

            let cur_row : number = row_from;
            let cur_col : number = col_from;

            while ( ( cur_row != end_val_row) && ( cur_col != end_val_col ) )
            {
                nr_coords = ( pMapInput[ "R" + cur_row + "C" + cur_col ] ?? 0 ) + 1;

                pMapInput[ "R" + cur_row + "C" + cur_col ] = nr_coords;

                cur_row += delta_row;
                cur_col += delta_col;
            }
        }
        else if ( delta_row !== 0 )
        {
            let end_val_row = row_to + delta_row;

            for ( let cur_row : number = row_from; cur_row != end_val_row; cur_row += delta_row )
            {
                nr_coords = ( pMapInput[ "R" + cur_row + "C" + col_from ] ?? 0 ) + 1;

                pMapInput[ "R" + cur_row + "C" + col_from ] = nr_coords;
            }
        }
        else if ( delta_col !== 0 )
        {
            let end_val_col = col_to + delta_col;

            for ( let cur_col : number = col_from; cur_col != end_val_col; cur_col += delta_col )
            {
                nr_coords = ( pMapInput[ "R" + row_from + "C" + cur_col ] ?? 0 ) + 1;

                pMapInput[ "R" + row_from + "C" + cur_col ] = nr_coords;
            }
        }
    }

    public drawLinePart1( pMapInput : PropertieMap ) : void 
    {
        if ( ( this.x1 === this.x2 ) || ( this.y1 === this.y2 ) )
        {
            this.drawLine( pMapInput, this.vektor_coords[ 0 ]!, this.vektor_coords[ 1 ]! );
        }
    }

    public drawLinePart2( pMapInput : PropertieMap ) : void 
    {
        this.drawLine( pMapInput, this.vektor_coords[ 0 ]!, this.vektor_coords[ 1 ]! );
    }

    public toString() : string 
    {
        let str_result : string = "";

        for ( let co_cur of this.vektor_coords )
        {
            str_result +=  ", R " + co_cur.row  + " C " + co_cur.col;
        }

        return str_result;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating Lines from input
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let grid_max_row : number = 10;
    let grid_max_col : number = 10;

    let vektor_line  : Line[] = [];

    for ( const cur_input_str of pArray ) 
    {
        wl( cur_input_str );

        let line_cur = new Line( cur_input_str );

        grid_max_row = Math.max( grid_max_row, line_cur.getMaxRow() );

        grid_max_col = Math.max( grid_max_col, line_cur.getMaxCol() );

        vektor_line.push( line_cur );
    }

    if ( pKnzDebug )
    {
        for ( let line_inst of vektor_line )
        {
            wl( line_inst.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Drawing the lines into the maps for part 1 and part 2
     * *******************************************************************************************************
     */

    let map_part_1 : PropertieMap = {};
    let map_part_2 : PropertieMap = {};

    for ( let line_inst of vektor_line )
    {
        line_inst.drawLinePart1( map_part_1 ); 
        line_inst.drawLinePart2( map_part_2 ); 
    }

    /*
     * *******************************************************************************************************
     * Counting the fields greater than 1
     * *******************************************************************************************************
     */

    result_part_01 = countXFields( map_part_1, 0, 0, grid_max_row, grid_max_col );

    result_part_02 = countXFields( map_part_2, 0, 0, grid_max_row, grid_max_col );

    if ( pKnzDebug )
    {
        let dbg_map_comb = combineStrings( getDebugMap( map_part_1,  0, 0, grid_max_row, grid_max_col ), 
                                           getDebugMap( map_part_2,  0, 0, grid_max_row, grid_max_col )  );

        wl( "" );
        wl( dbg_map_comb  );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day05_input.txt";

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

    array_test.push( "0,9 -> 5,9" );
    array_test.push( "8,0 -> 0,8" );
    array_test.push( "9,4 -> 3,4" );
    array_test.push( "2,2 -> 2,1" );
    array_test.push( "7,0 -> 7,4" );
    array_test.push( "6,4 -> 2,0" );
    array_test.push( "0,9 -> 2,9" );
    array_test.push( "3,4 -> 1,4" );
    array_test.push( "0,0 -> 8,8" );
    array_test.push( "5,5 -> 8,2" );

    return array_test;
}


wl( "" );
wl( "Day 05 - Hydrothermal Venture" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 05 - End " );



