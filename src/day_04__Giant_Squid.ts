import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/4
 * 
 * https://www.reddit.com/r/adventofcode/comments/r8i1lq/2021_day_4_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day04/day_04__Giant_Squid.js
 * 
 * Day 04 - Giant Squid
 * 
 *  Bingo Card 0
 *  22  13  17  11   0     22  13  17  11   0
 *   8   2  23   4  24      8   2  23   4  24
 *  21   9  14  16   7     21   9  14  16   7
 *   6  10   3  18   5      6  10   3  18   5
 *   1  12  20  15  19      1  12  20  15  19
 * 
 *  Bingo Card 1
 *   3  15   0   2  22      3  15   0   2  22
 *   9  18  13  17   5      9  18  13  17   5
 *  19   8   7  25  23     19   8   7  25  23
 *  20  11  10  24   4     20  11  10  24   4
 *  14  21  16  12   6     14  21  16  12   6
 * 
 *  Bingo Card 2
 *  14  21  17  24   4     14  21  17  24   4
 *  10  16  15   9  19     10  16  15   9  19
 *  18   8  23  26  20     18   8  23  26  20
 *  22  11  13   6   5     22  11  13   6   5
 *   2   0  12   3   7      2   0  12   3   7
 * 
 * 7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
 * 
 * Nr.   0 =   7
 * Nr.   1 =   4
 * Nr.   2 =   9
 * Nr.   3 =   5
 * Nr.   4 =  11
 * Nr.   5 =  17
 * Nr.   6 =  23
 * Nr.   7 =   2
 * Nr.   8 =   0
 * Nr.   9 =  14
 * Nr.  10 =  21
 * Nr.  11 =  24
 * Nr.  12 =  10
 * Nr.  13 =  16
 * Nr.  14 =  13
 * Nr.  15 =   6
 * Nr.  16 =  15
 * Nr.  17 =  25
 * Nr.  18 =  12
 * Nr.  19 =  22
 * Nr.  20 =  18
 * Nr.  21 =  20
 * Nr.  22 =   8
 * Nr.  23 =  19
 * Nr.  24 =   3
 * Nr.  25 =  26
 * Nr.  26 =   1
 * 
 * -------------------------------------------------------------------------------------
 * 
 *  Bingo Card 0
 *  22  13  17  11   0     22  13  -1  -1  -1
 *   8   2  23   4  24      8  -1  -1  -1  -1
 *  21   9  14  16   7     -1  -1  -1  -1  -1
 *   6  10   3  18   5      6  -1   3  18  -1
 *   1  12  20  15  19      1  12  20  15  19
 * 
 *  Bingo Card 1
 *   3  15   0   2  22      3  15  -1  -1  22
 *   9  18  13  17   5     -1  18  -1  -1  -1
 *  19   8   7  25  23     19   8  -1  25  -1
 *  20  11  10  24   4     20  -1  -1  -1  -1
 *  14  21  16  12   6     -1  -1  -1  12   6
 * 
 *  Bingo Card 2
 *  14  21  17  24   4     -1  -1  -1  -1  -1
 *  10  16  15   9  19     10  16  15  -1  19
 *  18   8  23  26  20     18   8  -1  26  20
 *  22  11  13   6   5     22  -1  13   6  -1
 *   2   0  12   3   7     -1  -1  12   3  -1
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Bingo First Card
 *  Bingo Card 2
 *  14  21  17  24   4     -1  -1  -1  -1  -1
 *  10  16  15   9  19     10  16  15  -1  19
 *  18   8  23  26  20     18   8  -1  26  20
 *  22  11  13   6   5     22  -1  13   6  -1
 *   2   0  12   3   7     -1  -1  12   3  -1
 * 
 * Last Number   24
 * Non Hit Value 188
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Bingo Last Card
 *  Bingo Card 1
 *   3  15   0   2  22      3  15  -1  -1  22
 *   9  18  13  17   5     -1  18  -1  -1  -1
 *  19   8   7  25  23     19   8  -1  25  -1
 *  20  11  10  24   4     20  -1  -1  -1  -1
 *  14  21  16  12   6     -1  -1  -1  12   6
 * 
 * Last Number   13
 * Non Hit Value 148
 * 
 * Result Part 1 = 4512
 * Result Part 2 = 1924
 * 
 * Day 04 - End
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Bingo-Bingocard
 *  Bingo Card 66
 *  84  78   3  44  96     84  78   3  44  96
 *  59  86  70  80  48     59  86  70  80  -1
 *  93  88  52  43  61     93  -1  52  -1  61
 *  95  66  46  62  58     -1  -1  -1  -1  -1
 *   5  25   6  85  99      5  25   6  85  99
 * 
 * last nr 66
 * non hit 1026
 * 
 * -------------------------------------------------------------------------------------
 * 
 * Bingo Last Card
 *  Bingo Card 31
 *  96  59  72   6  38     -1  -1  -1  -1  -1
 *  60  70  76  82  46     -1  70  -1  -1  -1
 *  47  53  51  64  98     -1  53  51  -1  -1
 *  44  25  69  81  33     -1  25  -1  -1  33
 *  73  52  10  74  55     73  -1  -1  -1  -1
 * 
 * last nr 6
 * non hit 305
 * 
 * Result Part 1 = 67716
 * Result Part 2 = 1830
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

    bingo_numbers_hit   : number[] = [];

    last_number         : number = 0;

    knz_has_bingo       : boolean = false;

    constructor( pBingoCardNr : number ) 
    {
        this.bingo_card_nr = pBingoCardNr;

        this.bingo_numbers_value = new Array<number>( BINGO_ROWS * BINGO_COLS );
    }

    public addRow( pRow : number, pInput : string ) : void 
    {
        const num_array : number[] = pInput.trim().split( /\s+/ ).map( Number ); 

        let bingo_idx = pRow * BINGO_COLS;

        for ( let col_nr : number = 0; col_nr < num_array.length; col_nr++ )
        {
            this.bingo_numbers_value[ bingo_idx + col_nr ] = num_array[ col_nr ]!;
        }
    }

    public reset()
    {
        this.bingo_numbers_hit = [ ...this.bingo_numbers_value ];

        this.last_number       = -1;

        this.knz_has_bingo     = false;
    }

    public checkValue( pNumber : number ) : boolean
    {
        /*
         * If the card has already "Bingo", the new number is not checked.
         * Otherwise, it could reduce the number of not hit values.
         */
        if ( this.knz_has_bingo ) return false;

        this.last_number = pNumber;

        /*
         * Check if the new number is part of the hit array.
         */
        if( this.bingo_numbers_hit.includes( this.last_number ) )
        {
            /*
             * Check each number in the hit-array.
             *
             * If the new value is found, replace the value with a -1.
             */
            for ( let bingo_idx : number = 0; bingo_idx < this.bingo_numbers_hit.length; bingo_idx++ )
            {
                if ( this.bingo_numbers_hit[ bingo_idx ] === this.last_number )
                {
                    this.bingo_numbers_hit[ bingo_idx ] = -1;
                }
            }

            /*
             * Check card rows and cols for "Bingo"
             *
             * If the card has Bingo, the the Bingo-Flag to true, and return true.
             */
            if ( this.checkBingo() )
            {
                this.knz_has_bingo = true;

                return true;
            }
        }

        /*
         * If the new value is not found, or the card has no "Bingo" return false.
         */
        return false;
    }

    private checkBingo() : boolean 
    {
        /*
         * Checking for "Bingo" in the rows.
         */
        for ( let row_nr : number = 0; row_nr < BINGO_ROWS; row_nr++ )
        {
            let row_index : number = row_nr * BINGO_COLS;

            let row_has_bingo : boolean = true;

            for ( let col_nr : number = 0; col_nr < BINGO_COLS; col_nr++ )
            {
                if ( this.bingo_numbers_hit[ row_index + col_nr ]! >= 0 ) 
                {
                    row_has_bingo = false;

                    break;
                }
            }

            if ( row_has_bingo )
            {
                return true;
            }
        }

        /*
         * Checking for "Bingo" in the cols.
         */
        for ( let col_nr : number = 0; col_nr < BINGO_COLS; col_nr++ )
        {
            let col_has_bingo : boolean = true;

            for ( let row_nr : number = 0; row_nr < BINGO_ROWS; row_nr++ )
            {
                if ( this.bingo_numbers_hit[ ( row_nr * BINGO_COLS ) + col_nr ]! >= 0 ) 
                {
                    col_has_bingo = false;

                    break;
                }
            }

            if ( col_has_bingo )
            {
                return true;
            }
        }

        return false;
    }

    private getSumNonHitFields() : number
    {
        let sum_non_hit_fields : number = 0;

        for ( let bingo_idx : number = 0; bingo_idx < this.bingo_numbers_hit.length; bingo_idx++ )
        {
            if ( this.bingo_numbers_hit[ bingo_idx ]! >= 0 )
            {
                sum_non_hit_fields += this.bingo_numbers_hit[ bingo_idx ]!;
            }
        }

        return sum_non_hit_fields;
    }

    public calcResult() : number 
    {
        wl( "Last Number   " + this.last_number          );
        wl( "Non Hit Value " + this.getSumNonHitFields() );

        return this.getSumNonHitFields() * this.last_number;
    }

    private getStringValues() : string 
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

    private getStringHit() : string 
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
        let card_hit : string = this.getStringHit();

        let card_val : string = this.getStringValues();

        return " Bingo Card " + this.bingo_card_nr + "\n" + combineStrings( card_val, card_hit );
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

    let numbers_to_call : string = pArray[0]!;

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
                bingo_cards[ bingo_card_nr ]?.addRow( bingo_row_nr, pArray[ idx_input ]! );

                bingo_row_nr++;
            }
        }
    }

    for ( let cur_bingo_card of bingo_cards )
    {
        cur_bingo_card.reset();

        if ( pKnzDebug )
        {
            wl( cur_bingo_card.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Calling the numbers
     * *******************************************************************************************************
     */
    wl( numbers_to_call );

    let bingo_first_card : BingoCard | undefined = undefined;

    let bingo_last_card  : BingoCard | undefined = undefined;

    const number_array : number[] = numbers_to_call.trim().split( "," ).map( Number ); 

    for ( let idx_num_array : number = 0; idx_num_array < number_array.length; idx_num_array++ )
    {
        wl( "Nr. " + padL( idx_num_array, 3 ) + " = " + padL( number_array[ idx_num_array ] ?? -4 , 3 ))

        for ( let cur_bingo_card of bingo_cards )
        {
            if ( cur_bingo_card.checkValue( number_array[ idx_num_array ]! ) )
            {
                if ( bingo_first_card === undefined )
                {
                    bingo_first_card = cur_bingo_card;
                }

                bingo_last_card = cur_bingo_card;
            }
        }
    }

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "-------------------------------------------------------------------------------------" );
        wl( "" );

        for ( let cur_bingo_card of bingo_cards )
        {
            wl( cur_bingo_card.toString() );
        }
    }

    /*
     * *******************************************************************************************************
     * Calculating the result-values for part 1 and 2
     * *******************************************************************************************************
     */
    wl( "" );
    wl( "-------------------------------------------------------------------------------------" );
    wl( "" );

    if ( bingo_first_card !== undefined )
    {
        wl( "Bingo First Card" );
        wl( bingo_first_card.toString() );
        wl( "" );

        result_part_01 = bingo_first_card.calcResult();
    }

    wl( "" );
    wl( "-------------------------------------------------------------------------------------" );
    wl( "" );

    if ( bingo_last_card !== undefined )
    {
        wl( "Bingo Last Card" );
        wl( bingo_last_card.toString() );
        wl( "" );

        result_part_02 = bingo_last_card.calcResult();
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
