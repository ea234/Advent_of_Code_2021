import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 24: Arithmetic Logic Unit ---
 * https://adventofcode.com/2021/day/24
 * 
 * https://www.reddit.com/r/adventofcode/comments/rnejv5/2021_day_24_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2021/blob/main/src/day_24__Arithmetic_Logic_Unit.ts
 * 
  * 
 */
type PropRegisters = Record< string, number >;


function wl( pString: string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function padL( pInput: string | number, pPadLeft: number ): string {
    let str_result: string = pInput.toString();

    while ( str_result.length < pPadLeft ) {
        str_result = " " + str_result;
    }

    return str_result;
}


function calcPgmMonad1( pArray: string[], pVector : number[], pKnzDebug : boolean, pKnzCreatePgm : boolean ) : number
{
    if ( ( pVector.toString().includes( "0" ) ) )
    {
        return 1;
    }

    let submarine_model_number_idx : number = 0;

    let registers : PropRegisters = {};

    registers[ "w" ] = 0;
    registers[ "x" ] = 0;
    registers[ "y" ] = 0;
    registers[ "z" ] = 0;


    const get_value = ( param_var : string ) : number => {

        const param_number = Number( param_var );

        if ( Number.isNaN( param_number ) ) 
        {
            return registers[ param_var ] ?? 0;
        }

       return param_number;
    };


    for ( let pgm_pointer: number = 0; pgm_pointer < pArray.length; pgm_pointer++ ) {

        let [ op_code, variable_a, variable_b ]: string[] = pArray[ pgm_pointer ]!.split( " " );

        let beschreibung_s = "";


        let value_a : number = get_value( variable_a! );

        let b_var_a = "Wert von Variable " + variable_a + " (" + value_a + ") "

        let value_b : number = get_value( variable_b ?? "a" );

        let b_var_b = "";

        let b_a_var_name = "variable_" + variable_a;
        let b_b_var_name = undefined;

        const param_number = Number( variable_b ?? "a" );

        if ( Number.isNaN( param_number ) ) 
        {
            b_var_b = " Wert von Variable " + variable_b + " (" + padL( value_b, 10 ) + ") "

            b_b_var_name = "variable_" + variable_b!;
        }
        else 
        {
            b_var_b = " Wert B (" + padL( value_b, 10 ) + ") "
        }

        if ( op_code === "inp" ) 
        { 
            /*
             * inp a - Read an input value and write it to variable a.
             */
            registers[ variable_a! ] = pVector[ submarine_model_number_idx ] ?? 0;

                
            if ( pKnzCreatePgm )
            {
                wl( b_a_var_name + " = " + "submarine_model_number_idx[ " + submarine_model_number_idx + " ]!;");
            }
            
            submarine_model_number_idx++;

            if ( submarine_model_number_idx >= pVector.length )
            {
                submarine_model_number_idx = 0;
            }
        }
        else if ( op_code === "add" ) 
        { 
            /*
             * add a b - Add the value of a to the value of b, then store the result in variable a.
             */

            if ( pKnzCreatePgm )
            {
                if ( b_b_var_name == undefined )
                {
                    wl( b_a_var_name + " = " + b_a_var_name + " + " + padL( value_b, 10 ) + ";");
                }
                else
                {

                    wl( b_a_var_name + " = " + b_a_var_name + " + " + b_b_var_name + ";");
                }
            }

            registers[ variable_a! ] = value_a + value_b;
        }
        else if ( op_code === "mul" ) 
        { 
            /*
             * mul a b - Multiply the value of a by the value of b, then store the result in variable a.
             */
            if ( pKnzCreatePgm )
            {
                if ( b_b_var_name == undefined )
                {
                    if ( value_b == 0 )
                    {
                        wl( b_a_var_name + " = 0;");
                    }
                    else
                    {
                        wl( b_a_var_name + " = " + b_a_var_name + " * " + padL( value_b, 10 ) + ";");
                    }
                }
                else
                {
                    wl( b_a_var_name + " = " + b_a_var_name + " * " + b_b_var_name + ";");
                }
            }

            registers[ variable_a! ] = value_a * value_b;
        }
        else if ( op_code === "div" )
        { 
            /*
             * div a b - Divide the value of a by the value of b, truncate the result to an integer, then 
             *           store the result in variable a. (Here, "truncate" means to round the value toward zero.)
             */
            if ( pKnzCreatePgm )
            {
                if ( b_b_var_name == undefined )
                {
                    wl( b_a_var_name + " = Math.floor( " + b_a_var_name + " / " + padL( value_b, 10 ) + " ); //");
                }
                else
                {
                    wl( b_a_var_name + " = Math.floor( " + b_a_var_name + " / " + b_b_var_name + " ); //");
                }
            }

            registers[ variable_a! ] = Math.floor( value_a / value_b );
        }
        else if ( op_code === "mod" ) 
        { 
            /*
             * mod a b - Divide the value of a by the value of b, then store the remainder in variable a. 
             *           (This is also called the modulo operation.)
             */
            if ( pKnzCreatePgm )
            {
                if ( b_b_var_name == undefined )
                {
                    wl( b_a_var_name + " = " + b_a_var_name + " % " + padL( value_b, 10 ) + ";");
                }
                else
                {
                    wl( b_a_var_name + " = " + b_a_var_name + " % " + b_b_var_name + ";");
                }
            }

            registers[ variable_a! ] = Math.floor( value_a % value_b );
        }
        else if ( op_code === "eql" ) 
        { 
            /*
             * eql a b - If the value of a and b are equal, then store the value 1 in variable a. 
             *           Otherwise, store the value 0 in variable a.
             */
            if ( pKnzCreatePgm )
            {
                if ( b_b_var_name == undefined )
                {
                    wl( b_a_var_name + " = (" + b_a_var_name + " === " + padL( value_b, 10 ) + " ) ? 1 : 0; //");
                }
                else
                {
                    wl( b_a_var_name + " = (" + b_a_var_name + " === " + b_b_var_name + " ) ? 1 : 0; //");
                }
            }

            registers[ variable_a! ] = ( value_a === value_b ) ? 1 : 0;
        }

        if ( pKnzDebug )
        {
            wl( "Instruction Nr. " + padL( pgm_pointer, 3 ) + "  =  OpCode " + op_code + "  A " + variable_a + " (=" + padL( value_a, 10 ) + ")  B " + padL( variable_b ?? "-", 3 ) + " (=" + padL( value_b, 10 ) + ")  w = " + padL( registers[ "w" ], 10 ) + "  x = " + padL( registers[ "x" ], 10 ) + "  y = " + padL( registers[ "y" ], 10 ) +  "  z = " + padL( registers[ "z" ], 10 ) );
        }
    }

    return registers[ "z" ];
}

function calcMyMonad( submarine_model_number_idx: number[] ): number 
{
    let result_check_number   : number = 0;
    let cur_digit_model_number: number = 0;
    let variable_y            : number = 0;

    let number_26             : number = 26;

    let number_add            : number[] = [ 3, 12, 9, 12, 2, 1, 1, 13, 1, 6, 2, 11, 10, 3 ];

    //                                       0  1  2  3  4  5  6  7  8  9  0  1  2  3  4 
    let modulo_x              : number[] = [ 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1 ];

    for ( let idx: number = 0; idx < number_add.length; idx++ ) 
    {
        if ( modulo_x[ idx ] === 1 ) 
        {
            result_check_number = Math.floor( result_check_number / number_26 ); //
        }

        result_check_number = result_check_number * number_26;

        variable_y = submarine_model_number_idx[ idx ]! + number_add[ idx ]!;

        result_check_number = result_check_number + variable_y;
    }

    return result_check_number;
}

function calcMyMonad2( submarine_model_number_idx: number[] ): number 
{
let variable_x : number = 0;
let variable_z : number = 0;
let variable_w : number = 0;
let variable_y : number = 0;

    let number_26             : number = 26;

    let number_add            : number[] = [ 3, 12, 9, 12, 2, 1, 1, 13, 1, 6, 2, 11, 10, 3 ];

    //                                       0  1  2  3  4  5  6  7  8  9  0  1  2  3  4 
    let modulo_x              : number[] = [ 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1 ];

    for ( let idx: number = 0; idx < number_add.length; idx++ ) 
    {
        variable_w = submarine_model_number_idx[ 3 ]!;
        variable_x = 0;
        variable_x = variable_x + variable_z;
        variable_x = variable_x %         26;

        if ( modulo_x[ idx ] === 1 ) 
        {
            variable_z = Math.floor( variable_z /         26 ); //
        }

        variable_x = variable_x +         -6;
        variable_x = (variable_x === variable_w ) ? 1 : 0; //
        variable_x = (variable_x ===          0 ) ? 1 : 0; //
        variable_y = 0;
        variable_y = variable_y +         25;
        variable_y = variable_y * variable_x;
        variable_y = variable_y +          1;
        variable_z = variable_z * variable_y;
        variable_y = 0;
        variable_y = variable_y + variable_w;
        variable_y = variable_y + number_add[ idx ]!;
        variable_y = variable_y * variable_x;
        variable_z = variable_z + variable_y;
    }

    return variable_z;
}


function getNextNumber( pVector : number[] ) : void
{
    for ( let cur_idx = ( pVector.length - 1); cur_idx >= 0; cur_idx-- ) 
    {
        /*
         * Increment the current value
         */
        pVector[ cur_idx ]!++;

        /*
         * If the current value is below 10, no carry 
         * is neccessary. 
         */
        if ( pVector[ cur_idx ]! < 10 )
        {
            return;
        }

        /*
         * If the current index is 10, set it to
         * 1 and continue with the next index.
         */

        pVector[ cur_idx ] = 1;
    }
}

function calcArray( pArray: string[], pKnzDebug: boolean = true ): void 
{
    let result_part_01: number = 0;

    let model_nr : number[] = [1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 1, 2, 2, 1];

    /*
     * *******************************************************************************************************
     * 
     * *******************************************************************************************************
     */
    
    calcPgmMonad1( pArray, model_nr, false, true );//(  pKnzDebug ) || ( round_nr === 0 ) );

    let check_sum = 1;

    let round_nr = 0;

    let min_round_nr =  100;// 99999999999999;

    while ( ( check_sum > 0 ) && ( round_nr < min_round_nr ) )
    {
        getNextNumber( model_nr );        

        //check_sum = calcPgmMonad1( pArray, model_nr, (  pKnzDebug ) || ( round_nr === 0 ), false );
        check_sum = calcPgmMonad1( pArray, model_nr, false, false );
        
        let check_sum2 = calcMyMonad(  model_nr );
        let check_sum3 = calcMyMonad2(  model_nr );

        wl( "Round " + padL( round_nr, 6 ) + "  Model Nr " + model_nr.join("") + "  CheckSum " + padL( check_sum, 16 ) + " check_sum2 " + check_sum2 + " " + check_sum3 );

        round_nr++;
    }

    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + model_nr.toString );

    wl( "-----------------------" );
    wl( "" );
}


async function readFileLines(): Promise<string[]> {
    const filePath: string = "/mnt/hd4tbb/daten/zdownload/advent_of_code_2021__day24_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei(): void {
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1(): string[] {
    const array_test: string[] = [];

    array_test.push( "inp w" );
    array_test.push( "add z w" );
    array_test.push( "mod z 2" );
    array_test.push( "div w 2" );
    array_test.push( "add y w" );
    array_test.push( "mod y 2" );
    array_test.push( "div w 2" );
    array_test.push( "add x w" );
    array_test.push( "mod x 2" );
    array_test.push( "div w 2" );
    array_test.push( "mod w 2" );

    return array_test;
}


wl( "" );
wl( "Day 24: Arithmetic Logic Unit" );
wl( "" );

//calcArray( getTestArray1(), true );

checkReaddatei();

wl( "" );
wl( "Day 24 - End " );

/*

variable_w = submarine_model_number_idx[ 0 ]!;

// variable_x = 0;
// variable_x = variable_x + variable_z;
// variable_x = variable_x %         26;

variable_x = variable_z %         26;

// variable_z = Math.floor( variable_z /          1 );



// variable_x = variable_x +         13;
// variable_x = (variable_x === variable_w ) ? 1 : 0; //
// variable_x = (variable_x ===          0 ) ? 1 : 0; //

variable_x = 1;

// variable_y = 0;
// variable_y = variable_y +         25;
// variable_y = variable_y * variable_x;
// variable_y = variable_y +          1;

variable_y = 26;

variable_z = variable_z * variable_y;

variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          3;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;




Round     12  Model Nr 12345678891235  CheckSum       1409469030 check_sum2 1409469030 1409469030
Round     13  Model Nr 12345678891236  CheckSum         54210347 check_sum2 1409469031 1409469022
Round     14  Model Nr 12345678891237  CheckSum       1409469032 check_sum2 1409469032 1409469032
*/







function calcMyMonad4( submarine_model_number_idx : number[] ) : number
{

let variable_x : number = 0;
let variable_z : number = 0;
let variable_w : number = 0;
let variable_y : number = 0;

variable_w = submarine_model_number_idx[ 0 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         13;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          3;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 1 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         11;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +         12;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 2 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         15;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          9;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 3 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +         -6;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +         12;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 4 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         15;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          2;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 5 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +         -8;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          1;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 6 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +         -4;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          1;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 7 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         15;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +         13;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 8 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         10;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          1;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 9 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /          1 ); //
variable_x = variable_x +         11;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          6;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 10 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +        -11;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          2;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 11 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +          0;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +         11;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 12 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +         -8;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +         10;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;
variable_w = submarine_model_number_idx[ 13 ]!;
variable_x = 0;
variable_x = variable_x + variable_z;
variable_x = variable_x %         26;
variable_z = Math.floor( variable_z /         26 ); //
variable_x = variable_x +         -7;
variable_x = (variable_x === variable_w ) ? 1 : 0; //
variable_x = (variable_x ===          0 ) ? 1 : 0; //
variable_y = 0;
variable_y = variable_y +         25;
variable_y = variable_y * variable_x;
variable_y = variable_y +          1;
variable_z = variable_z * variable_y;
variable_y = 0;
variable_y = variable_y + variable_w;
variable_y = variable_y +          3;
variable_y = variable_y * variable_x;
variable_z = variable_z + variable_y;

return variable_z;
}
