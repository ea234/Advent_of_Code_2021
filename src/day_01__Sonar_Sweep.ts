import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/1
 * 
 * https://www.reddit.com/r/adventofcode/comments/r66vow/2021_day_1_solutions/
 */

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function calcArray( pArray : string[], pSquareWidth : number, pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let sonar_depth_old : number = -1;

    for ( const cur_input_str of pArray ) 
    {
        let sonar_depth_cur : number = parseInt( cur_input_str );

        if ( sonar_depth_old !== -1 )
        {
            if ( sonar_depth_cur > sonar_depth_old )
            {
                result_part_01++;
            }
        }

        sonar_depth_old = sonar_depth_cur;
    }

    /*
     * *******************************************************************************************************
     * Creating three measurement sliding window depth array
     * *******************************************************************************************************
     */
    let three_measurement_array : number[] = [];

    for ( let index = 0; index < ( pArray.length - 2 ); index++ )
    {
        let sonar_depth_cur_1 : number = parseInt( pArray[ index     ] ?? "0" );
        let sonar_depth_cur_2 : number = parseInt( pArray[ index + 1 ] ?? "0" );
        let sonar_depth_cur_3 : number = parseInt( pArray[ index + 2 ] ?? "0" );

        three_measurement_array[ index ]! = sonar_depth_cur_1 + sonar_depth_cur_2 + sonar_depth_cur_3;
    }

    //console.log( three_measurement_array );

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */
    sonar_depth_old = -1;

    for ( const sonar_depth_cur of three_measurement_array ) 
    {
        if ( sonar_depth_old !== -1 )
        {
            if ( sonar_depth_cur > sonar_depth_old )
            {
                result_part_02++;
            }
        }

        sonar_depth_old = sonar_depth_cur;
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day01_input.txt";

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

        calcArray( arrFromFile, 50, true );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "199" );
    array_test.push( "200" );
    array_test.push( "208" );
    array_test.push( "210" );
    array_test.push( "200" );
    array_test.push( "207" );
    array_test.push( "240" );
    array_test.push( "269" );
    array_test.push( "260" );
    array_test.push( "263" );

    return array_test;
}


wl( "" );
wl( "Day 01 - Sonar Sweep" );
wl( "" );

calcArray( getTestArray1(), 4, true );

checkReaddatei();

wl( "" )
wl( "Day 01 - End " );
