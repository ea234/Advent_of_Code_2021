/*
 * --- Day 21: Dirac Dice ---
 * https://adventofcode.com/2021/day/21
 * 
 * https://www.reddit.com/r/adventofcode/comments/rl6p8y/2021_day_21_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day21/day_21__Dirac_Dice.js
 * 
 * Day 21: Dirac Dice
 * 
 * Round     0 Player 1 rolls   1 +   2 +   3  and moves from space   4 to space  10 for a total score of    10.
 * Round     0 Player 2 rolls   4 +   5 +   6  and moves from space   8 to space   3 for a total score of     3.
 * Round     1 Player 1 rolls   7 +   8 +   9  and moves from space  10 to space   4 for a total score of    14.
 * Round     1 Player 2 rolls  10 +  11 +  12  and moves from space   3 to space   6 for a total score of     9.
 * Round     2 Player 1 rolls  13 +  14 +  15  and moves from space   4 to space   6 for a total score of    20.
 * Round     2 Player 2 rolls  16 +  17 +  18  and moves from space   6 to space   7 for a total score of    16.
 * Round     3 Player 1 rolls  19 +  20 +  21  and moves from space   6 to space   6 for a total score of    26.
 * Round     3 Player 2 rolls  22 +  23 +  24  and moves from space   7 to space   6 for a total score of    22.
 * Round     4 Player 1 rolls  25 +  26 +  27  and moves from space   6 to space   4 for a total score of    30.
 * Round     4 Player 2 rolls  28 +  29 +  30  and moves from space   6 to space   3 for a total score of    25.
 * Round     5 Player 1 rolls  31 +  32 +  33  and moves from space   4 to space  10 for a total score of    40.
 * Round     5 Player 2 rolls  34 +  35 +  36  and moves from space   3 to space   8 for a total score of    33.
 * Round     6 Player 1 rolls  37 +  38 +  39  and moves from space  10 to space   4 for a total score of    44.
 * Round     6 Player 2 rolls  40 +  41 +  42  and moves from space   8 to space   1 for a total score of    34.
 * Round     7 Player 1 rolls  43 +  44 +  45  and moves from space   4 to space   6 for a total score of    50.
 * Round     7 Player 2 rolls  46 +  47 +  48  and moves from space   1 to space   2 for a total score of    36.
 * Round     8 Player 1 rolls  49 +  50 +  51  and moves from space   6 to space   6 for a total score of    56.
 * Round     8 Player 2 rolls  52 +  53 +  54  and moves from space   2 to space   1 for a total score of    37.
 * Round     9 Player 1 rolls  55 +  56 +  57  and moves from space   6 to space   4 for a total score of    60.
 * Round     9 Player 2 rolls  58 +  59 +  60  and moves from space   1 to space   8 for a total score of    45.
 * Round    10 Player 1 rolls  61 +  62 +  63  and moves from space   4 to space  10 for a total score of    70.
 * Round    10 Player 2 rolls  64 +  65 +  66  and moves from space   8 to space   3 for a total score of    48.
 * Round    11 Player 1 rolls  67 +  68 +  69  and moves from space  10 to space   4 for a total score of    74.
 * Round    11 Player 2 rolls  70 +  71 +  72  and moves from space   3 to space   6 for a total score of    54.
 * Round    12 Player 1 rolls  73 +  74 +  75  and moves from space   4 to space   6 for a total score of    80.
 * Round    12 Player 2 rolls  76 +  77 +  78  and moves from space   6 to space   7 for a total score of    61.
 * Round    13 Player 1 rolls  79 +  80 +  81  and moves from space   6 to space   6 for a total score of    86.
 * Round    13 Player 2 rolls  82 +  83 +  84  and moves from space   7 to space   6 for a total score of    67.
 * Round    14 Player 1 rolls  85 +  86 +  87  and moves from space   6 to space   4 for a total score of    90.
 * Round    14 Player 2 rolls  88 +  89 +  90  and moves from space   6 to space   3 for a total score of    70.
 * Round    15 Player 1 rolls  91 +  92 +  93  and moves from space   4 to space  10 for a total score of   100.
 * Round    15 Player 2 rolls  94 +  95 +  96  and moves from space   3 to space   8 for a total score of    78.
 * Round    16 Player 1 rolls  97 +  98 +  99  and moves from space  10 to space   4 for a total score of   104.
 * Round    16 Player 2 rolls 100 +   1 +   2  and moves from space   8 to space   1 for a total score of    79.
 * Round    17 Player 1 rolls   3 +   4 +   5  and moves from space   4 to space   6 for a total score of   110.
 * Round    17 Player 2 rolls   6 +   7 +   8  and moves from space   1 to space   2 for a total score of    81.
 * ...
 * Round   162 Player 2 rolls  76 +  77 +  78  and moves from space   6 to space   7 for a total score of   736.
 * Round   163 Player 1 rolls  79 +  80 +  81  and moves from space   6 to space   6 for a total score of   986.
 * Round   163 Player 2 rolls  82 +  83 +  84  and moves from space   7 to space   6 for a total score of   742.
 * Round   164 Player 1 rolls  85 +  86 +  87  and moves from space   6 to space   4 for a total score of   990.
 * Round   164 Player 2 rolls  88 +  89 +  90  and moves from space   6 to space   3 for a total score of   745.
 * Round   165 Player 1 rolls  91 +  92 +  93  and moves from space   4 to space  10 for a total score of  1000.
 * 
 * Player 1 1000 * dice 993 = 993000
 * Player 2 745 * dice 993 = 739785
 * 
 * Rounds played 165
 * 
 * Result Part 1 = 739785  Player 2 looses
 * Result Part 2 = 0
 * 
 * --------------------------------------------------
 * 
 * Player 1 734 * dice 1098 = 805932
 * Player 2 1003 * dice 1098 = 1101294
 * 
 * Rounds played 182
 * 
 * Result Part 1 = 805932  Player 1 looses
 * Result Part 2 = 0
 * 
 * Day 21 - End
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


class DeterministicDice 
{
    cur_number : number = 0;

    count_dice_rolling : number = 0;

    public getCurNumber() : number 
    {
        return this.cur_number;
    }

    public getCountDiceRolling() : number 
    {
        return this.count_dice_rolling;
    }

    public reset() : void 
    {
        this.cur_number         = 0;
        this.count_dice_rolling = 0;
    }

    public getNextNumber() : number 
    {
        this.count_dice_rolling++;

        this.cur_number++;

        if ( this.cur_number === 101 )
        {
            this.cur_number = 1;
        }

        return this.cur_number;
    }
}

class Player
{
    id : number;

    starting_pos : number;

    current_pos : number;

    score : number = 0;

    constructor( pID : number, pStartingPos : number  )
    {
        this.id = pID;

        this.starting_pos = pStartingPos;

        this.current_pos = pStartingPos;
    }

    public getScore() : number 
    {
        return this.score;
    }

    public move( pDice : DeterministicDice, pRoundNr : number, pKnzDebug : boolean) : boolean
    {
        let dice_roll_1 : number = pDice.getNextNumber();

        let dice_roll_2 : number = pDice.getNextNumber();

        let dice_roll_3 : number = pDice.getNextNumber();

        let dice_total : number = dice_roll_1 + dice_roll_2 + dice_roll_3;

        let move_pos : number = dice_total;

        if ( move_pos > 10 )            
        {
            move_pos = dice_total % 10 
        }
        
        let pos_new : number = this.current_pos + move_pos;

        if ( pos_new > 10 )
        {
            pos_new -=  10;
        }

        this.score += pos_new;

        if ( pKnzDebug )
        {
            wl( "Round " + padL( pRoundNr, 5 ) + " Player " + this.id + " rolls " + padL( dice_roll_1, 3 ) + " + " + padL( dice_roll_2, 3 ) + " + " + padL( dice_roll_3, 3 ) + "  and moves from space " + padL( this.current_pos, 3 ) + " to space " + padL( pos_new, 3 ) + " for a total score of  " + padL( this.score, 4 ) + "." );
        }

        this.current_pos = pos_new;

        return this.score >= 1_000;
    }
}


function calcArray( pPlayer1StartingPosition : number, pPlayer2StartingPosition : number, pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Calculating Part 1
     * *******************************************************************************************************
     */
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let dice     : DeterministicDice = new DeterministicDice();

    let player_1 : Player = new Player( 1, pPlayer1StartingPosition );
    let player_2 : Player = new Player( 2, pPlayer2StartingPosition );

    let player_win   : number = 0;
    let player_loose : number = 0;

    let round_nr     : number = 0;
    
    while ( round_nr < 1400 )
    {
        if ( player_1.move( dice, round_nr, pKnzDebug ) ) 
        {
            player_win   = 1;
            player_loose = 2;

            break;
        }

        if ( player_2.move( dice, round_nr, pKnzDebug ) ) 
        {
            player_win   = 2;
            player_loose = 1;

            break;
        }

        round_nr++;
    }

    if ( player_loose === 1 )
    {
        result_part_01 = player_1.getScore() * dice.getCountDiceRolling();
    }
    
    if ( player_loose === 2 )
    {
        result_part_01 = player_2.getScore() * dice.getCountDiceRolling();
    }

    wl( "" );
    wl( "Player 1 " + player_1.getScore() + " * dice " + dice.getCountDiceRolling() + " = " + ( player_1.getScore() * dice.getCountDiceRolling() ) );
    wl( "Player 2 " + player_2.getScore() + " * dice " + dice.getCountDiceRolling() + " = " + ( player_2.getScore() * dice.getCountDiceRolling() ) );
    wl( "" );
    wl( "Rounds played " + round_nr );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 + "  Player " + player_loose + " looses" );
    wl( "Result Part 2 = " + result_part_02 );
}


wl( "" );
wl( "Day 21: Dirac Dice" );
wl( "" );

calcArray( 4, 8, true  );
calcArray( 2, 7, false );

wl( "" )
wl( "Day 21 - End " );
