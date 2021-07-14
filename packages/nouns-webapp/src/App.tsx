import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import OpenSeaItem from './layout/OpenSeaItem';
import CurrentAuction from './components/CurrentAuction/CurrentAuction';
import Banner from './components/Banner';

function App() {
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const history = createBrowserHistory();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  return (
    <div className="App">
      <NavBar />
      <Router history={history}>
        <Switch>
          <Route path="/">
            <CurrentAuction />
            <Banner />
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
