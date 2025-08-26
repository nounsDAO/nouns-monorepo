import React from 'react';

import { useQuery } from '@apollo/client';
import { ScaleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { Spinner } from 'react-bootstrap';

import HorizontalStackedNouns from '@/components/horizontal-stacked-nouns';
import ShortAddress from '@/components/short-address';
import { delegateNounsAtBlockQuery } from '@/wrappers/subgraph';

// Replaced CSS module with inline Tailwind classes

interface DelegateHoverCardProps {
  delegateId: string;
  proposalCreationBlock: bigint;
}

const DelegateHoverCard: React.FC<DelegateHoverCardProps> = props => {
  const { delegateId, proposalCreationBlock } = props;

  const unwrappedDelegateId = delegateId ? delegateId.replace('delegate-', '') : '';

  const { query, variables } = delegateNounsAtBlockQuery(
    [unwrappedDelegateId],
    proposalCreationBlock,
  );
  const { data, loading, error } = useQuery(query, { variables });

  if (loading || data == null || data.delegates.length === 0) {
    return (
      <div className="flex h-[185px] w-full flex-col justify-center text-[var(--brand-gray-light-text)]">
        <div className="flex w-full justify-center">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (error) {
    return <>Error fetching Vote info</>;
  }

  const numVotesForProp = data.delegates[0].nounsRepresented.length;

  return (
    <div className="max-w-11rem flex flex-col">
      <div className="flex">
        <HorizontalStackedNouns
          nounIds={data.delegates[0].nounsRepresented.map((noun: { id: string }) => noun.id)}
        />
      </div>

      <div className="font-londrina w-full text-left text-[24px]">
        <ShortAddress address={data?.delegates?.[0]?.id ?? ''} />
      </div>

      <div className="mb-3 mt-1 flex items-center text-[15px] font-medium not-italic leading-[1.4] text-[var(--brand-gray-dark-text)] [font-feature-settings:'tnum'_on,'lnum'_on,'ss06'_on,'ss01'_on,'liga'_off]">
        <ScaleIcon height={20} width={20} className="mb-[5px] mr-[6px]" />
        {numVotesForProp === 1 ? (
          <Trans>
            Voted with<span className="mx-1 font-bold">{numVotesForProp}</span>Noun
          </Trans>
        ) : (
          <Trans>
            Voted with<span className="mx-1 font-bold">{numVotesForProp}</span>Nouns
          </Trans>
        )}
      </div>
    </div>
  );
};

export default DelegateHoverCard;
