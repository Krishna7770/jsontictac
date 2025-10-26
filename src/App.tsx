import React, { type JSX } from 'react';
import { CircularProgress } from '@mui/material';
import TicTacToe from './TicTacToe';

/*
        This file is the "starter motor": It places a rolling "please wait" circle on the screen, requests the
        settings from the server and once the settings have arrived starts the actual application.
        See how to implement the "please wait" indicator. This is one of the many ways to do it. It is a practical
        requirement to a lot of apps.
        ...unfortunately, in the case of this app the circle will probably not be visible for more than an eyeblink
        (if that...) you can naturally try it by commenting out the fetch :-).
*/

// STUDENT NOTE: In Vite, we still do the same pattern as teacher showed.
// We load config.json from /public/config.json, store it, and then show TicTacToe.

let config : any;
let brancher : React.Dispatch<React.SetStateAction<string>>;

function setConfig(j : any)
{
        config = j;
        brancher("tictactoe");
}

function showError(e : any)
{
        console.log("Config load failed:", e);
        brancher("error");
}

function App()
{
        if (!config)
        {
                // STUDENT NOTE: first render triggers fetch just once.
                config = {};
                fetch("/config.json", { method : "GET", mode : "cors", credentials : "include" })
                .then( r => r.json() )
                .then( j => setConfig(j) )
                .catch( e => showError(e));
        }

        const [branch, setBranch] = React.useState("init");
        brancher = setBranch;

        let ret : JSX.Element;
        switch (branch)
        {
                case "init":
                        ret = <CircularProgress key="spin" />;
                        break;
                case "tictactoe":
                        // STUDENT NOTE: pass config + initial view "login"
                        ret = <TicTacToe key="done" config={config} view="login"/>;
                        break;
                default:
                        ret = <div key="err">We didn't get a config, check the logs...</div>;
        }
        return ret;
}

export default App;