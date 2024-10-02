import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { setAlertModal } from './state/slices/application';
import classes from './App.module.css';
import '../src/css/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import Footer from './components/Footer';
import AuctionPage from './pages/Auction';
import GovernancePage from './pages/Governance';
import CreateProposalPage from './pages/CreateProposal';
import VotePage from './pages/Vote';
import NotFoundPage from './pages/NotFound';
import { CHAIN_ID } from './config';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AvatarProvider } from '@davatar/react';
import dayjs from 'dayjs';
import DelegatePage from './pages/DelegatePage';
import EditProposalPage from './pages/EditProposal';
import ProposalHistory from './pages/ProposalHistory';

interface AppContentProps {
  chainId: number | undefined;
  alertModal: any; // Replace 'any' with the correct type from your state
  dispatch: any; // Replace 'any' with the correct type from your useAppDispatch
}

function AppContent({ chainId, alertModal, dispatch }: AppContentProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname.includes('/boun/');
  const backgroundColor = isHomePage ? '#3D692F' : 'white';
  const currentPath = location.pathname; // Get the current path

  return (
    <div className={classes.wrapper} style={{ backgroundColor }}>
      {chainId && Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )}
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/" component={AuctionPage} />
          <Redirect from="/auction/:id" to="/boun/:id" />
          <Route
            exact
            path="/boun/:id"
            render={props => <AuctionPage initialAuctionId={Number(props.match.params.id)} />}
          />
          {/* <Route exact path="/nounders" component={NoundersPage} /> */}
          <Route exact path="/create-proposal" component={CreateProposalPage} />
          {/* <Route exact path="/create-candidate" component={CreateCandidatePage} /> */}
          <Route exact path="/vote" component={GovernancePage} />
          <Route exact path="/vote/:id" component={VotePage} />
          <Route exact path="/vote/:id/history" component={ProposalHistory} />
          <Route exact path="/vote/:id/history/:versionNumber?" component={ProposalHistory} />
          <Route exact path="/vote/:id/edit" component={EditProposalPage} />
          {/* <Route exact path="/candidates/:id" component={CandidatePage} /> */}
          {/* <Route exact path="/candidates/:id/edit" component={EditCandidatePage} /> */}
          {/* <Route exact path="/candidates/:id/history" component={CandidateHistoryPage} /> */}
          {/* <Route exact path="/candidates/:id/history/:versionNumber?" component={CandidateHistoryPage} /> */}
          {/* <Route exact path="/playground" component={Playground} /> */}
          <Route exact path="/delegate" component={DelegatePage} />
          {/* <Route exact path="/explore" component={ExplorePage} /> */}
          {/* <Route exact path="/fork/:id" component={ForkPage} /> */}
          {/* <Route exact path="/fork" component={ForksPage} /> */}
          <Route component={NotFoundPage} />
        </Switch>
        <Footer currentPath={currentPath} /> {/* Pass the current path to Footer */}
      </div>
    </div>
  );
}

function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector(state => state.application.alertModal);
  
  return (
    <BrowserRouter>
      <AvatarProvider
        provider={library}
        batchLookups={true}
      >
        <AppContent chainId={chainId} alertModal={alertModal} dispatch={dispatch} />
      </AvatarProvider>
    </BrowserRouter>
  );
}

export default App;
