import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/6
 * 
 * https://www.reddit.com/r/adventofcode/comments/r9z49j/2021_day_6_solutions/
 * 
 */

const FISH_TIMER_NEW : number = 8;
const FISH_TIMER_RENEW : number = 6;

function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let fish_vector    : number[] = pArray[ 0 ]!.split( "," ).map( Number );

    console.log( fish_vector );

    for ( let iteration_nr : number = 0; iteration_nr < 80; iteration_nr++ )
    {
        /*
         * Decreasing the value of each fish
         */
        for ( let fish_index : number = 0; fish_index < fish_vector.length; fish_index++ )
        {
            fish_vector[ fish_index ]!--;
        }

        for ( let fish_index : number = 0; fish_index < fish_vector.length; fish_index++ )
        {
            if ( fish_vector[ fish_index ]! === -1 )
            {
                fish_vector[ fish_index ] = FISH_TIMER_RENEW;

                fish_vector.push( FISH_TIMER_NEW )
            }
        }

        if ( pKnzDebug )
        {
            console.log( fish_vector );
        }

        wl( "Nr " + iteration_nr );
    }

    result_part_01 = fish_vector.length;

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day06_input.txt";

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

    array_test.push( "3,4,3,1,2" );

    return array_test;
}


wl( "" );
wl( "Day 06 - Lanternfish" );
wl( "" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" )
wl( "Day 06 - End " );
