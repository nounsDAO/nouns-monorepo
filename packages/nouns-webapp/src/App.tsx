import { useEffect } from 'react';
import './App.css';
import { useEthers } from '@usedapp/core';
import NavBar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppDispatch } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { Router, Switch, Route,  } from 'react-router-dom';
import OpenSeaItem from './layout/OpenSeaItem';
import { createBrowserHistory } from 'history';
import CurrentAuction from './components/CurrentAuction';

function App() {
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const history = createBrowserHistory();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account]);

  return (
    <div className="App">
      <NavBar />
      <Router history={history}>
        <Switch>
          <Route path="/">
            <CurrentAuction />
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
