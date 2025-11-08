import React, { type JSX } from 'react';
import { CircularProgress } from '@mui/material';
import TicTacToe from './TicTacToe';

/*
  This file is the "starter motor": it places a rolling "please wait" circle on the screen,
  requests the settings from the server and once the settings have arrived starts the actual application.
  See how to implement the "please wait" indicator.
*/

// We load config.json from /public/config.json, store it, and then show TicTacToe.
let config: any;
let brancher: React.Dispatch<React.SetStateAction<'init' | 'tictactoe' | 'error'>>;

function setConfig(j: any) {
  config = j;
  brancher('tictactoe');
}

function showError(e: any) {
  console.log('Config load failed:', e);
  brancher('error');
}

function App() {
  // First render triggers fetch just once.
  if (!config) {
    config = {};
    fetch('/config.json', { method: 'GET', mode: 'cors', credentials: 'include' })
      .then((r) => r.json())
      .then((j) => setConfig(j))
      .catch((e) => showError(e));
  }

  const [branch, setBranch] = React.useState<'init' | 'tictactoe' | 'error'>('init');
  brancher = setBranch;

  let ret: JSX.Element;
  switch (branch) {
    case 'init':
      ret = (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </div>
      );
      break;
    case 'tictactoe':
      // pass config + initial view "login"
      ret = <TicTacToe config={config} view="login" />;
      break;
    default:
      ret = <div>We didn&apos;t get a config, check the logs...</div>;
  }
  return ret;
}

export default App;