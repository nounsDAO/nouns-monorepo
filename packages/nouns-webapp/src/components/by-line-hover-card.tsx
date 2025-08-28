import React from 'react';

import { useQuery } from '@apollo/client';
import { ScaleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { Spinner } from 'react-bootstrap';
import { map } from 'remeda';

import HorizontalStackedNouns from '@/components/horizontal-stacked-nouns';
import ShortAddress from '@/components/short-address';
import { Delegate, Maybe } from '@/subgraphs/graphql';
import { Address } from '@/utils/types';
import { currentlyDelegatedNouns } from '@/wrappers/subgraph';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUN_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { query, variables } = currentlyDelegatedNouns(proposerAddress);
  const { data, loading, error } = useQuery<{ delegates: Maybe<Delegate[]> }>(query, { variables });

  if (loading || (data && data?.delegates?.length === 0)) {
    return (
      <div className="text-brand-gray-light-text h-30 flex w-full flex-col justify-center">
        <div className="flex w-full justify-center">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  if (error) {
    return <>Error fetching Vote info</>;
  }

  const sortedNounIds = data?.delegates?.[0]?.nounsRepresented
    .map((noun: { id: string }) => {
      return Number(noun.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div className="flex flex-col">
      <div className="flex">
        <HorizontalStackedNouns
          nounIds={map(
            data?.delegates?.[0]?.nounsRepresented ?? [],
            (noun: { id: string }) => noun.id,
          )}
        />
      </div>

      <div className="font-londrina w-full text-left text-2xl">
        <ShortAddress address={data?.delegates?.[0]?.id as Address} />
      </div>

      <div className="text-brand-gray-dark-text text-15 max-w-11rem mt-1 flex font-medium">
        <div>
          <ScaleIcon height={15} width={15} className="mb-1.5 mr-1.5" />
          {sortedNounIds?.length === 1 ? (
            <Trans>
              <span>Delegated Noun: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated Nouns: </span>
            </Trans>
          )}

          {sortedNounIds?.slice(0, MAX_NOUN_IDS_SHOWN).map((nounId: number, i: number) => {
            return (
              <span className="font-bold" key={nounId.toString()}>
                {nounId}
                {i !== Math.min(MAX_NOUN_IDS_SHOWN, sortedNounIds?.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {Number(sortedNounIds?.length ?? 0) > MAX_NOUN_IDS_SHOWN && (
            <span>
              <Trans>... and {Number(sortedNounIds?.length ?? 0) - MAX_NOUN_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
