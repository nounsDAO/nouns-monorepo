import React, { useEffect, useState } from 'react';

import { i18n } from '@lingui/core';
import { Trans, Plural } from '@lingui/react/macro';
import { Card } from 'react-bootstrap';
import { usePublicClient } from 'wagmi';

import VoteProgressBar from '@/components/vote-progress-bar';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { cn } from '@/lib/utils';
import { ensCacheKey } from '@/utils/ens-lookup';
import { lookupNNSOrENS } from '@/utils/lookup-nns-or-ens';
import { Address } from '@/utils/types';
import { Proposal } from '@/wrappers/nouns-dao';

import DelegateGroupedNounImageVoteTable from '../delegate-grouped-noun-image-vote-table';



export enum VoteCardVariant {
  FOR,
  AGAINST,
  ABSTAIN,
}

interface VoteCardProps {
  proposal: Proposal;
  percentage: number;
  variant: VoteCardVariant;
  delegateGroupedVoteData:
    | { delegate: Address; supportDetailed: 0 | 1 | 2; nounsRepresented: string[] }[]
    | undefined;
}

const VoteCard: React.FC<VoteCardProps> = props => {
  const { proposal, percentage, variant, delegateGroupedVoteData } = props;

  let titleClass: string;
  let titleCopy;
  let voteCount;
  let supportDetailedValue: 0 | 1 | 2;
  switch (variant) {
    case VoteCardVariant.FOR:
      titleClass = 'text-brand-color-green';
      titleCopy = <Trans>For</Trans>;
      voteCount = proposal.forCount;
      supportDetailedValue = 1;
      break;
    case VoteCardVariant.AGAINST:
      titleClass = 'text-brand-color-red';
      titleCopy = <Trans>Against</Trans>;
      voteCount = proposal.againstCount;
      supportDetailedValue = 0;
      break;
    default:
      titleClass = 'text-brand-gray-light-text';
      titleCopy = <Trans>Abstain</Trans>;
      voteCount = proposal.abstainCount;
      supportDetailedValue = 2;
      break;
  }

  const publicClient = usePublicClient();
  const [ensCached, setEnsCached] = useState(false);
  const locale = useActiveLocale();
  const filteredDelegateGroupedVoteData =
    delegateGroupedVoteData?.filter(v => v.supportDetailed === supportDetailedValue) ?? [];
  const isEnUS = locale === 'en-US';

  // Pre-fetch ENS of delegates (with 30 min TTL)
  // This makes hover cards load more smoothly
  useEffect(() => {
    if (delegateGroupedVoteData == null || publicClient == null || ensCached === true) {
      return;
    }

    delegateGroupedVoteData.forEach((delegateInfo: { delegate: Address }) => {
      if (localStorage.getItem(ensCacheKey(delegateInfo.delegate))) {
        return;
      }

      lookupNNSOrENS(publicClient, delegateInfo.delegate)
        .then(name => {
          // Store data as mapping of address_Expiration => address or ENS
          if (name) {
            localStorage.setItem(
              ensCacheKey(delegateInfo.delegate),
              JSON.stringify({
                name,
                expires: Date.now() / 1000 + 30 * 60,
              }),
            );
          }
        })
        .catch(error => {
          console.log(`error resolving reverse ens lookup: `, error);
        });
    });
    setEnsCached(true);
  }, [publicClient, ensCached, delegateGroupedVoteData]);

  return (
    <div className={cn('lg:col-span-4', 'xl-max:w-1/3')}>
      <Card className={cn('mt-4 min-h-72 rounded-xl bg-brand-gray-background p-2', 'xl-max:min-h-0')}>
        <Card.Body className="p-2">
          <Card.Text className="m-0 py-2">
            <span
              className={cn(
                isEnUS ? 'font-londrina text-22 xl-max:mx-auto' : 'font-londrina text-base xl-max:mx-auto xl-max:text-base',
                titleClass,
              )}
            >
              {titleCopy}
            </span>
            <span
              className={cn(
                'font-pt mt-[0.15rem] text-22 font-bold',
                'xl-max:hidden',
                !isEnUS ? 'text-base' : '',
                'relative',
                'xl-max:mx-auto',
              )}
            >
              {i18n.number(voteCount)}
              {filteredDelegateGroupedVoteData.length > 0 && (
                <small className="text-muted-foreground absolute bottom-0 right-0 translate-y-1/2 whitespace-nowrap text-xs">
                  {filteredDelegateGroupedVoteData.length}{' '}
                  <Plural
                    value={filteredDelegateGroupedVoteData.length}
                    one="voter"
                    other="voters"
                  />
                </small>
              )}
            </span>
          </Card.Text>

          <Card.Text className={cn('m-0 py-2', 'hidden xl-max:flex xl-max:flex-col')}>
            <span className={cn('font-pt mt-[0.15rem] text-22 font-bold', 'relative')}>
              {i18n.number(voteCount)}
              {filteredDelegateGroupedVoteData.length > 0 && (
                <small className="text-muted-foreground absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap text-xs">
                  {filteredDelegateGroupedVoteData.length}{' '}
                  <Plural
                    value={filteredDelegateGroupedVoteData.length}
                    one="voter"
                    other="voters"
                  />
                </small>
              )}
            </span>
          </Card.Text>

          <VoteProgressBar variant={variant} percentage={percentage} />
          <div className={cn('flex flex-wrap', 'mt-6 pl-2 pr-2', 'xl-max:hidden')}>
            <DelegateGroupedNounImageVoteTable
              filteredDelegateGroupedVoteData={filteredDelegateGroupedVoteData}
              propId={Number(proposal.id || '0')}
              proposalCreationBlock={proposal.createdBlock}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VoteCard;
