import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 24: Arithmetic Logic Unit ---
 * https://adventofcode.com/2021/day/24
 * 
 * https://www.reddit.com/r/adventofcode/comments/rnejv5/2021_day_24_solutions/
 * 
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


function calcPgmMonad( pArray: string[], pVector : number[], pKnzDebug : boolean ) : number
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

        let value_a : number = get_value( variable_a! );

        let value_b : number = get_value( variable_b ?? "a" );

        if ( op_code === "inp" ) 
        { 
            /*
             * inp a - Read an input value and write it to variable a.
             */
            registers[ variable_a! ] = pVector[ submarine_model_number_idx ] ?? 0;

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
            registers[ variable_a! ] = value_a + value_b;
        }
        else if ( op_code === "mul" ) 
        { 
            /*
             * mul a b - Multiply the value of a by the value of b, then store the result in variable a.
             */
            registers[ variable_a! ] = value_a * value_b;
        }
        else if ( op_code === "div" )
        { 
            /*
             * div a b - Divide the value of a by the value of b, truncate the result to an integer, then 
             *           store the result in variable a. (Here, "truncate" means to round the value toward zero.)
             */
            registers[ variable_a! ] = Math.floor( value_a / value_b );
        }
        else if ( op_code === "mod" ) 
        { getNextNumber
            /*
             * mod a b - Divide the value of a by the value of b, then store the remainder in variable a. 
             *           (This is also called the modulo operation.)
             */
            registers[ variable_a! ] = Math.floor( value_a % value_b );
        }
        else if ( op_code === "eql" ) 
        { 
            /*
             * eql a b - If the value of a and b are equal, then store the value 1 in variable a. 
             *           Otherwise, store the value 0 in variable a.
             */
            registers[ variable_a! ] = ( value_a === value_b ) ? 1 : 0;
        }

        if ( pKnzDebug )
        {
            wl( "Instruction Nr. " + padL( pgm_pointer, 3 ) + "  =  OpCode " + op_code + "  A " + variable_a + " (=" + padL( value_a, 10 ) + ")  B " + padL( variable_b ?? "-", 3 ) + " (=" + padL( value_b, 10 ) + ")  w = " + padL( registers[ "w" ], 10 ) + "  x = " + padL( registers[ "x" ], 10 ) + "  y = " + padL( registers[ "y" ], 10 ) +  "  z = " + padL( registers[ "z" ], 10 ) );
        }
    }

    return registers[ "z" ];
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

    let model_nr : number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    /*
     * *******************************************************************************************************
     * 
     * *******************************************************************************************************
     */
    
    let check_sum = 1;

    let round_nr = 0;

    let min_round_nr =  100_000_000; // 99999999999999;

    while ( ( check_sum > 0 ) && ( round_nr < min_round_nr ) )
    {
        getNextNumber( model_nr );        

        check_sum = calcPgmMonad( pArray, model_nr, (  pKnzDebug ) || ( round_nr === 0 ) );

        wl( "Round " + padL( round_nr, 6 ) + "  Model Nr " + model_nr.join("") + "  CheckSum " + padL( check_sum, 16 ) );

        round_nr++;
    }

    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + model_nr.toString );

    wl( "-----------------------" );
    wl( "" );
}


async function readFileLines(): Promise<string[]> 
{
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

/home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day24/day_24__Arithmetic_Logic_Unit.js

Day 24: Arithmetic Logic Unit

Day 24 - End
Instruction Nr.   0  =  OpCode inp  A w (=         0)  B   - (=         0)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   1  =  OpCode mul  A x (=         0)  B   0 (=         0)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   2  =  OpCode add  A x (=         0)  B   z (=         0)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   3  =  OpCode mod  A x (=         0)  B  26 (=        26)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   4  =  OpCode div  A z (=         0)  B   1 (=         1)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   5  =  OpCode add  A x (=         0)  B  13 (=        13)  w =          9  x =         13  y =          0  z =          0
Instruction Nr.   6  =  OpCode eql  A x (=        13)  B   w (=         9)  w =          9  x =          0  y =          0  z =          0
Instruction Nr.   7  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =          0  z =          0
Instruction Nr.   8  =  OpCode mul  A y (=         0)  B   0 (=         0)  w =          9  x =          1  y =          0  z =          0
Instruction Nr.   9  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =          0
Instruction Nr.  10  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =          0
Instruction Nr.  11  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =          0
Instruction Nr.  12  =  OpCode mul  A z (=         0)  B   y (=        26)  w =          9  x =          1  y =         26  z =          0
Instruction Nr.  13  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =          0
Instruction Nr.  14  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =          0
Instruction Nr.  15  =  OpCode add  A y (=         9)  B   3 (=         3)  w =          9  x =          1  y =         12  z =          0
Instruction Nr.  16  =  OpCode mul  A y (=        12)  B   x (=         1)  w =          9  x =          1  y =         12  z =          0
Instruction Nr.  17  =  OpCode add  A z (=         0)  B   y (=        12)  w =          9  x =          1  y =         12  z =         12
Instruction Nr.  18  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         12  z =         12
Instruction Nr.  19  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         12  z =         12
Instruction Nr.  20  =  OpCode add  A x (=         0)  B   z (=        12)  w =          9  x =         12  y =         12  z =         12
Instruction Nr.  21  =  OpCode mod  A x (=        12)  B  26 (=        26)  w =          9  x =         12  y =         12  z =         12
Instruction Nr.  22  =  OpCode div  A z (=        12)  B   1 (=         1)  w =          9  x =         12  y =         12  z =         12
Instruction Nr.  23  =  OpCode add  A x (=        12)  B  11 (=        11)  w =          9  x =         23  y =         12  z =         12
Instruction Nr.  24  =  OpCode eql  A x (=        23)  B   w (=         9)  w =          9  x =          0  y =         12  z =         12
Instruction Nr.  25  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         12  z =         12
Instruction Nr.  26  =  OpCode mul  A y (=        12)  B   0 (=         0)  w =          9  x =          1  y =          0  z =         12
Instruction Nr.  27  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =         12
Instruction Nr.  28  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =         12
Instruction Nr.  29  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =         12
Instruction Nr.  30  =  OpCode mul  A z (=        12)  B   y (=        26)  w =          9  x =          1  y =         26  z =        312
Instruction Nr.  31  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =        312
Instruction Nr.  32  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =        312
Instruction Nr.  33  =  OpCode add  A y (=         9)  B  12 (=        12)  w =          9  x =          1  y =         21  z =        312
Instruction Nr.  34  =  OpCode mul  A y (=        21)  B   x (=         1)  w =          9  x =          1  y =         21  z =        312
Instruction Nr.  35  =  OpCode add  A z (=       312)  B   y (=        21)  w =          9  x =          1  y =         21  z =        333
Instruction Nr.  36  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         21  z =        333
Instruction Nr.  37  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         21  z =        333
Instruction Nr.  38  =  OpCode add  A x (=         0)  B   z (=       333)  w =          9  x =        333  y =         21  z =        333
Instruction Nr.  39  =  OpCode mod  A x (=       333)  B  26 (=        26)  w =          9  x =         21  y =         21  z =        333
Instruction Nr.  40  =  OpCode div  A z (=       333)  B   1 (=         1)  w =          9  x =         21  y =         21  z =        333
Instruction Nr.  41  =  OpCode add  A x (=        21)  B  15 (=        15)  w =          9  x =         36  y =         21  z =        333
Instruction Nr.  42  =  OpCode eql  A x (=        36)  B   w (=         9)  w =          9  x =          0  y =         21  z =        333
Instruction Nr.  43  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         21  z =        333
Instruction Nr.  44  =  OpCode mul  A y (=        21)  B   0 (=         0)  w =          9  x =          1  y =          0  z =        333
Instruction Nr.  45  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =        333
Instruction Nr.  46  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =        333
Instruction Nr.  47  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =        333
Instruction Nr.  48  =  OpCode mul  A z (=       333)  B   y (=        26)  w =          9  x =          1  y =         26  z =       8658
Instruction Nr.  49  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =       8658
Instruction Nr.  50  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =       8658
Instruction Nr.  51  =  OpCode add  A y (=         9)  B   9 (=         9)  w =          9  x =          1  y =         18  z =       8658
Instruction Nr.  52  =  OpCode mul  A y (=        18)  B   x (=         1)  w =          9  x =          1  y =         18  z =       8658
Instruction Nr.  53  =  OpCode add  A z (=      8658)  B   y (=        18)  w =          9  x =          1  y =         18  z =       8676
Instruction Nr.  54  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         18  z =       8676
Instruction Nr.  55  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         18  z =       8676
Instruction Nr.  56  =  OpCode add  A x (=         0)  B   z (=      8676)  w =          9  x =       8676  y =         18  z =       8676
Instruction Nr.  57  =  OpCode mod  A x (=      8676)  B  26 (=        26)  w =          9  x =         18  y =         18  z =       8676
Instruction Nr.  58  =  OpCode div  A z (=      8676)  B  26 (=        26)  w =          9  x =         18  y =         18  z =        333
Instruction Nr.  59  =  OpCode add  A x (=        18)  B  -6 (=        -6)  w =          9  x =         12  y =         18  z =        333
Instruction Nr.  60  =  OpCode eql  A x (=        12)  B   w (=         9)  w =          9  x =          0  y =         18  z =        333
Instruction Nr.  61  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         18  z =        333
Instruction Nr.  62  =  OpCode mul  A y (=        18)  B   0 (=         0)  w =          9  x =          1  y =          0  z =        333
Instruction Nr.  63  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =        333
Instruction Nr.  64  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =        333
Instruction Nr.  65  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =        333
Instruction Nr.  66  =  OpCode mul  A z (=       333)  B   y (=        26)  w =          9  x =          1  y =         26  z =       8658
Instruction Nr.  67  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =       8658
Instruction Nr.  68  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =       8658
Instruction Nr.  69  =  OpCode add  A y (=         9)  B  12 (=        12)  w =          9  x =          1  y =         21  z =       8658
Instruction Nr.  70  =  OpCode mul  A y (=        21)  B   x (=         1)  w =          9  x =          1  y =         21  z =       8658
Instruction Nr.  71  =  OpCode add  A z (=      8658)  B   y (=        21)  w =          9  x =          1  y =         21  z =       8679
Instruction Nr.  72  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         21  z =       8679
Instruction Nr.  73  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         21  z =       8679
Instruction Nr.  74  =  OpCode add  A x (=         0)  B   z (=      8679)  w =          9  x =       8679  y =         21  z =       8679
Instruction Nr.  75  =  OpCode mod  A x (=      8679)  B  26 (=        26)  w =          9  x =         21  y =         21  z =       8679
Instruction Nr.  76  =  OpCode div  A z (=      8679)  B   1 (=         1)  w =          9  x =         21  y =         21  z =       8679
Instruction Nr.  77  =  OpCode add  A x (=        21)  B  15 (=        15)  w =          9  x =         36  y =         21  z =       8679
Instruction Nr.  78  =  OpCode eql  A x (=        36)  B   w (=         9)  w =          9  x =          0  y =         21  z =       8679
Instruction Nr.  79  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         21  z =       8679
Instruction Nr.  80  =  OpCode mul  A y (=        21)  B   0 (=         0)  w =          9  x =          1  y =          0  z =       8679
Instruction Nr.  81  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr.  82  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr.  83  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =       8679
Instruction Nr.  84  =  OpCode mul  A z (=      8679)  B   y (=        26)  w =          9  x =          1  y =         26  z =     225654
Instruction Nr.  85  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =     225654
Instruction Nr.  86  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =     225654
Instruction Nr.  87  =  OpCode add  A y (=         9)  B   2 (=         2)  w =          9  x =          1  y =         11  z =     225654
Instruction Nr.  88  =  OpCode mul  A y (=        11)  B   x (=         1)  w =          9  x =          1  y =         11  z =     225654
Instruction Nr.  89  =  OpCode add  A z (=    225654)  B   y (=        11)  w =          9  x =          1  y =         11  z =     225665
Instruction Nr.  90  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         11  z =     225665
Instruction Nr.  91  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         11  z =     225665
Instruction Nr.  92  =  OpCode add  A x (=         0)  B   z (=    225665)  w =          9  x =     225665  y =         11  z =     225665
Instruction Nr.  93  =  OpCode mod  A x (=    225665)  B  26 (=        26)  w =          9  x =         11  y =         11  z =     225665
Instruction Nr.  94  =  OpCode div  A z (=    225665)  B  26 (=        26)  w =          9  x =         11  y =         11  z =       8679
Instruction Nr.  95  =  OpCode add  A x (=        11)  B  -8 (=        -8)  w =          9  x =          3  y =         11  z =       8679
Instruction Nr.  96  =  OpCode eql  A x (=         3)  B   w (=         9)  w =          9  x =          0  y =         11  z =       8679
Instruction Nr.  97  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         11  z =       8679
Instruction Nr.  98  =  OpCode mul  A y (=        11)  B   0 (=         0)  w =          9  x =          1  y =          0  z =       8679
Instruction Nr.  99  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr. 100  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr. 101  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =       8679
Instruction Nr. 102  =  OpCode mul  A z (=      8679)  B   y (=        26)  w =          9  x =          1  y =         26  z =     225654
Instruction Nr. 103  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =     225654
Instruction Nr. 104  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =     225654
Instruction Nr. 105  =  OpCode add  A y (=         9)  B   1 (=         1)  w =          9  x =          1  y =         10  z =     225654
Instruction Nr. 106  =  OpCode mul  A y (=        10)  B   x (=         1)  w =          9  x =          1  y =         10  z =     225654
Instruction Nr. 107  =  OpCode add  A z (=    225654)  B   y (=        10)  w =          9  x =          1  y =         10  z =     225664
Instruction Nr. 108  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         10  z =     225664
Instruction Nr. 109  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         10  z =     225664
Instruction Nr. 110  =  OpCode add  A x (=         0)  B   z (=    225664)  w =          9  x =     225664  y =         10  z =     225664
Instruction Nr. 111  =  OpCode mod  A x (=    225664)  B  26 (=        26)  w =          9  x =         10  y =         10  z =     225664
Instruction Nr. 112  =  OpCode div  A z (=    225664)  B  26 (=        26)  w =          9  x =         10  y =         10  z =       8679
Instruction Nr. 113  =  OpCode add  A x (=        10)  B  -4 (=        -4)  w =          9  x =          6  y =         10  z =       8679
Instruction Nr. 114  =  OpCode eql  A x (=         6)  B   w (=         9)  w =          9  x =          0  y =         10  z =       8679
Instruction Nr. 115  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         10  z =       8679
Instruction Nr. 116  =  OpCode mul  A y (=        10)  B   0 (=         0)  w =          9  x =          1  y =          0  z =       8679
Instruction Nr. 117  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr. 118  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =       8679
Instruction Nr. 119  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =       8679
Instruction Nr. 120  =  OpCode mul  A z (=      8679)  B   y (=        26)  w =          9  x =          1  y =         26  z =     225654
Instruction Nr. 121  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =     225654
Instruction Nr. 122  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =     225654
Instruction Nr. 123  =  OpCode add  A y (=         9)  B   1 (=         1)  w =          9  x =          1  y =         10  z =     225654
Instruction Nr. 124  =  OpCode mul  A y (=        10)  B   x (=         1)  w =          9  x =          1  y =         10  z =     225654
Instruction Nr. 125  =  OpCode add  A z (=    225654)  B   y (=        10)  w =          9  x =          1  y =         10  z =     225664
Instruction Nr. 126  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         10  z =     225664
Instruction Nr. 127  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         10  z =     225664
Instruction Nr. 128  =  OpCode add  A x (=         0)  B   z (=    225664)  w =          9  x =     225664  y =         10  z =     225664
Instruction Nr. 129  =  OpCode mod  A x (=    225664)  B  26 (=        26)  w =          9  x =         10  y =         10  z =     225664
Instruction Nr. 130  =  OpCode div  A z (=    225664)  B   1 (=         1)  w =          9  x =         10  y =         10  z =     225664
Instruction Nr. 131  =  OpCode add  A x (=        10)  B  15 (=        15)  w =          9  x =         25  y =         10  z =     225664
Instruction Nr. 132  =  OpCode eql  A x (=        25)  B   w (=         9)  w =          9  x =          0  y =         10  z =     225664
Instruction Nr. 133  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         10  z =     225664
Instruction Nr. 134  =  OpCode mul  A y (=        10)  B   0 (=         0)  w =          9  x =          1  y =          0  z =     225664
Instruction Nr. 135  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =     225664
Instruction Nr. 136  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =     225664
Instruction Nr. 137  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =     225664
Instruction Nr. 138  =  OpCode mul  A z (=    225664)  B   y (=        26)  w =          9  x =          1  y =         26  z =    5867264
Instruction Nr. 139  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =    5867264
Instruction Nr. 140  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =    5867264
Instruction Nr. 141  =  OpCode add  A y (=         9)  B  13 (=        13)  w =          9  x =          1  y =         22  z =    5867264
Instruction Nr. 142  =  OpCode mul  A y (=        22)  B   x (=         1)  w =          9  x =          1  y =         22  z =    5867264
Instruction Nr. 143  =  OpCode add  A z (=   5867264)  B   y (=        22)  w =          9  x =          1  y =         22  z =    5867286
Instruction Nr. 144  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         22  z =    5867286
Instruction Nr. 145  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         22  z =    5867286
Instruction Nr. 146  =  OpCode add  A x (=         0)  B   z (=   5867286)  w =          9  x =    5867286  y =         22  z =    5867286
Instruction Nr. 147  =  OpCode mod  A x (=   5867286)  B  26 (=        26)  w =          9  x =         22  y =         22  z =    5867286
Instruction Nr. 148  =  OpCode div  A z (=   5867286)  B   1 (=         1)  w =          9  x =         22  y =         22  z =    5867286
Instruction Nr. 149  =  OpCode add  A x (=        22)  B  10 (=        10)  w =          9  x =         32  y =         22  z =    5867286
Instruction Nr. 150  =  OpCode eql  A x (=        32)  B   w (=         9)  w =          9  x =          0  y =         22  z =    5867286
Instruction Nr. 151  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         22  z =    5867286
Instruction Nr. 152  =  OpCode mul  A y (=        22)  B   0 (=         0)  w =          9  x =          1  y =          0  z =    5867286
Instruction Nr. 153  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =    5867286
Instruction Nr. 154  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =    5867286
Instruction Nr. 155  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =    5867286
Instruction Nr. 156  =  OpCode mul  A z (=   5867286)  B   y (=        26)  w =          9  x =          1  y =         26  z =  152549436
Instruction Nr. 157  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z =  152549436
Instruction Nr. 158  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z =  152549436
Instruction Nr. 159  =  OpCode add  A y (=         9)  B   1 (=         1)  w =          9  x =          1  y =         10  z =  152549436
Instruction Nr. 160  =  OpCode mul  A y (=        10)  B   x (=         1)  w =          9  x =          1  y =         10  z =  152549436
Instruction Nr. 161  =  OpCode add  A z (= 152549436)  B   y (=        10)  w =          9  x =          1  y =         10  z =  152549446
Instruction Nr. 162  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         10  z =  152549446
Instruction Nr. 163  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         10  z =  152549446
Instruction Nr. 164  =  OpCode add  A x (=         0)  B   z (= 152549446)  w =          9  x =  152549446  y =         10  z =  152549446
Instruction Nr. 165  =  OpCode mod  A x (= 152549446)  B  26 (=        26)  w =          9  x =         10  y =         10  z =  152549446
Instruction Nr. 166  =  OpCode div  A z (= 152549446)  B   1 (=         1)  w =          9  x =         10  y =         10  z =  152549446
Instruction Nr. 167  =  OpCode add  A x (=        10)  B  11 (=        11)  w =          9  x =         21  y =         10  z =  152549446
Instruction Nr. 168  =  OpCode eql  A x (=        21)  B   w (=         9)  w =          9  x =          0  y =         10  z =  152549446
Instruction Nr. 169  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         10  z =  152549446
Instruction Nr. 170  =  OpCode mul  A y (=        10)  B   0 (=         0)  w =          9  x =          1  y =          0  z =  152549446
Instruction Nr. 171  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 172  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 173  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =  152549446
Instruction Nr. 174  =  OpCode mul  A z (= 152549446)  B   y (=        26)  w =          9  x =          1  y =         26  z = 3966285596
Instruction Nr. 175  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z = 3966285596
Instruction Nr. 176  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z = 3966285596
Instruction Nr. 177  =  OpCode add  A y (=         9)  B   6 (=         6)  w =          9  x =          1  y =         15  z = 3966285596
Instruction Nr. 178  =  OpCode mul  A y (=        15)  B   x (=         1)  w =          9  x =          1  y =         15  z = 3966285596
Instruction Nr. 179  =  OpCode add  A z (=3966285596)  B   y (=        15)  w =          9  x =          1  y =         15  z = 3966285611
Instruction Nr. 180  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         15  z = 3966285611
Instruction Nr. 181  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         15  z = 3966285611
Instruction Nr. 182  =  OpCode add  A x (=         0)  B   z (=3966285611)  w =          9  x = 3966285611  y =         15  z = 3966285611
Instruction Nr. 183  =  OpCode mod  A x (=3966285611)  B  26 (=        26)  w =          9  x =         15  y =         15  z = 3966285611
Instruction Nr. 184  =  OpCode div  A z (=3966285611)  B  26 (=        26)  w =          9  x =         15  y =         15  z =  152549446
Instruction Nr. 185  =  OpCode add  A x (=        15)  B -11 (=       -11)  w =          9  x =          4  y =         15  z =  152549446
Instruction Nr. 186  =  OpCode eql  A x (=         4)  B   w (=         9)  w =          9  x =          0  y =         15  z =  152549446
Instruction Nr. 187  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         15  z =  152549446
Instruction Nr. 188  =  OpCode mul  A y (=        15)  B   0 (=         0)  w =          9  x =          1  y =          0  z =  152549446
Instruction Nr. 189  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 190  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 191  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =  152549446
Instruction Nr. 192  =  OpCode mul  A z (= 152549446)  B   y (=        26)  w =          9  x =          1  y =         26  z = 3966285596
Instruction Nr. 193  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z = 3966285596
Instruction Nr. 194  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z = 3966285596
Instruction Nr. 195  =  OpCode add  A y (=         9)  B   2 (=         2)  w =          9  x =          1  y =         11  z = 3966285596
Instruction Nr. 196  =  OpCode mul  A y (=        11)  B   x (=         1)  w =          9  x =          1  y =         11  z = 3966285596
Instruction Nr. 197  =  OpCode add  A z (=3966285596)  B   y (=        11)  w =          9  x =          1  y =         11  z = 3966285607
Instruction Nr. 198  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         11  z = 3966285607
Instruction Nr. 199  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         11  z = 3966285607
Instruction Nr. 200  =  OpCode add  A x (=         0)  B   z (=3966285607)  w =          9  x = 3966285607  y =         11  z = 3966285607
Instruction Nr. 201  =  OpCode mod  A x (=3966285607)  B  26 (=        26)  w =          9  x =         11  y =         11  z = 3966285607
Instruction Nr. 202  =  OpCode div  A z (=3966285607)  B  26 (=        26)  w =          9  x =         11  y =         11  z =  152549446
Instruction Nr. 203  =  OpCode add  A x (=        11)  B   0 (=         0)  w =          9  x =         11  y =         11  z =  152549446
Instruction Nr. 204  =  OpCode eql  A x (=        11)  B   w (=         9)  w =          9  x =          0  y =         11  z =  152549446
Instruction Nr. 205  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         11  z =  152549446
Instruction Nr. 206  =  OpCode mul  A y (=        11)  B   0 (=         0)  w =          9  x =          1  y =          0  z =  152549446
Instruction Nr. 207  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 208  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 209  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =  152549446
Instruction Nr. 210  =  OpCode mul  A z (= 152549446)  B   y (=        26)  w =          9  x =          1  y =         26  z = 3966285596
Instruction Nr. 211  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z = 3966285596
Instruction Nr. 212  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z = 3966285596
Instruction Nr. 213  =  OpCode add  A y (=         9)  B  11 (=        11)  w =          9  x =          1  y =         20  z = 3966285596
Instruction Nr. 214  =  OpCode mul  A y (=        20)  B   x (=         1)  w =          9  x =          1  y =         20  z = 3966285596
Instruction Nr. 215  =  OpCode add  A z (=3966285596)  B   y (=        20)  w =          9  x =          1  y =         20  z = 3966285616
Instruction Nr. 216  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          9  x =          1  y =         20  z = 3966285616
Instruction Nr. 217  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          9  x =          0  y =         20  z = 3966285616
Instruction Nr. 218  =  OpCode add  A x (=         0)  B   z (=3966285616)  w =          9  x = 3966285616  y =         20  z = 3966285616
Instruction Nr. 219  =  OpCode mod  A x (=3966285616)  B  26 (=        26)  w =          9  x =         20  y =         20  z = 3966285616
Instruction Nr. 220  =  OpCode div  A z (=3966285616)  B  26 (=        26)  w =          9  x =         20  y =         20  z =  152549446
Instruction Nr. 221  =  OpCode add  A x (=        20)  B  -8 (=        -8)  w =          9  x =         12  y =         20  z =  152549446
Instruction Nr. 222  =  OpCode eql  A x (=        12)  B   w (=         9)  w =          9  x =          0  y =         20  z =  152549446
Instruction Nr. 223  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          9  x =          1  y =         20  z =  152549446
Instruction Nr. 224  =  OpCode mul  A y (=        20)  B   0 (=         0)  w =          9  x =          1  y =          0  z =  152549446
Instruction Nr. 225  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 226  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          9  x =          1  y =         25  z =  152549446
Instruction Nr. 227  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          9  x =          1  y =         26  z =  152549446
Instruction Nr. 228  =  OpCode mul  A z (= 152549446)  B   y (=        26)  w =          9  x =          1  y =         26  z = 3966285596
Instruction Nr. 229  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          9  x =          1  y =          0  z = 3966285596
Instruction Nr. 230  =  OpCode add  A y (=         0)  B   w (=         9)  w =          9  x =          1  y =          9  z = 3966285596
Instruction Nr. 231  =  OpCode add  A y (=         9)  B  10 (=        10)  w =          9  x =          1  y =         19  z = 3966285596
Instruction Nr. 232  =  OpCode mul  A y (=        19)  B   x (=         1)  w =          9  x =          1  y =         19  z = 3966285596
Instruction Nr. 233  =  OpCode add  A z (=3966285596)  B   y (=        19)  w =          9  x =          1  y =         19  z = 3966285615
Instruction Nr. 234  =  OpCode inp  A w (=         9)  B   - (=         0)  w =          8  x =          1  y =         19  z = 3966285615
Instruction Nr. 235  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          8  x =          0  y =         19  z = 3966285615
Instruction Nr. 236  =  OpCode add  A x (=         0)  B   z (=3966285615)  w =          8  x = 3966285615  y =         19  z = 3966285615
Instruction Nr. 237  =  OpCode mod  A x (=3966285615)  B  26 (=        26)  w =          8  x =         19  y =         19  z = 3966285615
Instruction Nr. 238  =  OpCode div  A z (=3966285615)  B  26 (=        26)  w =          8  x =         19  y =         19  z =  152549446
Instruction Nr. 239  =  OpCode add  A x (=        19)  B  -7 (=        -7)  w =          8  x =         12  y =         19  z =  152549446
Instruction Nr. 240  =  OpCode eql  A x (=        12)  B   w (=         8)  w =          8  x =          0  y =         19  z =  152549446
Instruction Nr. 241  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          8  x =          1  y =         19  z =  152549446
Instruction Nr. 242  =  OpCode mul  A y (=        19)  B   0 (=         0)  w =          8  x =          1  y =          0  z =  152549446
Instruction Nr. 243  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          8  x =          1  y =         25  z =  152549446
Instruction Nr. 244  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          8  x =          1  y =         25  z =  152549446
Instruction Nr. 245  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          8  x =          1  y =         26  z =  152549446
Instruction Nr. 246  =  OpCode mul  A z (= 152549446)  B   y (=        26)  w =          8  x =          1  y =         26  z = 3966285596
Instruction Nr. 247  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          8  x =          1  y =          0  z = 3966285596
Instruction Nr. 248  =  OpCode add  A y (=         0)  B   w (=         8)  w =          8  x =          1  y =          8  z = 3966285596
Instruction Nr. 249  =  OpCode add  A y (=         8)  B   3 (=         3)  w =          8  x =          1  y =         11  z = 3966285596
Instruction Nr. 250  =  OpCode mul  A y (=        11)  B   x (=         1)  w =          8  x =          1  y =         11  z = 3966285596
Instruction Nr. 251  =  OpCode add  A z (=3966285596)  B   y (=        11)  w =          8  x =          1  y =         11  z = 3966285607
Round      0  Model Nr 99999999999998  CheckSum       3966285607
Round      1  Model Nr 99999999999997  CheckSum       3966285606
Round      2  Model Nr 99999999999996  CheckSum       3966285605
Round      3  Model Nr 99999999999995  CheckSum       3966285604
Round      4  Model Nr 99999999999994  CheckSum       3966285603
Round      5  Model Nr 99999999999993  CheckSum       3966285602
Round      6  Model Nr 99999999999992  CheckSum       3966285601
Round      7  Model Nr 99999999999991  CheckSum       3966285600
Round      8  Model Nr 99999999999990  CheckSum       3966285599
Round      9  Model Nr 99999999999989  CheckSum       3966285608

Result Part 1 = 0









/home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day24/day_24__Arithmetic_Logic_Unit.js

Day 24: Arithmetic Logic Unit

Day 24 - End
Instruction Nr.   0  =  OpCode inp  A w (=         0)  B   - (=         0)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   1  =  OpCode mul  A x (=         0)  B   0 (=         0)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   2  =  OpCode add  A x (=         0)  B   z (=         0)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   3  =  OpCode mod  A x (=         0)  B  26 (=        26)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   4  =  OpCode div  A z (=         0)  B   1 (=         1)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   5  =  OpCode add  A x (=         0)  B  13 (=        13)  w =          1  x =         13  y =          0  z =          0
Instruction Nr.   6  =  OpCode eql  A x (=        13)  B   w (=         1)  w =          1  x =          0  y =          0  z =          0
Instruction Nr.   7  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          0  z =          0
Instruction Nr.   8  =  OpCode mul  A y (=         0)  B   0 (=         0)  w =          1  x =          1  y =          0  z =          0
Instruction Nr.   9  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =          0
Instruction Nr.  10  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =          0
Instruction Nr.  11  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =          0
Instruction Nr.  12  =  OpCode mul  A z (=         0)  B   y (=        26)  w =          1  x =          1  y =         26  z =          0
Instruction Nr.  13  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =          0
Instruction Nr.  14  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =          0
Instruction Nr.  15  =  OpCode add  A y (=         1)  B   3 (=         3)  w =          1  x =          1  y =          4  z =          0
Instruction Nr.  16  =  OpCode mul  A y (=         4)  B   x (=         1)  w =          1  x =          1  y =          4  z =          0
Instruction Nr.  17  =  OpCode add  A z (=         0)  B   y (=         4)  w =          1  x =          1  y =          4  z =          4
Instruction Nr.  18  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          4  z =          4
Instruction Nr.  19  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          4  z =          4
Instruction Nr.  20  =  OpCode add  A x (=         0)  B   z (=         4)  w =          1  x =          4  y =          4  z =          4
Instruction Nr.  21  =  OpCode mod  A x (=         4)  B  26 (=        26)  w =          1  x =          4  y =          4  z =          4
Instruction Nr.  22  =  OpCode div  A z (=         4)  B   1 (=         1)  w =          1  x =          4  y =          4  z =          4
Instruction Nr.  23  =  OpCode add  A x (=         4)  B  11 (=        11)  w =          1  x =         15  y =          4  z =          4
Instruction Nr.  24  =  OpCode eql  A x (=        15)  B   w (=         1)  w =          1  x =          0  y =          4  z =          4
Instruction Nr.  25  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          4  z =          4
Instruction Nr.  26  =  OpCode mul  A y (=         4)  B   0 (=         0)  w =          1  x =          1  y =          0  z =          4
Instruction Nr.  27  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =          4
Instruction Nr.  28  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =          4
Instruction Nr.  29  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =          4
Instruction Nr.  30  =  OpCode mul  A z (=         4)  B   y (=        26)  w =          1  x =          1  y =         26  z =        104
Instruction Nr.  31  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =        104
Instruction Nr.  32  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =        104
Instruction Nr.  33  =  OpCode add  A y (=         1)  B  12 (=        12)  w =          1  x =          1  y =         13  z =        104
Instruction Nr.  34  =  OpCode mul  A y (=        13)  B   x (=         1)  w =          1  x =          1  y =         13  z =        104
Instruction Nr.  35  =  OpCode add  A z (=       104)  B   y (=        13)  w =          1  x =          1  y =         13  z =        117
Instruction Nr.  36  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =         13  z =        117
Instruction Nr.  37  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =         13  z =        117
Instruction Nr.  38  =  OpCode add  A x (=         0)  B   z (=       117)  w =          1  x =        117  y =         13  z =        117
Instruction Nr.  39  =  OpCode mod  A x (=       117)  B  26 (=        26)  w =          1  x =         13  y =         13  z =        117
Instruction Nr.  40  =  OpCode div  A z (=       117)  B   1 (=         1)  w =          1  x =         13  y =         13  z =        117
Instruction Nr.  41  =  OpCode add  A x (=        13)  B  15 (=        15)  w =          1  x =         28  y =         13  z =        117
Instruction Nr.  42  =  OpCode eql  A x (=        28)  B   w (=         1)  w =          1  x =          0  y =         13  z =        117
Instruction Nr.  43  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =         13  z =        117
Instruction Nr.  44  =  OpCode mul  A y (=        13)  B   0 (=         0)  w =          1  x =          1  y =          0  z =        117
Instruction Nr.  45  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =        117
Instruction Nr.  46  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =        117
Instruction Nr.  47  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =        117
Instruction Nr.  48  =  OpCode mul  A z (=       117)  B   y (=        26)  w =          1  x =          1  y =         26  z =       3042
Instruction Nr.  49  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =       3042
Instruction Nr.  50  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =       3042
Instruction Nr.  51  =  OpCode add  A y (=         1)  B   9 (=         9)  w =          1  x =          1  y =         10  z =       3042
Instruction Nr.  52  =  OpCode mul  A y (=        10)  B   x (=         1)  w =          1  x =          1  y =         10  z =       3042
Instruction Nr.  53  =  OpCode add  A z (=      3042)  B   y (=        10)  w =          1  x =          1  y =         10  z =       3052
Instruction Nr.  54  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =         10  z =       3052
Instruction Nr.  55  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =         10  z =       3052
Instruction Nr.  56  =  OpCode add  A x (=         0)  B   z (=      3052)  w =          1  x =       3052  y =         10  z =       3052
Instruction Nr.  57  =  OpCode mod  A x (=      3052)  B  26 (=        26)  w =          1  x =         10  y =         10  z =       3052
Instruction Nr.  58  =  OpCode div  A z (=      3052)  B  26 (=        26)  w =          1  x =         10  y =         10  z =        117
Instruction Nr.  59  =  OpCode add  A x (=        10)  B  -6 (=        -6)  w =          1  x =          4  y =         10  z =        117
Instruction Nr.  60  =  OpCode eql  A x (=         4)  B   w (=         1)  w =          1  x =          0  y =         10  z =        117
Instruction Nr.  61  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =         10  z =        117
Instruction Nr.  62  =  OpCode mul  A y (=        10)  B   0 (=         0)  w =          1  x =          1  y =          0  z =        117
Instruction Nr.  63  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =        117
Instruction Nr.  64  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =        117
Instruction Nr.  65  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =        117
Instruction Nr.  66  =  OpCode mul  A z (=       117)  B   y (=        26)  w =          1  x =          1  y =         26  z =       3042
Instruction Nr.  67  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =       3042
Instruction Nr.  68  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =       3042
Instruction Nr.  69  =  OpCode add  A y (=         1)  B  12 (=        12)  w =          1  x =          1  y =         13  z =       3042
Instruction Nr.  70  =  OpCode mul  A y (=        13)  B   x (=         1)  w =          1  x =          1  y =         13  z =       3042
Instruction Nr.  71  =  OpCode add  A z (=      3042)  B   y (=        13)  w =          1  x =          1  y =         13  z =       3055
Instruction Nr.  72  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =         13  z =       3055
Instruction Nr.  73  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =         13  z =       3055
Instruction Nr.  74  =  OpCode add  A x (=         0)  B   z (=      3055)  w =          1  x =       3055  y =         13  z =       3055
Instruction Nr.  75  =  OpCode mod  A x (=      3055)  B  26 (=        26)  w =          1  x =         13  y =         13  z =       3055
Instruction Nr.  76  =  OpCode div  A z (=      3055)  B   1 (=         1)  w =          1  x =         13  y =         13  z =       3055
Instruction Nr.  77  =  OpCode add  A x (=        13)  B  15 (=        15)  w =          1  x =         28  y =         13  z =       3055
Instruction Nr.  78  =  OpCode eql  A x (=        28)  B   w (=         1)  w =          1  x =          0  y =         13  z =       3055
Instruction Nr.  79  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =         13  z =       3055
Instruction Nr.  80  =  OpCode mul  A y (=        13)  B   0 (=         0)  w =          1  x =          1  y =          0  z =       3055
Instruction Nr.  81  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr.  82  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr.  83  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =       3055
Instruction Nr.  84  =  OpCode mul  A z (=      3055)  B   y (=        26)  w =          1  x =          1  y =         26  z =      79430
Instruction Nr.  85  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =      79430
Instruction Nr.  86  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =      79430
Instruction Nr.  87  =  OpCode add  A y (=         1)  B   2 (=         2)  w =          1  x =          1  y =          3  z =      79430
Instruction Nr.  88  =  OpCode mul  A y (=         3)  B   x (=         1)  w =          1  x =          1  y =          3  z =      79430
Instruction Nr.  89  =  OpCode add  A z (=     79430)  B   y (=         3)  w =          1  x =          1  y =          3  z =      79433
Instruction Nr.  90  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          3  z =      79433
Instruction Nr.  91  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          3  z =      79433
Instruction Nr.  92  =  OpCode add  A x (=         0)  B   z (=     79433)  w =          1  x =      79433  y =          3  z =      79433
Instruction Nr.  93  =  OpCode mod  A x (=     79433)  B  26 (=        26)  w =          1  x =          3  y =          3  z =      79433
Instruction Nr.  94  =  OpCode div  A z (=     79433)  B  26 (=        26)  w =          1  x =          3  y =          3  z =       3055
Instruction Nr.  95  =  OpCode add  A x (=         3)  B  -8 (=        -8)  w =          1  x =         -5  y =          3  z =       3055
Instruction Nr.  96  =  OpCode eql  A x (=        -5)  B   w (=         1)  w =          1  x =          0  y =          3  z =       3055
Instruction Nr.  97  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          3  z =       3055
Instruction Nr.  98  =  OpCode mul  A y (=         3)  B   0 (=         0)  w =          1  x =          1  y =          0  z =       3055
Instruction Nr.  99  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr. 100  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr. 101  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =       3055
Instruction Nr. 102  =  OpCode mul  A z (=      3055)  B   y (=        26)  w =          1  x =          1  y =         26  z =      79430
Instruction Nr. 103  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =      79430
Instruction Nr. 104  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =      79430
Instruction Nr. 105  =  OpCode add  A y (=         1)  B   1 (=         1)  w =          1  x =          1  y =          2  z =      79430
Instruction Nr. 106  =  OpCode mul  A y (=         2)  B   x (=         1)  w =          1  x =          1  y =          2  z =      79430
Instruction Nr. 107  =  OpCode add  A z (=     79430)  B   y (=         2)  w =          1  x =          1  y =          2  z =      79432
Instruction Nr. 108  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          2  z =      79432
Instruction Nr. 109  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          2  z =      79432
Instruction Nr. 110  =  OpCode add  A x (=         0)  B   z (=     79432)  w =          1  x =      79432  y =          2  z =      79432
Instruction Nr. 111  =  OpCode mod  A x (=     79432)  B  26 (=        26)  w =          1  x =          2  y =          2  z =      79432
Instruction Nr. 112  =  OpCode div  A z (=     79432)  B  26 (=        26)  w =          1  x =          2  y =          2  z =       3055
Instruction Nr. 113  =  OpCode add  A x (=         2)  B  -4 (=        -4)  w =          1  x =         -2  y =          2  z =       3055
Instruction Nr. 114  =  OpCode eql  A x (=        -2)  B   w (=         1)  w =          1  x =          0  y =          2  z =       3055
Instruction Nr. 115  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          2  z =       3055
Instruction Nr. 116  =  OpCode mul  A y (=         2)  B   0 (=         0)  w =          1  x =          1  y =          0  z =       3055
Instruction Nr. 117  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr. 118  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =       3055
Instruction Nr. 119  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =       3055
Instruction Nr. 120  =  OpCode mul  A z (=      3055)  B   y (=        26)  w =          1  x =          1  y =         26  z =      79430
Instruction Nr. 121  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =      79430
Instruction Nr. 122  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =      79430
Instruction Nr. 123  =  OpCode add  A y (=         1)  B   1 (=         1)  w =          1  x =          1  y =          2  z =      79430
Instruction Nr. 124  =  OpCode mul  A y (=         2)  B   x (=         1)  w =          1  x =          1  y =          2  z =      79430
Instruction Nr. 125  =  OpCode add  A z (=     79430)  B   y (=         2)  w =          1  x =          1  y =          2  z =      79432
Instruction Nr. 126  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          2  z =      79432
Instruction Nr. 127  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          2  z =      79432
Instruction Nr. 128  =  OpCode add  A x (=         0)  B   z (=     79432)  w =          1  x =      79432  y =          2  z =      79432
Instruction Nr. 129  =  OpCode mod  A x (=     79432)  B  26 (=        26)  w =          1  x =          2  y =          2  z =      79432
Instruction Nr. 130  =  OpCode div  A z (=     79432)  B   1 (=         1)  w =          1  x =          2  y =          2  z =      79432
Instruction Nr. 131  =  OpCode add  A x (=         2)  B  15 (=        15)  w =          1  x =         17  y =          2  z =      79432
Instruction Nr. 132  =  OpCode eql  A x (=        17)  B   w (=         1)  w =          1  x =          0  y =          2  z =      79432
Instruction Nr. 133  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          2  z =      79432
Instruction Nr. 134  =  OpCode mul  A y (=         2)  B   0 (=         0)  w =          1  x =          1  y =          0  z =      79432
Instruction Nr. 135  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =      79432
Instruction Nr. 136  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =      79432
Instruction Nr. 137  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =      79432
Instruction Nr. 138  =  OpCode mul  A z (=     79432)  B   y (=        26)  w =          1  x =          1  y =         26  z =    2065232
Instruction Nr. 139  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =    2065232
Instruction Nr. 140  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =    2065232
Instruction Nr. 141  =  OpCode add  A y (=         1)  B  13 (=        13)  w =          1  x =          1  y =         14  z =    2065232
Instruction Nr. 142  =  OpCode mul  A y (=        14)  B   x (=         1)  w =          1  x =          1  y =         14  z =    2065232
Instruction Nr. 143  =  OpCode add  A z (=   2065232)  B   y (=        14)  w =          1  x =          1  y =         14  z =    2065246
Instruction Nr. 144  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =         14  z =    2065246
Instruction Nr. 145  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =         14  z =    2065246
Instruction Nr. 146  =  OpCode add  A x (=         0)  B   z (=   2065246)  w =          1  x =    2065246  y =         14  z =    2065246
Instruction Nr. 147  =  OpCode mod  A x (=   2065246)  B  26 (=        26)  w =          1  x =         14  y =         14  z =    2065246
Instruction Nr. 148  =  OpCode div  A z (=   2065246)  B   1 (=         1)  w =          1  x =         14  y =         14  z =    2065246
Instruction Nr. 149  =  OpCode add  A x (=        14)  B  10 (=        10)  w =          1  x =         24  y =         14  z =    2065246
Instruction Nr. 150  =  OpCode eql  A x (=        24)  B   w (=         1)  w =          1  x =          0  y =         14  z =    2065246
Instruction Nr. 151  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =         14  z =    2065246
Instruction Nr. 152  =  OpCode mul  A y (=        14)  B   0 (=         0)  w =          1  x =          1  y =          0  z =    2065246
Instruction Nr. 153  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =    2065246
Instruction Nr. 154  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =    2065246
Instruction Nr. 155  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =    2065246
Instruction Nr. 156  =  OpCode mul  A z (=   2065246)  B   y (=        26)  w =          1  x =          1  y =         26  z =   53696396
Instruction Nr. 157  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z =   53696396
Instruction Nr. 158  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z =   53696396
Instruction Nr. 159  =  OpCode add  A y (=         1)  B   1 (=         1)  w =          1  x =          1  y =          2  z =   53696396
Instruction Nr. 160  =  OpCode mul  A y (=         2)  B   x (=         1)  w =          1  x =          1  y =          2  z =   53696396
Instruction Nr. 161  =  OpCode add  A z (=  53696396)  B   y (=         2)  w =          1  x =          1  y =          2  z =   53696398
Instruction Nr. 162  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          2  z =   53696398
Instruction Nr. 163  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          2  z =   53696398
Instruction Nr. 164  =  OpCode add  A x (=         0)  B   z (=  53696398)  w =          1  x =   53696398  y =          2  z =   53696398
Instruction Nr. 165  =  OpCode mod  A x (=  53696398)  B  26 (=        26)  w =          1  x =          2  y =          2  z =   53696398
Instruction Nr. 166  =  OpCode div  A z (=  53696398)  B   1 (=         1)  w =          1  x =          2  y =          2  z =   53696398
Instruction Nr. 167  =  OpCode add  A x (=         2)  B  11 (=        11)  w =          1  x =         13  y =          2  z =   53696398
Instruction Nr. 168  =  OpCode eql  A x (=        13)  B   w (=         1)  w =          1  x =          0  y =          2  z =   53696398
Instruction Nr. 169  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          2  z =   53696398
Instruction Nr. 170  =  OpCode mul  A y (=         2)  B   0 (=         0)  w =          1  x =          1  y =          0  z =   53696398
Instruction Nr. 171  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 172  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 173  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =   53696398
Instruction Nr. 174  =  OpCode mul  A z (=  53696398)  B   y (=        26)  w =          1  x =          1  y =         26  z = 1396106348
Instruction Nr. 175  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z = 1396106348
Instruction Nr. 176  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z = 1396106348
Instruction Nr. 177  =  OpCode add  A y (=         1)  B   6 (=         6)  w =          1  x =          1  y =          7  z = 1396106348
Instruction Nr. 178  =  OpCode mul  A y (=         7)  B   x (=         1)  w =          1  x =          1  y =          7  z = 1396106348
Instruction Nr. 179  =  OpCode add  A z (=1396106348)  B   y (=         7)  w =          1  x =          1  y =          7  z = 1396106355
Instruction Nr. 180  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          7  z = 1396106355
Instruction Nr. 181  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          7  z = 1396106355
Instruction Nr. 182  =  OpCode add  A x (=         0)  B   z (=1396106355)  w =          1  x = 1396106355  y =          7  z = 1396106355
Instruction Nr. 183  =  OpCode mod  A x (=1396106355)  B  26 (=        26)  w =          1  x =          7  y =          7  z = 1396106355
Instruction Nr. 184  =  OpCode div  A z (=1396106355)  B  26 (=        26)  w =          1  x =          7  y =          7  z =   53696398
Instruction Nr. 185  =  OpCode add  A x (=         7)  B -11 (=       -11)  w =          1  x =         -4  y =          7  z =   53696398
Instruction Nr. 186  =  OpCode eql  A x (=        -4)  B   w (=         1)  w =          1  x =          0  y =          7  z =   53696398
Instruction Nr. 187  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          7  z =   53696398
Instruction Nr. 188  =  OpCode mul  A y (=         7)  B   0 (=         0)  w =          1  x =          1  y =          0  z =   53696398
Instruction Nr. 189  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 190  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 191  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =   53696398
Instruction Nr. 192  =  OpCode mul  A z (=  53696398)  B   y (=        26)  w =          1  x =          1  y =         26  z = 1396106348
Instruction Nr. 193  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z = 1396106348
Instruction Nr. 194  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z = 1396106348
Instruction Nr. 195  =  OpCode add  A y (=         1)  B   2 (=         2)  w =          1  x =          1  y =          3  z = 1396106348
Instruction Nr. 196  =  OpCode mul  A y (=         3)  B   x (=         1)  w =          1  x =          1  y =          3  z = 1396106348
Instruction Nr. 197  =  OpCode add  A z (=1396106348)  B   y (=         3)  w =          1  x =          1  y =          3  z = 1396106351
Instruction Nr. 198  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =          3  z = 1396106351
Instruction Nr. 199  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =          3  z = 1396106351
Instruction Nr. 200  =  OpCode add  A x (=         0)  B   z (=1396106351)  w =          1  x = 1396106351  y =          3  z = 1396106351
Instruction Nr. 201  =  OpCode mod  A x (=1396106351)  B  26 (=        26)  w =          1  x =          3  y =          3  z = 1396106351
Instruction Nr. 202  =  OpCode div  A z (=1396106351)  B  26 (=        26)  w =          1  x =          3  y =          3  z =   53696398
Instruction Nr. 203  =  OpCode add  A x (=         3)  B   0 (=         0)  w =          1  x =          3  y =          3  z =   53696398
Instruction Nr. 204  =  OpCode eql  A x (=         3)  B   w (=         1)  w =          1  x =          0  y =          3  z =   53696398
Instruction Nr. 205  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =          3  z =   53696398
Instruction Nr. 206  =  OpCode mul  A y (=         3)  B   0 (=         0)  w =          1  x =          1  y =          0  z =   53696398
Instruction Nr. 207  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 208  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 209  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =   53696398
Instruction Nr. 210  =  OpCode mul  A z (=  53696398)  B   y (=        26)  w =          1  x =          1  y =         26  z = 1396106348
Instruction Nr. 211  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z = 1396106348
Instruction Nr. 212  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z = 1396106348
Instruction Nr. 213  =  OpCode add  A y (=         1)  B  11 (=        11)  w =          1  x =          1  y =         12  z = 1396106348
Instruction Nr. 214  =  OpCode mul  A y (=        12)  B   x (=         1)  w =          1  x =          1  y =         12  z = 1396106348
Instruction Nr. 215  =  OpCode add  A z (=1396106348)  B   y (=        12)  w =          1  x =          1  y =         12  z = 1396106360
Instruction Nr. 216  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          1  x =          1  y =         12  z = 1396106360
Instruction Nr. 217  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          1  x =          0  y =         12  z = 1396106360
Instruction Nr. 218  =  OpCode add  A x (=         0)  B   z (=1396106360)  w =          1  x = 1396106360  y =         12  z = 1396106360
Instruction Nr. 219  =  OpCode mod  A x (=1396106360)  B  26 (=        26)  w =          1  x =         12  y =         12  z = 1396106360
Instruction Nr. 220  =  OpCode div  A z (=1396106360)  B  26 (=        26)  w =          1  x =         12  y =         12  z =   53696398
Instruction Nr. 221  =  OpCode add  A x (=        12)  B  -8 (=        -8)  w =          1  x =          4  y =         12  z =   53696398
Instruction Nr. 222  =  OpCode eql  A x (=         4)  B   w (=         1)  w =          1  x =          0  y =         12  z =   53696398
Instruction Nr. 223  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          1  x =          1  y =         12  z =   53696398
Instruction Nr. 224  =  OpCode mul  A y (=        12)  B   0 (=         0)  w =          1  x =          1  y =          0  z =   53696398
Instruction Nr. 225  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 226  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          1  x =          1  y =         25  z =   53696398
Instruction Nr. 227  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          1  x =          1  y =         26  z =   53696398
Instruction Nr. 228  =  OpCode mul  A z (=  53696398)  B   y (=        26)  w =          1  x =          1  y =         26  z = 1396106348
Instruction Nr. 229  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          1  x =          1  y =          0  z = 1396106348
Instruction Nr. 230  =  OpCode add  A y (=         0)  B   w (=         1)  w =          1  x =          1  y =          1  z = 1396106348
Instruction Nr. 231  =  OpCode add  A y (=         1)  B  10 (=        10)  w =          1  x =          1  y =         11  z = 1396106348
Instruction Nr. 232  =  OpCode mul  A y (=        11)  B   x (=         1)  w =          1  x =          1  y =         11  z = 1396106348
Instruction Nr. 233  =  OpCode add  A z (=1396106348)  B   y (=        11)  w =          1  x =          1  y =         11  z = 1396106359
Instruction Nr. 234  =  OpCode inp  A w (=         1)  B   - (=         0)  w =          0  x =          1  y =         11  z = 1396106359
Instruction Nr. 235  =  OpCode mul  A x (=         1)  B   0 (=         0)  w =          0  x =          0  y =         11  z = 1396106359
Instruction Nr. 236  =  OpCode add  A x (=         0)  B   z (=1396106359)  w =          0  x = 1396106359  y =         11  z = 1396106359
Instruction Nr. 237  =  OpCode mod  A x (=1396106359)  B  26 (=        26)  w =          0  x =         11  y =         11  z = 1396106359
Instruction Nr. 238  =  OpCode div  A z (=1396106359)  B  26 (=        26)  w =          0  x =         11  y =         11  z =   53696398
Instruction Nr. 239  =  OpCode add  A x (=        11)  B  -7 (=        -7)  w =          0  x =          4  y =         11  z =   53696398
Instruction Nr. 240  =  OpCode eql  A x (=         4)  B   w (=         0)  w =          0  x =          0  y =         11  z =   53696398
Instruction Nr. 241  =  OpCode eql  A x (=         0)  B   0 (=         0)  w =          0  x =          1  y =         11  z =   53696398
Instruction Nr. 242  =  OpCode mul  A y (=        11)  B   0 (=         0)  w =          0  x =          1  y =          0  z =   53696398
Instruction Nr. 243  =  OpCode add  A y (=         0)  B  25 (=        25)  w =          0  x =          1  y =         25  z =   53696398
Instruction Nr. 244  =  OpCode mul  A y (=        25)  B   x (=         1)  w =          0  x =          1  y =         25  z =   53696398
Instruction Nr. 245  =  OpCode add  A y (=        25)  B   1 (=         1)  w =          0  x =          1  y =         26  z =   53696398
Instruction Nr. 246  =  OpCode mul  A z (=  53696398)  B   y (=        26)  w =          0  x =          1  y =         26  z = 1396106348
Instruction Nr. 247  =  OpCode mul  A y (=        26)  B   0 (=         0)  w =          0  x =          1  y =          0  z = 1396106348
Instruction Nr. 248  =  OpCode add  A y (=         0)  B   w (=         0)  w =          0  x =          1  y =          0  z = 1396106348
Instruction Nr. 249  =  OpCode add  A y (=         0)  B   3 (=         3)  w =          0  x =          1  y =          3  z = 1396106348
Instruction Nr. 250  =  OpCode mul  A y (=         3)  B   x (=         1)  w =          0  x =          1  y =          3  z = 1396106348
Instruction Nr. 251  =  OpCode add  A z (=1396106348)  B   y (=         3)  w =          0  x =          1  y =          3  z = 1396106351
Round      0  Model Nr 11111111111110  CheckSum       1396106351
Round      1  Model Nr 11111111111109  CheckSum       1396106360
Round      2  Model Nr 11111111111108  CheckSum       1396106359
Round      3  Model Nr 11111111111107  CheckSum       1396106358
Round      4  Model Nr 11111111111106  CheckSum       1396106357
Round      5  Model Nr 11111111111105  CheckSum       1396106356
Round      6  Model Nr 11111111111104  CheckSum       1396106355
Round      7  Model Nr 11111111111103  CheckSum         53696398
Round      8  Model Nr 11111111111102  CheckSum       1396106353
Round      9  Model Nr 11111111111101  CheckSum       1396106352

Result Part 1 = 0




*/



