import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { useBlockNumber } from '@usedapp/core';
import { Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProposalStatus from '../ProposalStatus';
import classes from './ProposalHeader.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import {
  Proposal,
  ProposalVersion,
  useHasVotedOnProposal,
  useIsDaoGteV3,
  useProposalVote,
} from '../../wrappers/nounsDao';
import clsx from 'clsx';
import { isMobileScreen } from '../../utils/isMobile';
import { useUserVotesAsOfBlock } from '../../wrappers/nounToken';
import { useBlockTimestamp } from '../../hooks/useBlockTimestamp';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { transactionIconLink } from '../ProposalContent';
import ShortAddress from '../ShortAddress';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { Locales } from '../../i18n/locales';
import HoverCard from '../HoverCard';
import ByLineHoverCard from '../ByLineHoverCard';
import { relativeTimestamp } from '../../utils/timeUtils';

interface ProposalHeaderProps {
  title?: string;
  proposal: Proposal;
  proposalVersions?: ProposalVersion[];
  versionNumber?: number;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  isObjectionPeriod?: boolean;
  submitButtonClickHandler: () => void;
}

const getTranslatedVoteCopyFromString = (proposalVote: string) => {
  if (proposalVote === 'For') {
    return (
      <Trans>
        You voted <strong>For</strong> this proposal
      </Trans>
    );
  }
  if (proposalVote === 'Against') {
    return (
      <Trans>
        You voted <strong>Against</strong> this proposal
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
  const { proposal, isActiveForVoting, isWalletConnected, title, submitButtonClickHandler } = props;
  const [updatedTimestamp, setUpdatedTimestamp] = React.useState<number | null>(null);
  const [createdTimestamp, setCreatedTimestamp] = React.useState<number | null>(null);
  const isMobile = isMobileScreen();
  const currentBlock = useBlockNumber();
  const currentOrSnapshotBlock = useMemo(() =>
    Math.min(proposal?.voteSnapshotBlock, (currentBlock ? currentBlock - 1 : 0)) || undefined,
    [proposal, currentBlock]
  );
  const availableVotes = useUserVotesAsOfBlock(currentOrSnapshotBlock) ?? 0;
  const hasVoted = useHasVotedOnProposal(proposal?.id);
  const proposalVote = useProposalVote(proposal?.id);
  const proposalCreationTimestamp = useBlockTimestamp(proposal?.createdBlock);
  const disableVoteButton = !isWalletConnected || !availableVotes || hasVoted;
  const activeLocale = useActiveLocale();
  const hasManyVersions = props.proposalVersions && props.proposalVersions.length > 1;
  const isDaoGteV3 = useIsDaoGteV3();
  useEffect(() => {
    if (hasManyVersions) {
      const latestProposalVersion = props.proposalVersions?.[props.proposalVersions.length - 1];
      latestProposalVersion && setUpdatedTimestamp(+latestProposalVersion.createdAt);
    } else {
      setCreatedTimestamp(props.proposal.createdTimestamp);
    }
  }, [currentBlock, hasManyVersions, props.proposalVersions, props.proposal]);

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

  const proposer = (
    <a
      href={buildEtherscanAddressLink(proposal.proposer || '')}
      target="_blank"
      rel="noreferrer"
      className={classes.proposerLinkJp}
    >
      <ShortAddress address={proposal.proposer || ''} avatar={false} />
    </a>
  );

  const sponsorLink = (sponsor: string) => {
    return (
      <a
        href={buildEtherscanAddressLink(sponsor)}
        target="_blank"
        rel="noreferrer"
        className={classes.proposerLinkJp}
      >
        <ShortAddress address={sponsor} avatar={false} />
      </a>
    );
  };
  const transactionLink = transactionIconLink(proposal.transactionHash);

  return (
    <>
      <div className={classes.backButtonWrapper}>
        <Link to={'/vote'}>
          <button className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}>←</button>
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <div className={classes.headerRow}>
            <span>
              <div className="d-flex">
                <div>
                  <Trans>Proposal {i18n.number(parseInt(proposal.id || '0'))}</Trans>
                </div>
                <div>
                  <ProposalStatus
                    status={proposal?.status}
                    className={classes.proposalStatus}
                  />
                </div>
              </div>
            </span>
            <div className={classes.proposalTitleWrapper}>
              <div className={classes.proposalTitle}>
                <h1>{title ? title : proposal.title} </h1>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex justify-content-end align-items-end">
            {isActiveForVoting && !props.isObjectionPeriod && voteButton}
          </div>
        )}
      </div>

      <div className={classes.byLineWrapper}>
        {activeLocale === Locales.ja_JP ? (
          <>
            <HoverCard
              hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
              tip={proposal && proposal.proposer ? proposal.proposer : ''}
              id="byLineHoverCard"
            >
              <div className={classes.proposalByLineWrapperJp}>
                <Trans>
                  <span className={classes.proposedByJp}>Proposed by: </span>
                  <span className={classes.proposerJp}>{proposer}</span>
                  <span className={classes.linkIcon}>{transactionLink}</span>
                </Trans>
              </div>
            </HoverCard>
            {props.proposal.signers.length > 0 && (
              <div className={classes.proposalSponsors}>
                <h3>
                  <span className={classes.proposedByJp}>
                    <Trans>Sponsored by</Trans>
                  </span>
                </h3>{' '}
                {props.proposal.signers.map((signer: { id: string }, i: number) => {
                  return (
                    <>
                      <HoverCard
                        hoverCardContent={(tip: string) => (
                          <ByLineHoverCard proposerAddress={tip} />
                        )}
                        tip={signer.id ? signer.id : ''}
                        id="byLineHoverCard"
                      >
                        <h3>{sponsorLink(signer.id)}</h3>
                      </HoverCard>
                    </>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <h3>Proposed by</h3>
            <div className={classes.byLineContentWrapper}>
              <HoverCard
                hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
                tip={proposal && proposal.proposer ? proposal.proposer : ''}
                id="byLineHoverCard"
              >
                <h3>{proposer}</h3>
              </HoverCard>
            </div>
            <span className={classes.linkIcon}>{transactionLink}</span>

            {props.proposal.signers.length > 0 && (
              <div className={classes.proposalSponsors}>
                <h3>
                  <span className={classes.proposedByJp}>Sponsored by</span>
                </h3>{' '}
                {props.proposal.signers.map((signer: { id: string }, i: number) => {
                  return (
                    <>
                      <HoverCard
                        hoverCardContent={(tip: string) => (
                          <ByLineHoverCard proposerAddress={tip} />
                        )}
                        tip={signer.id ? signer.id : ''}
                        id="byLineHoverCard"
                      >
                        <h3>{sponsorLink(signer.id)}</h3>
                      </HoverCard>
                    </>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      {isDaoGteV3 && (
        <p className={classes.versionHistory}>
          {hasManyVersions ? (
            <Link to={`/vote/${proposal.id}/history/`}>
              <strong>Version {hasManyVersions ? props.versionNumber : '1'}</strong>{' '}
              <span>updated {updatedTimestamp && relativeTimestamp(updatedTimestamp)}</span>
            </Link>
          ) : (
            <>
              <strong>Version {hasManyVersions ? props.versionNumber : '1'}</strong>{' '}
              <span>created {createdTimestamp && relativeTimestamp(createdTimestamp)}</span>
            </>
          )}
        </p>
      )}

      {isMobile && (
        <div className={classes.mobileSubmitProposalButton}>
          {isActiveForVoting && !props.isObjectionPeriod && voteButton}
        </div>
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
