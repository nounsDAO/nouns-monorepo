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
import auction, {
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import { ApolloProvider } from '@apollo/client';
import { clientFactory } from './wrappers/subgraph';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID } from './config';
import { WebSocketProvider } from '@ethersproject/providers';
import { BigNumberish, Contract } from 'ethers';
import { NounsAuctionHouseABI } from '@nouns/contracts';
import dotenv from 'dotenv';
import { useAppDispatch } from './hooks';
import { appendBid } from './state/slices/auction';
import {Auction as IAuction} from './wrappers/nounsAuction'

dotenv.config();

const store = configureStore({
  reducer: {
    account,
    application,
    auction,
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
};

const client = clientFactory(config.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const BLOCKS_PER_DAY = 6_500;

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();

  const loadState = async () => {
    const wsProvider = new WebSocketProvider(config.wsRpcUri);
    const auctionContract = new Contract(
      config.auctionProxyAddress,
      NounsAuctionHouseABI,
      wsProvider,
    );

    const bidFilter = auctionContract.filters.AuctionBid();
    const extendedFilter = auctionContract.filters.AuctionExtended();
    const createdFilter = auctionContract.filters.AuctionCreated();
    const settledFilter = auctionContract.filters.AuctionSettled();
    const processBidFilter = (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
    ) => {
      dispatch(appendBid({ nounId, sender, value, extended }));
    };
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
    ) => {
      dispatch(setActiveAuction({ nounId, startTime, endTime }));
    };
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      dispatch(setAuctionExtended({ nounId, endTime }));
    };
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      dispatch(setAuctionSettled({ nounId, amount, winner }));
    };

    // Fetch the current auction
    const currentAuction: IAuction = await auctionContract.auction();
    dispatch(setFullAuction(currentAuction))
    
    // Fetch the previous 24hours of  bids
    const previousBids = await auctionContract
      .queryFilter(bidFilter, 0 - BLOCKS_PER_DAY)
    for (let event of previousBids) {
      if (event.args === undefined) return;
      //@ts-ignore
      processBidFilter(...event.args)
    }

    auctionContract.on(bidFilter, processBidFilter);
    auctionContract.on(createdFilter, processAuctionCreated);
    auctionContract.on(extendedFilter, processAuctionExtended);
    auctionContract.on(settledFilter, processAuctionSettled);
  };
  loadState();

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ChainSubscriber />
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
