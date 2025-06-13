import { useEffect } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { useAccount } from 'wagmi';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';

import { Footer } from '@/components/Footer';
import NavBar from '@/components/NavBar';
import NetworkAlert from '@/components/NetworkAlert';
import { Toaster } from '@/components/ui/sonner';
import { CHAIN_ID } from '@/config';
import { useAppDispatch } from '@/hooks';
import AuctionPage from '@/pages/Auction';
import { BrandAssetsPage } from '@/pages/BrandAssets/BrandAssetsPage';
import CandidatePage from '@/pages/Candidate';
import CandidateHistoryPage from '@/pages/CandidateHistoryPage';
import CreateCandidatePage from '@/pages/CreateCandidate';
import CreateProposalPage from '@/pages/CreateProposal';
import DelegatePage from '@/pages/DelegatePage';
import EditCandidatePage from '@/pages/EditCandidate';
import EditProposalPage from '@/pages/EditProposal';
import ExplorePage from '@/pages/ExplorePage';
import ForkPage from '@/pages/Fork';
import ForksPage from '@/pages/Forks';
import GovernancePage from '@/pages/Governance';
import NotFoundPage from '@/pages/NotFound';
import NoundersPage from '@/pages/Nounders';
import Playground from '@/pages/Playground';
import ProposalHistory from '@/pages/ProposalHistory';
import TraitsPage from '@/pages/TraitsPage';
import VotePage from '@/pages/Vote';
import { setActiveAccount } from '@/state/slices/account';

import classes from './App.module.css';

function App() {
  const { address: account, chainId } = useAccount();

  const dispatch = useAppDispatch();
  dayjs.extend(relativeTime);

  useEffect(() => {
    // Local account array updated
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  return (
    <div className={`${classes.wrapper}`}>
      {chainId && Number(CHAIN_ID) !== chainId && <NetworkAlert />}
      <BrowserRouter>
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
          <Route path="/traits" element={<TraitsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/fork/:id" element={<ForkPage />} />
          <Route path="/fork" element={<ForksPage />} />
          <Route path="/brand" element={<BrandAssetsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
        <Toaster
          expand
          closeButton
          toastOptions={{
            classNames: {
              closeButton:
                '[--toast-close-button-start:auto] [--toast-close-button-end:0] [--toast-close-button-transform:translate(35%,-35%)]',
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
