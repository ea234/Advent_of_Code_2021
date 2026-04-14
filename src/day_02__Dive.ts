
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

class SubMarine
{
    pos_x : number = 0;

    pos_y : number = 0;

    aim   : number = 0;

    constructor( pStartX : number, pStartY : number )
    {
        this.pos_x = pStartX;

        this.pos_y = pStartY;
    }

    public reset()
    {
        this.pos_x = 0;
        
        this.pos_y = 0;

        this.aim = 0;
    }

    public doCommandPart1( pCmdString : string ) : void 
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

    public doCommandPart2( pCmdString : string ) : void 
    {
        if ( pCmdString.indexOf( "forward" ) >= 0 )
        {
            let move_x = parseInt( pCmdString.substring( 7 ) );

            wl( "Sub - Forward - " + padL( move_x, 5 ) + " From " + padL( this.pos_x , 5 ) + " to " + padL( ( this.pos_x + move_x ) , 5 ) );

            let depth_increase : number = this.aim * move_x;

            wl( "Sub - Forward - Depth " + padL( this.aim, 5 ) + " * X " + padL( move_x, 5 ) + " = " + padL( depth_increase, 5 ) + " From " + padL( this.pos_y , 5 ) + " to " + padL( ( this.pos_y + depth_increase ) , 5 ) );


            this.pos_x += move_x;
            this.pos_y += depth_increase;
        }
        else if ( pCmdString.indexOf( "up" ) >= 0 )
        {
            let decrease_aim = parseInt( pCmdString.substring( 2 ) );

            wl( "Sub - Up      - Decrease aim " + padL( decrease_aim, 5 ) + " From " + padL( this.aim , 5 ) + " to " + padL( ( this.aim - decrease_aim ) , 5 ) );

            this.aim -= decrease_aim;
        }
        else if ( pCmdString.indexOf( "down" ) >= 0 )
        {
            let increase_aim = parseInt( pCmdString.substring( 4 ) );

            wl( "Sub - Down    - Increase aim " + padL( increase_aim, 5 ) + " From " + padL( this.aim , 5 ) + " to " + padL( ( this.aim + increase_aim ) , 5 ) );

            this.aim += increase_aim;
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

function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
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
        sub_marine.doCommandPart1( cur_input_str );
    }

    result_part_01 = sub_marine.getX() *  sub_marine.getY();

    /*
     * *******************************************************************************************************
     * Calculating Part 2
     * *******************************************************************************************************
     */
    wl( "" );
    wl( "---------------------------------------------------------" );
    wl( "" );

    sub_marine.reset();

    for ( const cur_input_str of pArray ) 
    {
        sub_marine.doCommandPart2( cur_input_str );
    }

    result_part_02 = sub_marine.getX() *  sub_marine.getY();

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

        calcArray( arrFromFile, false );
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

calcArray( getTestArray1(), true );

checkReaddatei();


wl( "" )
wl( "Day 02 - End " );
