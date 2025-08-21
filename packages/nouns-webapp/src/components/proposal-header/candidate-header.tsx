import React from 'react';

import { Trans } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import { useBlockNumber } from 'wagmi';

import ByLineHoverCard from '@/components/by-line-hover-card';
import HoverCard from '@/components/hover-card';
import { transactionIconLink } from '@/components/proposal-content';
import ShortAddress from '@/components/short-address';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { Locales } from '@/i18n/locales';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { isMobileScreen } from '@/utils/is-mobile';
import { relativeTimestamp } from '@/utils/time-utils';
import { useUserVotesAsOfBlock } from '@/wrappers/noun-token';
import { Link } from 'react-router';

import classes from './proposal-header.module.css';

import navBarButtonClasses from '@/components/nav-bar-button/nav-bar-button.module.css';

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
  const { data: currentBlock } = useBlockNumber();
  const availableVotes = useUserVotesAsOfBlock(Number(currentBlock)) ?? 0;
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
      <ShortAddress address={(proposer as `0x${string}`) || '0x'} avatar={false} />
    </a>
  );

  const subHead = (
    <>{isUpdateToProposal === true ? <strong>Update</strong> : ''} Proposal Candidate</>
  );
  const transactionLink = transactionIconLink(createdTransactionHash);
  return (
    <>
      <div className={classes.backButtonWrapper}>
        <Link to={props.isCandidate === true ? '/vote#candidates' : '/vote'}>
          <button type="button" className={cn(classes.backButton, navBarButtonClasses.whiteInfo)}>
            ←
          </button>
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
            {isActiveForVoting === true && voteButton}
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
        <div className={classes.mobileSubmitProposalButton}>
          {isActiveForVoting === true && voteButton}
        </div>
      )}
    </>
  );
};

export default CandidateHeader;
