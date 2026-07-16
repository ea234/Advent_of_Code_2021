import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 25: Sea Cucumber ---
 * https://adventofcode.com/2021/day25
 * 
 * https://www.reddit.com/r/adventofcode/comments/ro2uav/2021_day_25_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2021/blob/main/src/day_25__sea_cucumber.ts
 * 
 * 
 * Similar to:
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/day_23__Unstable_Diffusion.ts
 * 
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.    1  Sea-Cucumbers moved      4
 * 
 *      01234567          01234567
 *   0  ..>>>>..       0  ..>>>.>.
 *   1  ........       1  ........
 *   2  .>v.....       2  .>......
 *   3  .....v..       3  ..v.....
 *   4  .....>..       4  .....v>.
 *   5  ........       5  ........
 * 
 * 
 * Loop Nr.    2  Sea-Cucumbers moved      6
 * 
 *      01234567          01234567
 *   0  ..>>>.>.       0  ..>>.>.>
 *   1  ........       1  ........
 *   2  .>......       2  ..>.....
 *   3  ..v.....       3  ........
 *   4  .....v>.       4  ..v....>
 *   5  ........       5  .....v..
 * 
 * 
 * --------------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day25/day_25__sea_cucumber.js
 * 
 * Initial Map
 *      0123456789
 *   0  v...>>.vv>
 *   1  .vv>>.vv..
 *   2  >>.>v>...v
 *   3  >>v>>.>.v.
 *   4  v>v.vv.v..
 *   5  >.>>..v...
 *   6  .vv..>.>v.
 *   7  v.v..>>v.v
 *   8  ....v..v.>
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.    1  Sea-Cucumbers moved     24
 * 
 *      0123456789          0123456789
 *   0  v...>>.vv>       0  ....>.>v.>
 *   1  .vv>>.vv..       1  v.v>.>v.v.
 *   2  >>.>v>...v       2  >v>>..>v..
 *   3  >>v>>.>.v.       3  >>v>v>.>.v
 *   4  v>v.vv.v..       4  .>v.v...v.
 *   5  >.>>..v...       5  v>>.>vvv..
 *   6  .vv..>.>v.       6  ..v...>>..
 *   7  v.v..>>v.v       7  vv...>>vv.
 *   8  ....v..v.>       8  >.v.v..v.v
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.    2  Sea-Cucumbers moved     24
 * 
 *      0123456789          0123456789
 *   0  ....>.>v.>       0  >.v.v>>..v
 *   1  v.v>.>v.v.       1  v.v.>>vv..
 *   2  >v>>..>v..       2  >v>.>.>.v.
 *   3  >>v>v>.>.v       3  >>v>v.>v>.
 *   4  .>v.v...v.       4  .>..v....v
 *   5  v>>.>vvv..       5  .>v>>.v.v.
 *   6  ..v...>>..       6  v....v>v>.
 *   7  vv...>>vv.       7  .vv..>>v..
 *   8  >.v.v..v.v       8  v>.....vv.
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.    3  Sea-Cucumbers moved     23
 * 
 *      0123456789          0123456789
 *   0  >.v.v>>..v       0  v>v.v>.>v.
 *   1  v.v.>>vv..       1  v...>>.v.v
 *   2  >v>.>.>.v.       2  >vv>.>v>..
 *   3  >>v>v.>v>.       3  >>v>v.>.v>
 *   4  .>..v....v       4  ..>....v..
 *   5  .>v>>.v.v.       5  .>.>v>v..v
 *   6  v....v>v>.       6  ..v..v>vv>
 *   7  .vv..>>v..       7  v.v..>>v..
 *   8  v>.....vv.       8  .v>....v..
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.    4  Sea-Cucumbers moved     23
 * 
 *      0123456789          0123456789
 *   0  v>v.v>.>v.       0  v>..v.>>..
 *   1  v...>>.v.v       1  v.v.>.>.v.
 *   2  >vv>.>v>..       2  >vv.>>.v>v
 *   3  >>v>v.>.v>       3  >>.>..v>.>
 *   4  ..>....v..       4  ..v>v...v.
 *   5  .>.>v>v..v       5  ..>>.>vv..
 *   6  ..v..v>vv>       6  >.v.vv>v.v
 *   7  v.v..>>v..       7  .....>>vv.
 *   8  .v>....v..       8  vvv>...v..
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   10  Sea-Cucumbers moved     17
 * 
 *      0123456789          0123456789
 *   0  v>...>>vv.       0  ..>..>>vv.
 *   1  ..v.v.>>vv       1  v.....>>.v
 *   2  v...>.>>>.       2  ..v.v>>>v>
 *   3  >.v>v.>>>v       3  v>.>v.>>>.
 *   4  .v.>v.vv..       4  ..v>v.vv.v
 *   5  v..>>>vv..       5  .v.>>>.v..
 *   6  ..v..>>...       6  v.v..>v>..
 *   7  .vv...>v>.       7  ..v...>v.>
 *   8  ..v..v>vv.       8  .vv..v>vv.
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   20  Sea-Cucumbers moved     12
 * 
 *      0123456789          0123456789
 *   0  >.v....>>v       0  v>.....>>.
 *   1  .v>...v..>       1  >vv>.....v
 *   2  v>v>v..v>>       2  .>v>v.vv>>
 *   3  >.>>v.>v.>       3  v>>>v.>v.>
 *   4  .v..vv>v..       4  ....vv>v..
 *   5  ...>>>vvv.       5  .v.>>>vvv.
 *   6  ..v..>>vv.       6  ..v..>>vv.
 *   7  v.v...>>vv       7  v.v...>>.v
 *   8  v.v.....>.       8  ..v.....v>
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   40  Sea-Cucumbers moved      9
 * 
 *      0123456789          0123456789
 *   0  >>v>v..vv.       0  >>v>v..v..
 *   1  ..>>v..v..       1  ..>>v..vv.
 *   2  ..>>>v>.vv       2  ..>>>v.>.v
 *   3  ..>>>>vv>.       3  ..>>>>vvv>
 *   4  v.....>v..       4  v.....>...
 *   5  v.v..>.>.>       5  v.v...>v>>
 *   6  >vv...v.v>       6  >vv.....v>
 *   7  .>v....v>v       7  .>v...v.>v
 *   8  vvv.v....>       8  vvv.v..v.>
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   50  Sea-Cucumbers moved     10
 * 
 *      0123456789          0123456789
 *   0  ..>>v>vv..       0  ..>>v>vv.v
 *   1  v.v.>>vv..       1  ..v.>>vv..
 *   2  ..>>v>>v..       2  v.>>v>>v..
 *   3  .v>>>>>vv.       3  ..>>>>>vv.
 *   4  v.v....>vv       4  vvv....>vv
 *   5  v.v....>>>       5  ..v....>>>
 *   6  >.v.....v>       6  v>.......>
 *   7  .v>.....>.       7  .vv>....v>
 *   8  >.v.vv.v.v       8  .>v.vv.v..
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   57  Sea-Cucumbers moved      1
 * 
 *      0123456789          0123456789
 *   0  ..>>v>vv..       0  ..>>v>vv..
 *   1  ..v.>>vv..       1  ..v.>>vv..
 *   2  ..>>v>>vv.       2  ..>>v>>vv.
 *   3  ..>>>>>vv.       3  ..>>>>>vv.
 *   4  v......>vv       4  v......>vv
 *   5  v>v....>>v       5  v>v....>>v
 *   6  vvv....>.>       6  vvv.....>>
 *   7  >vv......>       7  >vv......>
 *   8  .>v.vv.v..       8  .>v.vv.v..
 * 
 * --------------------------------------------------------------------------------
 * 
 * Loop Nr.   58  Sea-Cucumbers moved      0
 * 
 *      0123456789          0123456789
 *   0  ..>>v>vv..       0  ..>>v>vv..
 *   1  ..v.>>vv..       1  ..v.>>vv..
 *   2  ..>>v>>vv.       2  ..>>v>>vv.
 *   3  ..>>>>>vv.       3  ..>>>>>vv.
 *   4  v......>vv       4  v......>vv
 *   5  v>v....>>v       5  v>v....>>v
 *   6  vvv.....>>       6  vvv.....>>
 *   7  >vv......>       7  >vv......>
 *   8  .>v.vv.v..       8  .>v.vv.v..
 * 
 * Count EAST    = 23
 * Count SOUTH   = 26
 * 
 * Result Part 1 = 58
 * 
 * --------------------------------------------------------------------------------
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day25/day_25__sea_cucumber.js
 * 
 * Day 25: Sea Cucumber
 * 
 * Loop Nr.   10  Sea-Cucumbers moved   4563
 * Loop Nr.   20  Sea-Cucumbers moved   4109
 * Loop Nr.   30  Sea-Cucumbers moved   3861
 * Loop Nr.   40  Sea-Cucumbers moved   3374
 * Loop Nr.   50  Sea-Cucumbers moved   3020
 * Loop Nr.   60  Sea-Cucumbers moved   2912
 * Loop Nr.   70  Sea-Cucumbers moved   2865
 * Loop Nr.   80  Sea-Cucumbers moved   2914
 * Loop Nr.   90  Sea-Cucumbers moved   2939
 * Loop Nr.  100  Sea-Cucumbers moved   2742
 * Loop Nr.  110  Sea-Cucumbers moved   2677
 * Loop Nr.  120  Sea-Cucumbers moved   2822
 * Loop Nr.  130  Sea-Cucumbers moved   2792
 * Loop Nr.  140  Sea-Cucumbers moved   2824
 * Loop Nr.  150  Sea-Cucumbers moved   2754
 * Loop Nr.  160  Sea-Cucumbers moved   2709
 * Loop Nr.  170  Sea-Cucumbers moved   2722
 * Loop Nr.  180  Sea-Cucumbers moved   2669
 * Loop Nr.  190  Sea-Cucumbers moved   2515
 * Loop Nr.  200  Sea-Cucumbers moved   2361
 * Loop Nr.  210  Sea-Cucumbers moved   2182
 * Loop Nr.  220  Sea-Cucumbers moved   1891
 * Loop Nr.  230  Sea-Cucumbers moved   1802
 * Loop Nr.  240  Sea-Cucumbers moved   1790
 * Loop Nr.  250  Sea-Cucumbers moved   1749
 * Loop Nr.  260  Sea-Cucumbers moved   1707
 * Loop Nr.  270  Sea-Cucumbers moved   1654
 * Loop Nr.  280  Sea-Cucumbers moved   1637
 * Loop Nr.  290  Sea-Cucumbers moved   1614
 * Loop Nr.  300  Sea-Cucumbers moved   1574
 * Loop Nr.  310  Sea-Cucumbers moved   1542
 * Loop Nr.  320  Sea-Cucumbers moved   1489
 * Loop Nr.  330  Sea-Cucumbers moved   1444
 * Loop Nr.  340  Sea-Cucumbers moved   1383
 * Loop Nr.  350  Sea-Cucumbers moved   1484
 * Loop Nr.  360  Sea-Cucumbers moved   1669
 * Loop Nr.  370  Sea-Cucumbers moved   1663
 * Loop Nr.  380  Sea-Cucumbers moved   1604
 * Loop Nr.  390  Sea-Cucumbers moved   1673
 * Loop Nr.  400  Sea-Cucumbers moved   1693
 * Loop Nr.  410  Sea-Cucumbers moved   1557
 * Loop Nr.  420  Sea-Cucumbers moved   1289
 * Loop Nr.  430  Sea-Cucumbers moved    917
 * Loop Nr.  440  Sea-Cucumbers moved    601
 * Loop Nr.  450  Sea-Cucumbers moved    409
 * Loop Nr.  460  Sea-Cucumbers moved    283
 * Loop Nr.  470  Sea-Cucumbers moved    212
 * Loop Nr.  480  Sea-Cucumbers moved    126
 * Loop Nr.  490  Sea-Cucumbers moved     48
 * Loop Nr.  500  Sea-Cucumbers moved      6
 * 
 * Count EAST    = 4756
 * Count SOUTH   = 4817
 * Count         = 9573
 * 
 * Result Part 1 = 504
 * 
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER          : string = "     ";

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

        if ( ( pGrid[ "R" + this.proposed_row + "C" + this.proposed_col ] ?? MAP_CHAR_EMPTY ) !== MAP_CHAR_EMPTY )
        {
            this.proposed_row = this.cur_row;
            this.proposed_col = this.cur_col;
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
    let max_loop = pMaxLoop < 1 ? 1 : pMaxLoop;
    
    let round_nr         : number = 1;

    let grid_input       : PropertieMap = {};

    let grid_rows        : number = 0;
    let grid_cols        : number = pArray[0]!.length;

    let east_cucumbers   : SeaCucumber[] = [];
    let south_cucumbers  : SeaCucumber[] = [];

    let count_moved_sea_cucumbers : number = 1;

    /*
     * Creating the elf array from the input and setting the 
     * initial grid positions. 
     */
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col = 0; cur_col < cur_input_str.length; cur_col++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col ] ?? MAP_CHAR_EMPTY;

            if ( cur_char_input === MAP_CHAR_SEA_CUCUMBER_EAST )
            {
                let cur_sea_cucumber : SeaCucumber =  new SeaCucumber( east_cucumbers.length, grid_rows, cur_col, cur_char_input );

                grid_input[ "R" + grid_rows + "C" + cur_col ] = cur_sea_cucumber.getMapChar();

                east_cucumbers.push( cur_sea_cucumber );
            }
            else if ( cur_char_input === MAP_CHAR_SEA_CUCUMBER_SOUTH )
            {
                let cur_sea_cucumber : SeaCucumber =  new SeaCucumber( south_cucumbers.length, grid_rows, cur_col, cur_char_input );

                grid_input[ "R" + grid_rows + "C" + cur_col ] = cur_sea_cucumber.getMapChar();

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
            wl( "" );

            dbg_map_before = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );
        } 

        /*
         * Reset the count variable for moved sea cucumbers
         */
        count_moved_sea_cucumbers = 0;

        /*
         * Splitting the move operation 
         * First you need the prediction of the movement
         * And then you move.
         * 
         * If you combine the "doMove1" and "doMove2" functions, 
         * then the move is excecuted before other sea cucumbers 
         * had the chance to predict a new position. 
         * 
         * It has to be to functions.
         */

        /*
         * Move east facing sea cucumbers
         */

        for ( const cur_sea_cucumber of east_cucumbers ) 
        {
            cur_sea_cucumber.doMove1( grid_input, grid_rows, grid_cols );
        }

        for ( const cur_sea_cucumber of east_cucumbers ) 
        {
            count_moved_sea_cucumbers += cur_sea_cucumber.doMove2( grid_input );
        }

        /*
         * Move south facing sea cucumbers
         */

        for ( const cur_sea_cucumber of south_cucumbers ) 
        {
            cur_sea_cucumber.doMove1( grid_input, grid_rows, grid_cols );
        }

        for ( const cur_sea_cucumber of south_cucumbers ) 
        {
            count_moved_sea_cucumbers += cur_sea_cucumber.doMove2( grid_input );
        }

        /*
         * Debug Stuff
         */

        if ( pKnzDebug )
        {
            let dbg_map_after : string = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

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
    wl( "Count EAST    = " + east_cucumbers.length  );
    wl( "Count SOUTH   = " + south_cucumbers.length );
    wl( "Count         = " + ( south_cucumbers.length + east_cucumbers.length ) );
    wl( "" );
    wl( "Result Part 1 = " + round_nr               );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2021__day25_input.txt";

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

        calcArray( arrFromFile, 10_000, false );
    } )();
}


function getTestArray0() : string[] 
{
    const array_test: string[] = [];
    
    array_test.push( "..>>>>.." );
    array_test.push( "........" );
    array_test.push( ".>v....." );
    array_test.push( ".....v.." );
    array_test.push( ".....>.." );
    array_test.push( "........" );

    return array_test;
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

//calcArray( getTestArray0(),  3, true );
//calcArray( getTestArray2(), 60, true );

checkReaddatei();

wl( "" )
wl( "Day 25 - End" );


