import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/r8i1lq/2021_day_4_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Giant_Squid.js
 * 
 * Day 04 - Giant Squid
 * 
 * 22,13,17,11,0,
 * 
 *  Bingo Card 0
 *  22  13  17  11   0
 *   8   2  23   4  24
 *  21   9  14  16   7
 *   6  10   3  18   5
 *   1  12  20  15  19
 * 
 *  Bingo Card 1
 *   3  15   0   2  22
 *   9  18  13  17   5
 *  19   8   7  25  23
 *  20  11  10  24   4
 *  14  21  16  12   6
 * 
 *  Bingo Card 2
 *  14  21  17  24   4
 *  10  16  15   9  19
 *  18   8  23  26  20
 *  22  11  13   6   5
 *   2   0  12   3   7
 * 
 * 
 *  Bingo Card 0
 *  -1  -1  -1  -1  -1
 *   8   2  23   4  24
 *  21   9  14  16   7
 *   6  10   3  18   5
 *   1  12  20  15  19
 * 
 *  Bingo Card 1
 *   3  15  -1   2  -1
 *   9  18  -1  -1   5
 *  19   8   7  25  23
 *  20  -1  10  24   4
 *  14  21  16  12   6
 * 
 *  Bingo Card 2
 *  14  21  -1  24   4
 *  10  16  15   9  19
 *  18   8  23  26  20
 *  -1  -1  -1   6   5
 *   2  -1  12   3   7
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 04 - End
 */


const BINGO_ROWS : number = 5;
const BINGO_COLS : number = 5;

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


class BingoCard 
{
    bingo_card_nr       : number = 0;

    bingo_numbers_value : number[];
    bingo_numbers_hit   : number[];

    last_number         : number = 0;

    constructor( pBingoCardNr : number ) 
    {
        this.bingo_card_nr = pBingoCardNr;

        this.bingo_numbers_value = new Array<number>( BINGO_ROWS * BINGO_COLS );
        this.bingo_numbers_hit   = new Array<number>( BINGO_ROWS * BINGO_COLS );
    }

    public reset()
    {
        this.bingo_numbers_hit = [ ...this.bingo_numbers_value ];

        this.last_number       = -1;
    }

    public checkValue( pNumber : number ) : boolean
    {
        if( this.bingo_numbers_hit.includes( pNumber ) )
        {
            for ( let bingo_idx : number = 0; bingo_idx < this.bingo_numbers_hit.length; bingo_idx++ )
            {
                if ( this.bingo_numbers_hit[ bingo_idx ] === pNumber )
                {
                    this.bingo_numbers_hit[ bingo_idx ] = -1;
                }
            }

            return true;
        }

        return false;
    }

    public addBingoRow( pRow : number, pInput : string ) : void 
    {
        const num_array : number[] = pInput.trim().split( /\s+/ ).map( Number ); 

        let bingo_idx = pRow * BINGO_COLS;

        for ( let col_nr : number = 0; col_nr < num_array.length; col_nr++ )
        {
            this.bingo_numbers_value[ bingo_idx + col_nr ] = num_array[ col_nr ]!;
        }
    }

    public getStringValues() : string 
    {
        let str_result : string = "";

        let bingo_idx : number = 0;

        for ( let row_nr : number = 0; row_nr < BINGO_ROWS; row_nr++ )
        {
            for ( let col_nr : number = 0; col_nr < BINGO_COLS; col_nr++ )
            {
                str_result += padL( this.bingo_numbers_value[ bingo_idx ] ?? ".", 3 ) + " ";

                bingo_idx++;
            }

            str_result += "\n"
        }

        return str_result;
    }

    public getStringHit() : string 
    {
        let str_result : string = "";

        let bingo_idx : number = 0;

        for ( let row_nr : number = 0; row_nr < BINGO_ROWS; row_nr++ )
        {
            for ( let col_nr : number = 0; col_nr < BINGO_COLS; col_nr++ )
            {
                str_result += padL( this.bingo_numbers_hit[ bingo_idx ] ?? ".", 3 ) + " ";

                bingo_idx++;
            }

            str_result += "\n"
        }

        return str_result;
    }

    public toString() : string 
    {
        let str_result : string = " Bingo Card " + this.bingo_card_nr + "\n" + this.getStringHit();

        return str_result;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating Bingo Cards
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let numbers_to_call : string = "22,13,17,11,0,"; // +  pArray[0]!;

    let bingo_cards   : BingoCard[] = [];

    let bingo_card_nr : number = -1;
    let bingo_row_nr  : number = 0;

    for ( let idx_input : number = 1; idx_input < pArray.length; idx_input++ ) 
    {
        if ( pArray[ idx_input ] === "" )
        {
            bingo_card_nr++;

            bingo_row_nr = 0;

            bingo_cards.push( new BingoCard( bingo_card_nr ) );
        }
        else
        {
            if ( bingo_card_nr !== -1 )
            {
                bingo_cards[ bingo_card_nr ]?.addBingoRow( bingo_row_nr, pArray[ idx_input ]! );

                bingo_row_nr++;
            }
        }
    }

    for ( let cur_bingo_card of bingo_cards )
    {
        cur_bingo_card.reset();

        wl( cur_bingo_card.toString() );
    }

    /*
     * *******************************************************************************************************
     * Calling the numbers
     * *******************************************************************************************************
     */
    wl( numbers_to_call );

    const number_array : number[] = numbers_to_call.trim().split( "," ).map( Number ); 

    let knz_break_zuf : boolean = false;

    for ( let idx_num_array : number = 0; idx_num_array < numbers_to_call.length; idx_num_array++ )
    {
        for ( let cur_bingo_card of bingo_cards )
        {
            cur_bingo_card.checkValue( number_array[ idx_num_array ]! );
        }
    }

    wl( "" );
    wl( "-------------------------------------------------------------------------------------" );
    wl( "" );

    for ( let cur_bingo_card of bingo_cards )
    {
        wl( cur_bingo_card.toString() );
    }

    /*
     * *******************************************************************************************************
     * 
     * *******************************************************************************************************
     */


    if ( pKnzDebug )
    {
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day04_input.txt";

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

    array_test.push( "7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1" );
    array_test.push( "" );
    array_test.push( "22 13 17 11  0" );
    array_test.push( " 8  2 23  4 24" );
    array_test.push( "21  9 14 16  7" );
    array_test.push( " 6 10  3 18  5" );
    array_test.push( " 1 12 20 15 19" );
    array_test.push( "" );
    array_test.push( " 3 15  0  2 22" );
    array_test.push( " 9 18 13 17  5" );
    array_test.push( "19  8  7 25 23" );
    array_test.push( "20 11 10 24  4" );
    array_test.push( "14 21 16 12  6" );
    array_test.push( "" );
    array_test.push( "14 21 17 24  4" );
    array_test.push( "10 16 15  9 19" );
    array_test.push( "18  8 23 26 20" );
    array_test.push( "22 11 13  6  5" );
    array_test.push( " 2  0 12  3  7" );

    return array_test;
}


wl( "" );
wl( "Day 04 - Giant Squid" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 04 - End " );
