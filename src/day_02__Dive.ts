
import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2021/day/2
 * 
 */

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


class SubMarine
{
    pos_x : number = 0;

    pos_y : number = 0;

    constructor( pStartX : number, pStartY : number )
    {
        this.pos_x = pStartX;

        this.pos_y = pStartY;
    }

    public doCommand( pCmdString : string ) : void 
    {
        if ( pCmdString.indexOf( "forward" ) >= 0 )
        {
            let move_x = parseInt( pCmdString.substring( 7 ) );

            wl( "Sub - Forward - " + padL( move_x, 5 ) + " From " + padL( this.pos_x , 5 ) + " to " + padL( ( this.pos_x + move_x ) , 5 ) );

            this.pos_x += move_x;
        }
        else if ( pCmdString.indexOf( "up" ) >= 0 )
        {
            let move_y = parseInt( pCmdString.substring( 2 ) );

            wl( "Sub - Up      - " + padL( move_y, 5 ) + " From " + padL( this.pos_y , 5 ) + " to " + padL( ( this.pos_y - move_y ) , 5 ) );

            this.pos_y -= move_y;

            if ( this.pos_y < 0 )
            {
                this.pos_y = 0;
            }
        }
        else if ( pCmdString.indexOf( "down" ) >= 0 )
        {
            let move_y = parseInt( pCmdString.substring( 4 ) );

            this.pos_y += move_y;

            if ( this.pos_y < 0 )
            {
                this.pos_y = 0;
            }

            wl( "Sub - Down    - " + padL( move_y, 5 ) + " From " + padL( this.pos_y , 5 ) + " to " + padL( ( this.pos_y + move_y ) , 5 ) );
        }
    }

    public getX() : number 
    {
        return this.pos_x;
    }

    public getY() : number 
    {
        return this.pos_y;
    }
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

    let sub_marine : SubMarine = new SubMarine( 0, 0 );

    for ( const cur_input_str of pArray ) 
    {
        sub_marine.doCommand( cur_input_str );
    }

    result_part_01 = sub_marine.getX() *  sub_marine.getY();

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2021__day02_input.txt";

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

    array_test.push( "forward 5" );
    array_test.push( "down 5" );
    array_test.push( "forward 8" );
    array_test.push( "up 3" );
    array_test.push( "down 8" );
    array_test.push( "forward 2" );

    return array_test;
}


wl( "" );
wl( "Day 02 - Dive" );
wl( "" );

calcArray( getTestArray1(), 4, true );

//checkReaddatei();


wl( "" )
wl( "Day 02 - End " );
