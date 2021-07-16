import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { BigNumber } from '@usedapp/core/node_modules/ethers';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import OpenSeaItem from './layout/OpenSeaItem';
import CurrentAuction from './components/CurrentAuction/CurrentAuction';
import Banner from './components/Banner';
import HistoryCollection from './components/HistoryCollection';
import Documentation from './components/Documentation';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';

function App() {
  const { account, chainId } = useEthers();
  const dispatch = useAppDispatch();
  const history = createBrowserHistory();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  return (
    <div className="App">
      {chainId !== 4 && <NetworkAlert />}
      <NavBar />
      <Router history={history}>
        <Switch>
          <Route path="/">
            <CurrentAuction />
            <Banner />
            <HistoryCollection
              latestNounId={BigNumber.from(8).sub(1)}
              historyCount={8}
              rtl={true}
            />
            <Documentation />
            <Footer />
          </Route>
          <Route path="/opensea">
            <OpenSeaItem id={1} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
