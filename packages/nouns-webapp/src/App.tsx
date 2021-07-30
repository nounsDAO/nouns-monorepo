import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import Auction from './pages/Auction';
import Governance from './pages/Governance';

function App() {
  const { account, chainId } = useEthers();
  const dispatch = useAppDispatch();
  const history = createBrowserHistory();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  return (
    <div className={classes.wrapper}>
      {chainId !== 4 && <NetworkAlert />}
      <NavBar />
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Auction} />
          <Route path="/vote" component={Governance} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
