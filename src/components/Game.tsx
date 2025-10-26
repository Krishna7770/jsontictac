import React from 'react';
import { Checkbox } from '@mui/material';

/*
        As an example the game board has been separated into it's own file/component called "Game".
        (Teacher comment from TicTacToe.tsx)
*/

// STUDENT NOTE: I moved Game.tsx into src/components/Game.tsx so it's treated like its own screen.
// STUDENT NOTE: I also slightly wrapped props typing and left teacher's alert-based placeholders.

function showError(e : any)
{
        alert("So, then... you got this error. Kind of weird you got this error, actually. \
Kind of interesting to find out WHEN and HOW you got this error actually, because... well... \
could you please write down how to reproduce it right away, because at the moment your teacher wants to know too :-D.");
        console.log(e);
}

function handleMove(j : any)
{
        alert("We'll handle the moves next week, just finalize the sign in and such... \
Then after getting successfully past the login you also need to handle the logout again and THEN \
after having logged in (and out) with all of that logic in fully working order you need to put \
a 'Lobby' in between! At that point, before getting to poke buttons on this thing you actually \
enter the game via the \"Lobby\".");
        console.log(j);
}

function sendMove(mx: number, my: number, c: any)
{
        let obj = { x : mx, y : my};
        fetch(c.serviceroot+c.receiver, { method : "POST", mode : "cors", credentials : "include", 
                                          headers: {'Content-Type': 'text/plain'}, 
                                          body : JSON.stringify(obj) }).
        then( r => r.json() ).then( j => handleMove(j) ).catch( e => showError(e));
}

// STUDENT NOTE: I'm keeping your teacher's style of "grid from sizex/sizey" and mapping to checkboxes.
function Game(props : any)
{
        let rows: any[] = [];
        let config = props.config;
        for (let y = 0; y < props.sizey; y++)
        {
                let cols: any[] = [];
                for (let x = 0; x < props.sizex; x++)
                {
                        cols.push(
                                <td key={"cell"+x+y}>
                                        <Checkbox onClick={() => sendMove(x,y,config)}/>
                                </td>
                        );
                }
                rows.push(<tr key={"row"+y}>{cols}</tr>);
        }
        return(<table><tbody>{rows}</tbody></table>);
}

export default Game;
