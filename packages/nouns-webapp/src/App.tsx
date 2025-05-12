import { AvatarProvider } from '@davatar/react';
import { ChainId, useEthers } from '@usedapp/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import '../src/css/globals.css';
import classes from './App.module.css';
import Footer from './components/Footer';
import AlertModal from './components/Modal';
import NavBar from './components/NavBar';
import NetworkAlert from './components/NetworkAlert';
import { CHAIN_ID } from './config';
import { useAppDispatch, useAppSelector } from './hooks';
import type { RootState } from './index';
import AuctionPage from './pages/Auction';
import CandidatePage from './pages/Candidate';
import CandidateHistoryPage from './pages/CandidateHistoryPage';
import CreateCandidatePage from './pages/CreateCandidate';
import CreateProposalPage from './pages/CreateProposal';
import DelegatePage from './pages/DelegatePage';
import EditCandidatePage from './pages/EditCandidate';
import EditProposalPage from './pages/EditProposal';
import ExplorePage from './pages/Explore';
import ForkPage from './pages/Fork';
import ForksPage from './pages/Forks';
import GovernancePage from './pages/Governance';
import NotFoundPage from './pages/NotFound';
import NoundersPage from './pages/Nounders';
import Playground from './pages/Playground';
import ProposalHistory from './pages/ProposalHistory';
import VotePage from './pages/Vote';
import { setActiveAccount } from './state/slices/account';
import { setAlertModal } from './state/slices/application';

function App() {
  const { account, chainId, library } = useEthers();
  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  const alertModal = useAppSelector((state: RootState) => state.application.alertModal);

  return (
    <div className={`${classes.wrapper}`}>
      {chainId && Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      {alertModal.show && (
        <AlertModal
          title={alertModal.title}
          content={<p>{alertModal.message}</p>}
          onDismiss={() => dispatch(setAlertModal({ ...alertModal, show: false }))}
        />
      )}
      <AvatarProvider
        provider={chainId === ChainId.Mainnet ? library : undefined}
        batchLookups={true}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<AuctionPage />} />
          <Route path="/auction/:id" element={<Navigate to="/noun/:id" replace />} />
          <Route path="/noun/:id" element={<AuctionPage />} />
          <Route path="/nounders" element={<NoundersPage />} />
          <Route path="/create-proposal" element={<CreateProposalPage />} />
          <Route path="/create-candidate" element={<CreateCandidatePage />} />
          <Route path="/vote" element={<GovernancePage />} />
          <Route path="/vote/:id" element={<VotePage />} />
          <Route path="/vote/:id/history" element={<ProposalHistory />} />
          <Route path="/vote/:id/history/:versionNumber" element={<ProposalHistory />} />
          <Route
            path="/vote/:id/edit"
            element={<EditProposalPage match={{ params: { id: ':id' } }} />}
          />
          <Route path="/candidates/:id" element={<CandidatePage />} />
          <Route
            path="/candidates/:id/edit"
            element={<EditCandidatePage match={{ params: { id: ':id' } }} />}
          />
          <Route path="/candidates/:id/history" element={<CandidateHistoryPage />} />
          <Route path="/candidates/:id/history/:versionNumber" element={<CandidateHistoryPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/delegate" element={<DelegatePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/fork/:id" element={<ForkPage />} />
          <Route path="/fork" element={<ForksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </AvatarProvider>
    </div>
  );
}

export default App;
