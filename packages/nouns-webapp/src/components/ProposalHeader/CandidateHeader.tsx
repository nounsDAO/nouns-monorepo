import React from 'react';
import { useBlockNumber } from '@usedapp/core';
import { Link } from 'react-router-dom';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import { Trans } from '@lingui/macro';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { transactionIconLink } from '../ProposalContent';
import ShortAddress from '../ShortAddress';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { Locales } from '../../i18n/locales';
import HoverCard from '../HoverCard';
import ByLineHoverCard from '../ByLineHoverCard';
import { relativeTimestamp } from '../../utils/timeUtils';

interface CandidateHeaderProps {
  title: string;
  id: string;
  proposer: string;
  versionsCount: number;
  createdTransactionHash: string;
  lastUpdatedTimestamp: number;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  isCandidate?: boolean;
  isUpdateToProposal?: boolean;
  submitButtonClickHandler: () => void;
}

const CandidateHeader: React.FC<CandidateHeaderProps> = props => {
  const {
    title,
    id,
    proposer,
    versionsCount,
    createdTransactionHash,
    lastUpdatedTimestamp,
    isActiveForVoting,
    isWalletConnected,
    isUpdateToProposal,
  } = props;
  const isMobile = isMobileScreen();
  const currentBlock = useBlockNumber();
  const availableVotes = useUserVotesAsOfBlock(currentBlock) ?? 0;
  const activeLocale = useActiveLocale();

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
    </>
  );

  const proposerLink = (
    <a
      href={buildEtherscanAddressLink(proposer || '')}
      target="_blank"
      rel="noreferrer"
      className={classes.proposerLinkJp}
    >
      <ShortAddress address={proposer || ''} avatar={false} />
    </a>
  );

  const subHead = <>{isUpdateToProposal ? <strong>Update</strong> : ''} Proposal Candidate</>;
  const transactionLink = transactionIconLink(createdTransactionHash);
  return (
    <>
      <div className={classes.backButtonWrapper}>
        <Link to={props.isCandidate ? '/vote#candidates' : '/vote'}>
          <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <div className={classes.headerRow}>
            <span>
              <div className="d-flex">
                <div>{subHead}</div>
              </div>
            </span>
            <div className={classes.proposalTitleWrapper}>
              <div className={classes.proposalTitle}>
                <h1>{title} </h1>
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

      <div className={classes.byLineWrapper}>
        {activeLocale === Locales.ja_JP ? (
          <HoverCard
            hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
            tip={proposer || ''}
            id="byLineHoverCard"
          >
            <div className={classes.proposalByLineWrapperJp}>
              <Trans>
                <span className={classes.proposedByJp}>Proposed by: </span>
                <span className={classes.proposerJp}>{proposerLink}</span>
                {transactionLink}
              </Trans>
            </div>
          </HoverCard>
        ) : (
          <>
            <h3>Proposed by</h3>

            <div className={classes.byLineContentWrapper}>
              <HoverCard
                hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
                tip={proposer || ''}
                id="byLineHoverCard"
              >
                <h3>
                  {proposerLink}
                  {transactionLink}
                </h3>
              </HoverCard>
            </div>
          </>
        )}
      </div>

      <p className={classes.versionHistory}>
        {versionsCount > 1 ? (
          <Link to={`/candidates/${id}/history/`}>
            <strong>Version {versionsCount}</strong>{' '}
            <span>
              {versionsCount === 1 ? 'created' : 'updated'}{' '}
              {relativeTimestamp(lastUpdatedTimestamp)}
            </span>
          </Link>
        ) : (
          <>
            <strong>Version {versionsCount}</strong>{' '}
            <span>
              {versionsCount === 1 ? 'created' : 'updated'}{' '}
              {relativeTimestamp(lastUpdatedTimestamp)}
            </span>
          </>
        )}
      </p>

      {isMobile && (
        <div className={classes.mobileSubmitProposalButton}>{isActiveForVoting && voteButton}</div>
      )}
    </>
  );
};

export default CandidateHeader;
