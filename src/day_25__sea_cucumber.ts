import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 25: Sea Cucumber ---
 * https://adventofcode.com/2021/day25
 * 
 * https://www.reddit.com/r/adventofcode/comments/ro2uav/2021_day_25_solutions/
 * 
 * 
 * 
 * 
 * Similar to:
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/day_23__Unstable_Diffusion.ts
 * 
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER    : string = "     ";

const MAP_CHAR_SEA_CUCUMBER_EAST  : string = ">";
const MAP_CHAR_SEA_CUCUMBER_SOUTH : string = "v";
const MAP_CHAR_EMPTY              : string = ".";


function wl( pString : string )
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


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
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
            str_result += pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_EMPTY;
        }
    }

    return str_result;
}


class SeaCucumber 
{
    id           : number;

    cur_row      : number = 0;
    cur_col      : number = 0;

    proposed_row : number = 0;
    proposed_col : number = 0;

    map_char     : string;

    knz_is_east  : boolean;
    
    constructor( pID : number, pRow : number, pCol : number, pChar : string )
    {
        this.id = pID;

        this.knz_is_east = pChar === MAP_CHAR_SEA_CUCUMBER_EAST;

        /*
         * For debugging, set a character for the map
         */
        this.map_char = pChar; //"ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnop"[ this.id ] ?? ( pch) ;

        this.cur_row = pRow;

        this.cur_col = pCol;
    }

    public doMove1( pGrid : PropertieMap, pGridRows : number, pGridCols : number  ) : void 
    {
        /*
         * The initial proposed coordinates, are the current coordinates.
         */
        this.proposed_row = this.cur_row;
        this.proposed_col = this.cur_col;

        if ( this.knz_is_east )
        {
            this.proposed_col++;

            if ( this.proposed_col >= pGridCols )
            {
                this.proposed_col = 0;
            }
        }
        else 
        {
            this.proposed_row++;

            if ( this.proposed_row >= pGridRows )
            {
                this.proposed_row = 0;
            }
        }
    }

    public doMove2( pGrid : PropertieMap ) : number  
    {
        /*
         * If the proposed coordinates are the same as  the current 
         * coordinates, the sea cucumber doesn't move.
         */
        if ( this.getProposedCoords() === this.getCurCoords() )
        {
            return 0;
        }

        if ( ( pGrid[ "R" + this.proposed_row + "C" + this.proposed_col ] ?? MAP_CHAR_EMPTY ) === MAP_CHAR_EMPTY )
        {
            /*
             * Clear the position in the grid
             */
            pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_EMPTY;

            /*
             * Set the new current position 
             */
            this.cur_col = this.proposed_col;

            this.cur_row = this.proposed_row;

            /*
             * Set the character in the grid
             */
            pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = this.map_char;

            return 1;
        }

        return 0;
    }

    public getID()
    {
        return this.id;
    }

    public getMapChar() : string 
    {
        return this.map_char;
    }

    public getCurRow() : number
    {
        return this.cur_row;
    }

    public getCurCol() : number
    {
        return this.cur_col;
    }

    public getProposedRow() : number
    {
        return this.proposed_row;
    }

    public getProposedCol() : number
    {
        return this.proposed_col;
    }

    public getProposedCoords() : number
    {
        return 10_000 + ( this.proposed_row * 1000 ) + this.proposed_col;
    }

    public getCurCoords() : number
    {
        return 10_000 + ( this.cur_row * 1000 ) + this.cur_col;
    }

    public doesMove() : boolean 
    {
        return this.getProposedCoords() !== this.getCurCoords();
    }

    public toString() : string 
    {
        let move_knz : String = this.doesMove() ? "MOVE" : " -- ";

        return "Nr. " + padL( this.id, 4 ) + " " + this.map_char + "   " + this.getCurCoords() + " -> " + this.getProposedCoords() + " " + move_knz;
    }
}


function calcArray( pArray : string[], pMaxLoop : number = 10_000, pKnzDebug : boolean = true ) : void 
{
    let max_loop = pMaxLoop < 2 ? 2 : pMaxLoop;

    let result_part_01   : number = 0;
    
    let round_nr         : number = 1;
    let count_moved_sea_cucumbers : number = 1;

    let grid_input       : PropertieMap = {};

    let grid_rows        : number = 0;
    let grid_cols        : number = pArray[0]!.length;

    let east_cucumbers   : SeaCucumber[] = [];
    let south_cucumbers  : SeaCucumber[] = [];

    /*
     * Creating the elf array from the input and setting the 
     * initial grid positions. 
     */
    for ( const cur_input_str of pArray ) 
    {

        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col1 ] ?? MAP_CHAR_EMPTY;

            if ( cur_char_input === MAP_CHAR_SEA_CUCUMBER_EAST )
            {
                let cur_sea_cucumber : SeaCucumber =  new SeaCucumber( east_cucumbers.length, grid_rows, cur_col1, cur_char_input );

                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = cur_sea_cucumber.getMapChar();

                east_cucumbers.push( cur_sea_cucumber );
            }
            else if ( cur_char_input === MAP_CHAR_SEA_CUCUMBER_SOUTH )
            {
                let cur_sea_cucumber : SeaCucumber =  new SeaCucumber( south_cucumbers.length, grid_rows, cur_col1, cur_char_input );

                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = cur_sea_cucumber.getMapChar();

                south_cucumbers.push( cur_sea_cucumber );
            }
        }

        grid_rows++;
    }

    let dbg_map_before : string = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

    if ( pKnzDebug )
    {
        wl( "Initial Map" );
        wl( dbg_map_before );
    }

    while ( ( round_nr <= max_loop ) && ( count_moved_sea_cucumbers > 0 ) )
    {
        if ( pKnzDebug )
        {
            wl( "" );
            wl( "--------------------------------------------------------------------------------" );
            wl( "Loop Nr. " + round_nr );
            wl( "" );
        } 

        /*
         * Move Part 1
         * Calculate the proposed Coordinates
         */
        for ( const cur_sea_cucumber of east_cucumbers ) 
        {
            cur_sea_cucumber.doMove1( grid_input, grid_rows, grid_cols );
        }

        for ( const cur_sea_cucumber of south_cucumbers ) 
        {
            cur_sea_cucumber.doMove1( grid_input, grid_rows, grid_cols );
        }

        /*
         * Debug-Stuff
         */
        if ( pKnzDebug )
        {
            dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );
        }

        /*
         * Move Part 2
         */

        count_moved_sea_cucumbers = 0;

        for ( const cur_sea_cucumber of east_cucumbers ) 
        {
            count_moved_sea_cucumbers += cur_sea_cucumber.doMove2( grid_input );
        }

        for ( const cur_sea_cucumber of south_cucumbers ) 
        {
            count_moved_sea_cucumbers += cur_sea_cucumber.doMove2( grid_input );
        }

        if ( pKnzDebug )
        {
            let dbg_map_after : string = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

            wl( "" );
            wl( "Loop Nr. " + padL( round_nr, 4 ) + "  Sea-Cucumbers moved " + padL( count_moved_sea_cucumbers, 6 ) );
            wl( "" );
            wl( combineStrings( dbg_map_before, dbg_map_after ) );
        }
        else
        {
            if (( round_nr % 10) === 0 )
            {
                wl( "Loop Nr. " + padL( round_nr, 4 ) + "  Sea-Cucumbers moved " + padL( count_moved_sea_cucumbers, 6 ) );
            }
        }

        if ( count_moved_sea_cucumbers > 0 )
        {
            round_nr++;
        }
    }

    wl( "" );
    wl( "Count EAST  " + east_cucumbers.length );
    wl( "Count SOUTH " + south_cucumbers.length );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + round_nr       );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day23_input.txt";

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

        calcArray( arrFromFile, 20, false );
    } )();
}



function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "...>..." );
    array_test.push( "......." );
    array_test.push( "......>" );
    array_test.push( "v.....>" );
    array_test.push( "......>" );
    array_test.push( "......." );
    array_test.push( "..vvv.." );

    return array_test;
}


function getTestArray0() : string[] 
{
    const array_test: string[] = [];

    
    array_test.push( "...>>>.." );
    array_test.push( "........" );
    array_test.push( "........" );
    array_test.push( ".>v....." );
    array_test.push( ".....v.." );
    array_test.push( ".....>.." );
    array_test.push( "........" );

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "v...>>.vv>" );
    array_test.push( ".vv>>.vv.." );
    array_test.push( ">>.>v>...v" );
    array_test.push( ">>v>>.>.v." );
    array_test.push( "v>v.vv.v.." );
    array_test.push( ">.>>..v..." );
    array_test.push( ".vv..>.>v." );
    array_test.push( "v.v..>>v.v" );
    array_test.push( "....v..v.>" );

    return array_test;
}


wl( "" );
wl( "Day 25: Sea Cucumber" );
wl( "" );

calcArray( getTestArray0(), 10, true );
//calcArray( getTestArray2(), 60, true );

//checkReaddatei();

wl( "" )
wl( "Day 25 - End" );
/*
 * 
 */
