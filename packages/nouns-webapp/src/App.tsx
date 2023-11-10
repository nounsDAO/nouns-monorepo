import { useEffect } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { useAppDispatch } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import '../src/css/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
// import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import GovernancePage from './pages/Governance';
// import CreateProposalPage from './pages/CreateProposal';
// import VotePage from './pages/Vote';
import RepPage from './pages/Rep';
import OptimismRepPage from './pages/OptimismRep';
// import ExplorePage from './pages/Explore';
import NotFoundPage from './pages/NotFound';
// import Playground from './pages/Playground';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AvatarProvider } from '@davatar/react';
import dayjs from 'dayjs';
import AuctionPageNew from './pages/AuctionNew';
// import DelegatePage from './pages/DelegatePage';

function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  // const alertModal = useAppSelector(state => state.application.alertModal);

  return (
    <div className={`${classes.wrapper}`}>
      {/* {Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )} */}
      <BrowserRouter>
        <AvatarProvider
          provider={chainId === ChainId.Mainnet ? library : undefined}
          batchLookups={true}
        >
          <NavBar />

          {account ? (
            <>
              <Switch>
                <Route exact path="/" component={AuctionPage} />
                <Route exact path="/auction" component={AuctionPageNew} />
                <Redirect from="/auction/:id" to="/noun/:id" />
                <Route
                  exact
                  path="/noun/:id"
                  render={props => <AuctionPageNew initialAuctionId={Number(props.match.params.id)} />}
                />
                <Route exact path="/rep" component={RepPage} />
                <Route exact path="/vote" component={GovernancePage} />
                <Route exact path="/optimismRep" component={OptimismRepPage} />
                <Route component={NotFoundPage} />
              </Switch>
              <Footer />
            </>
          ) : (
            <div></div>
          )}
        </AvatarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
