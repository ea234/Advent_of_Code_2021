import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/8
 * 
 * https://www.reddit.com/r/adventofcode/comments/rbj87a/2021_day_8_solutions/
 * 
 *   0:      1:      2:      3:      4:
 *  aaaa    ....    aaaa    aaaa    ....
 * b    c  .    c  .    c  .    c  b    c
 * b    c  .    c  .    c  .    c  b    c
 *  ....    ....    dddd    dddd    dddd
 * e    f  .    f  e    .  .    f  .    f
 * e    f  .    f  e    .  .    f  .    f
 *  gggg    ....    gggg    gggg    ....
 *  
 * 
 *   5:      6:      7:      8:      9:
 *  aaaa    aaaa    aaaa    aaaa    aaaa
 * b    .  b    .  .    c  b    c  b    c
 * b    .  b    .  .    c  b    c  b    c
 *  dddd    dddd    ....    dddd    dddd
 * .    f  e    f  .    f  e    f  .    f
 * .    f  e    f  .    f  e    f  .    f
 *  gggg    gggg    ....    gggg    gggg
 * 
 * not valid
 * b c 
 * bc ef
 * bf
 * ce
 * ag
 * ab
 * ac
 * af
 * ag
 * aefg
 * adg
 * 
 * 
 * 0 = a b c   e f g = 6
 * 1 =     c     f   =   2 
 * 2 = a   c d e   g = 5
 * 3 = a   c d   f g = 5
 * 4 =   b c d   f   =   4
 * 5 = a b   d   f g = 5
 * 6 = a b   d e f g = 6
 * 7 = a   c     f   =   3
 * 8 = a b c d e f g =   7
 * 9 = a b c d   f g = 6
 * 
 * 
 * 
 * fdgacbe = 8 S = 8 = a b c d e f g = 
 * 
 * cefdb   = 5 S = 2 = a   c d e   g   
 *                 3 = a   c d   f g
 *                 5 = a b   d   f g
 * 
 * cefbgd  = 6 S = 6 = a b   d e f g
 *                 9 = a b c d   f g
 * 
 * gcbe    = 4 S = 4 =   b c d   f   
 * 
 * 
 * be  = 2 S = 1 = b e 
 * edb = 3 S = 7  = d = uniqe 
 * 
 * 
 * cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd 
 * 
 * 
 * miss_wired_a = 7_1,           8_1
 * miss_wired_b = 4_1,           8_2 
 * miss_wired_c = 1_1, 4_2, 7_2, 8_3
 * miss_wired_d =      4_2,      8_4
 * miss_wired_e =                8_5
 * miss_wired_f = 1_2, 4_4, 7_3, 8_6
 * miss_wired_g =                8_7
 * 
 * 
 * 1 = input_a, input_b => c f 
 * 
 *     miss_wired_1_c = input_a 
 *     miss_wired_1_f = input_b
 * 
 * 4 = b c d f 
 *     miss_wired_4_b = input_1, 
 *     miss_wired_4_c = input_2, 
 *     miss_wired_4_d = input_3, 
 *     miss_wired_4_f = input_4
 * 
 * 7 = a c f 
 *     miss_wired_7_a = input_1
 *     miss_wired_7_c = input_2
 *     miss_wired_7_f = input_3
 */

type PropertieString = Record< string, string>;

const NR_OF_SEGMENTS_1 = 2;
const NR_OF_SEGMENTS_4 = 4;
const NR_OF_SEGMENTS_7 = 3;
const NR_OF_SEGMENTS_8 = 7;

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


function countUnique( pString : string ) : number 
{
    let vek_length : number[] = [ NR_OF_SEGMENTS_1, NR_OF_SEGMENTS_4, NR_OF_SEGMENTS_7, NR_OF_SEGMENTS_8 ];

    let res_count : number = 0;

    if ( pString.trim() !== "" )
    {

        const arr_input : string[] = pString.split( " " );

        for ( const cur_input of arr_input )
        {
            if ( vek_length.includes( cur_input.length ) )
            {
                res_count++;

                wl( "cur_input " + cur_input + " " + res_count );
            }
        }
    }

    return res_count;
}

class SevenSegmentDisplay
{
    vek_miss_wired : PropertieString = {};

    segment_0: string[]= [ "a", "b", "c", "e",      "f", "g" ];
    segment_1: string[]= [           "c",           "f"      ];
    segment_2: string[]= [ "a",      "c", "d", "e",      "g" ];
    segment_3: string[]= [ "a",      "c", "d",      "f", "g" ];
    segment_4: string[]= [      "b", "c", "d",      "f"      ];
    segment_5: string[]= [ "a", "b",      "d",      "f", "g" ];
    segment_6: string[]= [ "a", "b",      "d", "e", "f", "g" ];
    segment_7: string[]= [ "a",      "c",           "f"      ];
    segment_8: string[]= [ "a", "b", "c", "d", "e", "f", "g" ];
    segment_9: string[]= [ "a", "b", "c", "d",      "f", "g" ];

    // miss_wired_a  : string = "a";
    // miss_wired_b  : string = "b";
    // miss_wired_c  : string = "c";
    // miss_wired_d  : string = "d";
    // miss_wired_e  : string = "e";
    // miss_wired_f  : string = "f";
    // miss_wired_g  : string = "g";
 /*
 acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf

 dddd
e    a
e    a
 ffff
g    b
g    b
 cccc

So, the unique signal patterns would correspond to the following digits:

    acedgfb: 8
    cdfbe: 5
    gcdfa: 2
    fbcad: 3
    dab: 7
    cefabd: 9
    cdfgeb: 6
    eafb: 4
    cagedb: 0
    ab: 1

 */
    public setMisswired( pString : string ) : boolean 
    {
        if ( pString.trim() !== "" )
        {
            const arr_input : string[] = pString.split( " " );

            for ( const cur_input of arr_input )
            {
                if ( cur_input.length === NR_OF_SEGMENTS_8 )
                {
                    // this.miss_wired_a = cur_input[ 0 ]!;
                    // this.miss_wired_b = cur_input[ 1 ]!;
                    // this.miss_wired_c = cur_input[ 2 ]!;
                    // this.miss_wired_d = cur_input[ 3 ]!;
                    // this.miss_wired_e = cur_input[ 4 ]!;
                    // this.miss_wired_f = cur_input[ 5 ]!;
                    // this.miss_wired_g = cur_input[ 6 ]!;

                    this.vek_miss_wired[ "a" ] = cur_input[ 0 ]!;
                    this.vek_miss_wired[ "b" ] = cur_input[ 1 ]!;
                    this.vek_miss_wired[ "c" ] = cur_input[ 2 ]!;
                    this.vek_miss_wired[ "d" ] = cur_input[ 3 ]!;
                    this.vek_miss_wired[ "e" ] = cur_input[ 4 ]!;
                    this.vek_miss_wired[ "f" ] = cur_input[ 5 ]!;
                    this.vek_miss_wired[ "g" ] = cur_input[ 6 ]!;

                    return true;
                }
            }
        }

        return false;
    }

    private checkDisplay( pSegments : string[], pInput : string ) : boolean
    {
        /*
         * The number of lit segments must match the length of the input string 
         */
        if ( pSegments.length !== pInput.length )
        {
            return false;
        }

        /*
         * The number of lit segments must match the length of the input string 
         */
        for ( let cur_index = 0; cur_index < pInput.length; cur_index++ )
        {
            if ( this.vek_miss_wired[ pSegments[ cur_index ]! ]! == pInput.charAt( cur_index ) )
            {
                return false;
            }
        }

        return true;
    }

    private checkInput( pInput : string ) : number
    {
        if ( this.checkDisplay( this.segment_0, pInput ) ) return 0;
        if ( this.checkDisplay( this.segment_1, pInput ) ) return 1;
        if ( this.checkDisplay( this.segment_2, pInput ) ) return 2;
        if ( this.checkDisplay( this.segment_3, pInput ) ) return 3;
        if ( this.checkDisplay( this.segment_4, pInput ) ) return 4;
        if ( this.checkDisplay( this.segment_5, pInput ) ) return 5;
        if ( this.checkDisplay( this.segment_6, pInput ) ) return 6;
        if ( this.checkDisplay( this.segment_7, pInput ) ) return 7;
        if ( this.checkDisplay( this.segment_8, pInput ) ) return 8;
        if ( this.checkDisplay( this.segment_9, pInput ) ) return 9;

        return -1;
    }

    public getNumber( pString : string ) : number 
    {
        let res_count : number = 0;

        if ( pString.trim() !== "" )
        {
            const arr_input : string[] = pString.split( " " );

            for ( const cur_input of arr_input )
            {
                let cur_number = this.checkInput( cur_input );

                if ( cur_number >= 0 )
                {
                    res_count += cur_number;
                }
            }
        }

        return res_count;
    }

    public getDebgString() : string 
    {
        let str_result : string = "";

        str_result += "\n a = " + this.vek_miss_wired[ "a" ];
        str_result += "\n b = " + this.vek_miss_wired[ "b" ];
        str_result += "\n c = " + this.vek_miss_wired[ "c" ];
        str_result += "\n d = " + this.vek_miss_wired[ "d" ];
        str_result += "\n e = " + this.vek_miss_wired[ "e" ];
        str_result += "\n f = " + this.vek_miss_wired[ "f" ];
        str_result += "\n g = " + this.vek_miss_wired[ "g" ];

        return str_result;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */

    let result_part_01 : number = 0;
    let result_part_02 : number = 0;
    
    for ( const cur_input_str of pArray ) 
    {
        const [ part1, part2 ] = cur_input_str.trim().split( "|" );

        result_part_01 += countUnique( part2! );
    }


    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */
    for ( const cur_input_str of pArray ) 
    {
        const [ part1, part2 ] = cur_input_str.trim().split( "|" );

        let seven_segment_display : SevenSegmentDisplay = new SevenSegmentDisplay();

        seven_segment_display.setMisswired( part1! );

        wl( "Input " + part2! + " Number " + seven_segment_display.getNumber( part2! ) );

        wl( seven_segment_display.getDebgString() );
    }

    wl( "" );
    wl( "Input Array Length " + pArray.length );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day08_input.txt";

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

    array_test.push( "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf" );
    
    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe" );
    array_test.push( "edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc" );
    array_test.push( "fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg" );
    array_test.push( "fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb" );
    array_test.push( "aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea" );
    array_test.push( "fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb" );
    array_test.push( "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe" );
    array_test.push( "bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef" );
    array_test.push( "egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb" );
    array_test.push( "gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce" );
    
    return array_test;
}



function printLetter( pInput : string ) : string 
{

/*
 *   0:     
 *  aaaa   
 * b    c  
 * b    c  
 *  ....   
 * e    f  
 * e    f  
 *  gggg   
*/
    let varrk : string[] = pInput.split("" );

    let str_space_btwn : string = "    ";
    let str_space_surround : string = " ";

    let str_a : string = varrk.includes( "a" ) ? "a" : " ";
    let str_b : string = varrk.includes( "b" ) ? "b" : " ";
    let str_c : string = varrk.includes( "c" ) ? "c" : " ";
    let str_d : string = varrk.includes( "d" ) ? "d" : " ";
    let str_e : string = varrk.includes( "e" ) ? "e" : " ";
    let str_f : string = varrk.includes( "f" ) ? "f" : " ";
    let str_g : string = varrk.includes( "g" ) ? "g" : " ";

    let str_return : string = "";

    str_return += str_space_surround + " " + str_a.repeat( 4 ) + " " + str_space_surround + "\n"
    str_return += str_space_surround + str_b + str_space_btwn + str_c + str_space_surround + "\n"
    str_return += str_space_surround + str_b + str_space_btwn + str_c + str_space_surround + "\n"
    str_return += str_space_surround + " " + str_d.repeat( 4 ) + " " + str_space_surround + "\n"
    str_return += str_space_surround + str_e + str_space_btwn + str_f + str_space_surround + "\n"
    str_return += str_space_surround + str_e + str_space_btwn + str_f + str_space_surround + "\n"
    str_return += str_space_surround + " " + str_g.repeat( 4 ) + " " + str_space_surround + "\n"

    console.log( varrk );

    return str_return;
}

wl( "" );
wl( "Day 8: Seven Segment Search" );
wl( "" );

//calcArray( getTestArray1(), true );

//checkReaddatei();

wl( printLetter( "abcdefg" ) );
wl( "" )
wl( "Day 8 - End " );
