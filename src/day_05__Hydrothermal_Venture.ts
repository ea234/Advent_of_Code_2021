import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/5
 * 
 * https://www.reddit.com/r/adventofcode/comments/r9824c/2021_day_5_solutions/
 * 
 * 
 */

type Coords = { row : number; col : number };

type PropertieMap = Record< string, number >;

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

    knz_is_active : boolean  = false;

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

    public getMaxRow()
    {
        return Math.max( this.y1, this.y2 );
    }

    public getMaxCol()
    {
        return Math.max( this.x1, this.x2 );
    }

    public setKnzIsActivePart1() : void 
    {
        this.knz_is_active = ( this.x1 === this.x2 ) || ( this.y1 === this.y2 );
    }

    public getKnzIsActivePart1() : boolean
    {
        return this.knz_is_active;
    }

    private getKey( pIndex : number ) : string 
    {
        return "R" + this.vektor_coords[ pIndex ]!.row + "C" + this.vektor_coords[ pIndex ]!.col; 
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

        if ( delta_row !== 0 )
        {
            let end_val = row_to + delta_row;

            for ( let cur_row : number = row_from; cur_row != end_val; cur_row += delta_row )
            {
                nr_coords = ( pMapInput[ "R" + cur_row + "C" + col_from ] ?? 0 ) + 1;

                pMapInput[ "R" + cur_row + "C" + col_from ] = nr_coords;
            }
        }

        if ( delta_col !== 0 )
        {
            let end_val = col_to + delta_col;

            for ( let cur_col : number = col_from; cur_col != end_val; cur_col += delta_col )
            {
                nr_coords = ( pMapInput[  "R" + row_from + "C" + cur_col ] ?? 0 ) + 1;

                pMapInput[  "R" + row_from + "C" + cur_col ] = nr_coords;
            }
        }
    }

    public draw( pMapInput : PropertieMap )
    {
        let index_l : number = 1;
        //for ( let index_l : number = 1; index_l < this.vektor_coords.length; index_l++ )
        {
            this.drawLine( pMapInput, this.vektor_coords[ index_l - 1]!, this.vektor_coords[ index_l ]! );
        }
    }

    public toString() 
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

        line_cur.setKnzIsActivePart1();

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
     * Setting up the virtual grid (Drawing the lines)
     * *******************************************************************************************************
     */

    let map_input : PropertieMap = {};

    for ( let line_inst of vektor_line )
    {
        if ( line_inst.getKnzIsActivePart1() )
        { 
            line_inst.draw( map_input ); 
        }
    }

    result_part_01 = countXFields( map_input, 0, 0, grid_max_row, grid_max_col );

    if ( pKnzDebug )
    {
        let dbg_map_comb = getDebugMap( map_input,  0, 0, 12, 12 );

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

checkReaddatei();

wl( "" )
wl( "Day 05 - End " );



