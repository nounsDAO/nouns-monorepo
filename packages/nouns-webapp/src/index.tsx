import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider } from '@usedapp/core';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import logs from './state/slices/logs';
import { ApolloProvider } from '@apollo/client';
import { clientFactory } from './wrappers/subgraph';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID } from './config';
import dotenv from 'dotenv';

dotenv.config();

const store = configureStore({
  reducer: {
    account,
    application,
    logs,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: process.env.REACT_APP_RINKEBY_JSONRPC || `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
    [ChainId.Mainnet]: process.env.REACT_APP_MAINNET_JSONRPC || `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`,
  },
  pollingInterval: 1000
};

const client = clientFactory(config.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Web3ReactProvider
        getLibrary={
          (provider, connector) => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
        }
      >
        <ApolloProvider client={client}>
          <DAppProvider config={useDappConfig}>
            <App />
            <Updaters />
          </DAppProvider>
        </ApolloProvider>
      </Web3ReactProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
