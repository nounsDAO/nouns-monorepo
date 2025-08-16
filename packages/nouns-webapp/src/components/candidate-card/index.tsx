import React from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import Link from 'next/link';

import ShortAddress from '@/components/short-address';
import { relativeTimestamp } from '@/utils/time-utils';
import { PartialProposal } from '@/wrappers/nouns-dao';
import { ProposalCandidate } from '@/wrappers/nouns-data';

import classes from './candidate-card.module.css';
import CandidateSponsors from './candidate-sponsors';

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
      href={`/candidates/${candidate.id}`}
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
              currentBlock={currentBlock !== undefined ? currentBlock - 1n : undefined}
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
          <p className={classes.timestamp}>
            {relativeTimestamp(Number(candidate.lastUpdatedTimestamp))}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
