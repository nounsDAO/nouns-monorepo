import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import GovernancePage from './pages/Governance';
import CreateProposalPage from './pages/CreateProposal';
import VotePage from './pages/Vote';
import NoundersPage from './pages/Nounders';
import NotFoundPage from './pages/NotFound';
import { CHAIN_ID } from './config';
import VerifyPage from './pages/Verify';

function App() {
  const { account, chainId } = useEthers();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector(state => state.application.alertModal);
  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);

  return (
    <div className={`${classes.wrapper} ${useGreyBg ? classes.greyBg : classes.beigeBg}`}>
      {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )}
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={AuctionPage} />
          <Route
            exact
            path="/noun/:id"
            render={props => <AuctionPage initialAuctionId={Number(props.match.params.id)} />}
          />
          <Route exact path="/nounders" component={NoundersPage} />
          <Route exact path="/sign" component={VerifyPage} />
          <Route exact path="/verify" component={VerifyPage} />
          <Route exact path="/create-proposal" component={CreateProposalPage} />
          <Route exact path="/vote" component={GovernancePage} />
          <Route exact path="/vote/:id" component={VotePage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
