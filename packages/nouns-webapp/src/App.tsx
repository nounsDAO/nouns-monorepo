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
import CurrentAuction from './components/CurrentAuction';
import NounGlasses from './components/NounGlasses/NounGlasses';
import NounBody from './components/NounBody/NounBody';
import { Container } from 'react-bootstrap';

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
      <Container fluid="lg">
        <Router history={history}>
          <Switch>
            <Route path="/">
              <NounGlasses />
              <NounBody />
              {/* <CurrentAuction /> */}
            </Route>
            <Route path="/opensea">
              <OpenSeaItem id={1} />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
