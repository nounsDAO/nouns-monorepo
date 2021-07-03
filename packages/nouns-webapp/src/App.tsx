import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEthers } from '@usedapp/core';

function App() {
  const { activateBrowserWallet, account } = useEthers();
  return (
    <div className="App">
      <div>
        <button onClick={() => activateBrowserWallet()}>Connect</button>
      </div>
      {account && <p>Account: {account}</p>}
    </div>
  );
}

export default App;
