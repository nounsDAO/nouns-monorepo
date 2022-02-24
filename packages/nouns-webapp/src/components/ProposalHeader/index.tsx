import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import { Proposal, useHasVotedOnProposal, useProposalVote } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';

interface ProposalHeaderProps {
  proposal: Proposal;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  submitButtonClickHandler: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, isActiveForVoting, isWalletConnected, submitButtonClickHandler } = props;

  const isMobile = isMobileScreen();
  // TODO for testing!!
  const connectedAccountNounVotes = 2; //useUserVotes() || 0;
  const hasVoted = useHasVotedOnProposal(proposal?.id);
  const proposalVote = useProposalVote(proposal?.id);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <Link to={'/vote'}>
            <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
          </Link>
          <div className={classes.headerRow}>
            <span>
              <div className="d-flex">
                <div>Proposal {proposal.id}</div>
                <div>
                  <ProposalStatus status={proposal?.status} className={classes.proposalStatus} />
                </div>
              </div>
            </span>
            <div className={classes.proposalTitleWrapper}>
              <div className={classes.proposalTitle}>
                <h1>{proposal.title} </h1>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex justify-content-end align-items-end">
            {!hasVoted && isActiveForVoting && (
              <>
                {!isWalletConnected && (
                  <div className={classes.connectWalletText}>Connect a wallet to vote.</div>
                )}
                {/* {isWalletConnected && connectedAccountNounVotes === 0 && (
                  <div className={classes.noVotesText}>You have no votes.</div>
                )} */}
                <Button
                  className={
                    isWalletConnected && connectedAccountNounVotes > 0
                      ? classes.submitBtn
                      : classes.submitBtnDisabled
                  }
                  onClick={submitButtonClickHandler}
                >
                  Submit vote
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className={classes.mobileSubmitProposalButton}>
        {isMobile && isActiveForVoting && !hasVoted && (
          <>
            {!isWalletConnected && (
              <div className={classes.connectWalletText}>Connect a wallet to vote.</div>
            )}
            {/* {isWalletConnected && connectedAccountNounVotes === 0 && (
              <div className={classes.noVotesText}>You have no votes.</div>
            )} */}
            <Button
              className={
                isWalletConnected && connectedAccountNounVotes > 0
                  ? classes.submitBtn
                  : classes.submitBtnDisabled
              }
              onClick={submitButtonClickHandler}
            >
              Submit vote
            </Button>
          </>
        )}
      </div>

      {proposal && isActiveForVoting && (
        <>
          {hasVoted && (
            <Alert variant="success" className={classes.voterIneligibleAlert}>
              You voted <strong>{proposalVote}</strong> this proposal
            </Alert>
          )}
        </>
      )}
    </>
  );
};

export default ProposalHeader;
