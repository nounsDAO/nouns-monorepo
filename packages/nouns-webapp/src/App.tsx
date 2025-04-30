import { useEffect } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import type { RootState } from './index';
import { setActiveAccount } from './state/slices/account';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router/dom';
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
import NoundersPage from './pages/Nounders';
import ExplorePage from './pages/Explore';
import NotFoundPage from './pages/NotFound';
import Playground from './pages/Playground';
import { CHAIN_ID } from './config';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AvatarProvider } from '@davatar/react';
import dayjs from 'dayjs';
import DelegatePage from './pages/DelegatePage';
import CreateCandidatePage from './pages/CreateCandidate';
import CandidatePage from './pages/Candidate';
import EditProposalPage from './pages/EditProposal';
import EditCandidatePage from './pages/EditCandidate';
import ProposalHistory from './pages/ProposalHistory';
import CandidateHistoryPage from './pages/CandidateHistoryPage';
import ForkPage from './pages/Fork';
import ForksPage from './pages/Forks';

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
      <BrowserRouter
        future={{
          v7_relativeSplatPath  : true,
          v7_startTransition    : true,
        }}
      >
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
            <Route
              path="/candidates/:id/history/:versionNumber"
              element={<CandidateHistoryPage />}
            />
            <Route path="/playground" element={<Playground />} />
            <Route path="/delegate" element={<DelegatePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/fork/:id" element={<ForkPage />} />
            <Route path="/fork" element={<ForksPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </AvatarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
