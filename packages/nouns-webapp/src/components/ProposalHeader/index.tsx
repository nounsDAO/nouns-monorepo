import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import { Proposal, useHasVotedOnProposal, useProposalVote } from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import { useBlockTimestamp } from '../../hooks/useBlockTimestamp';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

interface ProposalHeaderProps {
  proposal: Proposal;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  submitButtonClickHandler: () => void;
}

const getTranslatedVoteCopyFromString = (proposalVote: string) => {
  if (proposalVote === 'For') {
    return (
      <Trans>
        You voted <strong>For</strong>this proposal
      </Trans>
    );
  }
  if (proposalVote === 'Against') {
    return (
      <Trans>
        You voted <strong>Against</strong>this proposal
      </Trans>
    );
  }
  return (
    <Trans>
      You <strong>Abstained</strong> from this proposal
    </Trans>
  );
};

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, isActiveForVoting, isWalletConnected, submitButtonClickHandler } = props;

  const isMobile = isMobileScreen();
  const availableVotes = useUserVotesAsOfBlock(proposal?.createdBlock) ?? 0;
  const hasVoted = useHasVotedOnProposal(proposal?.id);
  const proposalVote = useProposalVote(proposal?.id);
  const proposalCreationTimestamp = useBlockTimestamp(proposal?.createdBlock);
  const disableVoteButton = !isWalletConnected || !availableVotes || hasVoted;

  const voteButton = (
    <>
      {isWalletConnected ? (
        <>
          {!availableVotes && (
            <div className={classes.noVotesText}>
              <Trans>You have no votes.</Trans>
            </div>
          )}
        </>
      ) : (
        <div className={classes.connectWalletText}>
          <Trans>Connect a wallet to vote.</Trans>
        </div>
      )}
      <Button
        className={disableVoteButton ? classes.submitBtnDisabled : classes.submitBtn}
        disabled={disableVoteButton}
        onClick={submitButtonClickHandler}
      >
        <Trans>Submit vote</Trans>
      </Button>
    </>
  );

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
                <div>
                  <Trans>Proposal {i18n.number(parseInt(proposal.id || '0'))}</Trans>
                </div>
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
            {isActiveForVoting && voteButton}
          </div>
        )}
      </div>

      {isMobile && (
        <div className={classes.mobileSubmitProposalButton}>{isActiveForVoting && voteButton}</div>
      )}

      {proposal && isActiveForVoting && hasVoted && (
        <Alert variant="success" className={classes.voterIneligibleAlert}>
          {getTranslatedVoteCopyFromString(proposalVote)}
        </Alert>
      )}

      {proposal && isActiveForVoting && proposalCreationTimestamp && !!availableVotes && !hasVoted && (
        <Alert variant="success" className={classes.voterIneligibleAlert}>
          <Trans>
            Only Nouns you owned or were delegated to you before{' '}
            {i18n.date(new Date(proposalCreationTimestamp * 1000), {
              dateStyle: 'long',
              timeStyle: 'long',
            })}{' '}
            are eligible to vote.
          </Trans>
        </Alert>
      )}
    </>
  );
};

export default ProposalHeader;
