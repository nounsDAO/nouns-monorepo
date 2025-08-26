import React from 'react';

import { Trans } from '@lingui/react/macro';
import Link from 'next/link';

import ShortAddress from '@/components/short-address';
import { cn } from '@/lib/utils';
import { relativeTimestamp } from '@/utils/time-utils';
import { PartialProposal } from '@/wrappers/nouns-dao';
import { ProposalCandidate } from '@/wrappers/nouns-data';

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
      className={cn(
        'border-brand-gray-border bg-brand-gray-background font-pt text-22 group mb-4 mt-1.5 box-border flex flex-col rounded-2xl border p-4 text-center font-bold text-inherit no-underline hover:cursor-pointer hover:bg-white hover:text-inherit md:text-left',
      )}
      href={`/candidates/${candidate.id}`}
    >
      <div className="w-full">
        <span className="block w-full">
          <span>{candidate.version.content.title}</span>
        </span>
        <p className="m-0 p-0 text-base font-normal">
          by{' '}
          <span className="text-brand-color-red font-bold no-underline">
            <ShortAddress address={candidate.proposer || ''} avatar={false} />
          </span>
        </p>

        <div className="mt-2.5 flex flex-col items-center justify-between border-t border-black/10 pt-2.5 md:flex-row md:items-start">
          <div className="flex flex-row flex-wrap items-center justify-center gap-1.5 md:justify-start md:overflow-hidden">
            <CandidateSponsors
              signers={signers}
              nounsRequired={candidate.requiredVotes}
              currentBlock={currentBlock !== undefined ? currentBlock - 1n : undefined}
              isThresholdMetByProposer={
                !!(proposerVoteCount && proposerVoteCount >= candidate.requiredVotes)
              }
            />
            <span
              className={cn(
                'ml-2.5 block text-base font-normal',
                candidate.voteCount - candidate.requiredVotes > 0 &&
                  'md-lg:h-full md-lg:-ml-6 md-lg:px-10 md-lg:py-2.5 md-lg:bg-sponsor-fade group-hover:md-lg:bg-sponsor-fade-hover',
              )}
            >
              <strong>
                {candidate.voteCount} /{' '}
                {candidate.proposerVotes > nounsRequired ? (
                  <em className="rounded bg-black/20 p-1 font-mono text-xs font-normal not-italic opacity-50">
                    n/a
                  </em>
                ) : (
                  candidate.requiredVotes
                )}
              </strong>{' '}
              <Trans>sponsored votes</Trans>
            </span>
          </div>
          <p className="m-0 p-0 text-base font-bold">
            {relativeTimestamp(Number(candidate.lastUpdatedTimestamp))}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
