import React from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Link } from 'react-router';

import ShortAddress from '@/components/ShortAddress';
import { relativeTimestamp } from '@/utils/timeUtils';
import { PartialProposal } from '@/wrappers/nounsDao';
import { ProposalCandidate } from '@/wrappers/nounsData';

import classes from './CandidateCard.module.css';
import CandidateSponsors from './CandidateSponsors';

type CandidateCardProps = {
  candidate: ProposalCandidate;
  nounsRequired: number;
  latestProposal?: PartialProposal;
  currentBlock?: bigint;
};

const CandidateCard: React.FC<Readonly<CandidateCardProps>> = ({
  candidate,
  nounsRequired,
  currentBlock,
}) => {
  const signers = candidate.version.content.contentSignatures;
  const proposerVoteCount = candidate.proposerVotes;

  return (
    <Link
      className={clsx(classes.candidateLink, classes.candidateLinkWithCountdown)}
      to={`/candidates/${candidate.id}`}
    >
      <div className={classes.title}>
        <span className={classes.candidateTitle}>
          <span>{candidate.version.content.title}</span>
        </span>
        <p className={classes.proposer}>
          by{' '}
          <span className={classes.proposerAddress}>
            <ShortAddress address={candidate.proposer || ''} avatar={false} />
          </span>
        </p>

        <div className={classes.footer}>
          <div className={classes.candidateSponsors}>
            <CandidateSponsors
              signers={signers}
              nounsRequired={candidate.requiredVotes}
              currentBlock={currentBlock && currentBlock - 1n}
              isThresholdMetByProposer={
                !!(proposerVoteCount && proposerVoteCount >= candidate.requiredVotes)
              }
            />
            <span
              className={clsx(
                classes.sponsorCount,
                candidate.voteCount - candidate.requiredVotes > 0 && classes.sponsorCountOverflow,
              )}
            >
              <strong>
                {candidate.voteCount} /{' '}
                {candidate.proposerVotes > nounsRequired ? (
                  <em className={classes.naVotesLabel}>n/a</em>
                ) : (
                  candidate.requiredVotes
                )}
              </strong>{' '}
              <Trans>sponsored votes</Trans>
            </span>
          </div>
          <p className={classes.timestamp}>{relativeTimestamp(candidate.lastUpdatedTimestamp)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
