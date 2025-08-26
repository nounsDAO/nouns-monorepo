'use client';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import {
  useReadNounsTreasuryBalancesInEth,
  useReadNounsTreasuryBalancesInUsd,
} from '@nouns/sdk/react/treasury';
import { isNullish } from 'remeda';
import { formatEther, formatUnits } from 'viem';

import Proposals from '@/components/proposals';
import Section from '@/components/section';
import { cn } from '@/lib/utils';
import { useAllProposals, useProposalThreshold } from '@/wrappers/nouns-dao';


const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold == null ? undefined : threshold + 1;

  const treasuryBalance = useReadNounsTreasuryBalancesInEth({
    query: {
      select: balances => {
        console.log('eth', balances);
        return balances.total;
      },
    },
  }).data;
  const treasuryBalanceUSD = useReadNounsTreasuryBalancesInUsd({
    query: {
      select: balances => {
        console.log(
          'usd',
          Object.entries(balances).map(([token, value]) => [token, formatUnits(value, 6)]),
        );
        return balances.total;
      },
    },
  }).data;

  // Note: We have to extract this copy out of the <span> otherwise the Lingui macro gets confused
  const nounSingular = <Trans>Noun</Trans>;
  const nounPlural = <Trans>Nouns</Trans>;
  const subHeading = (
    <Trans>
      Nouns govern <span className="font-pt font-bold">Nouns DAO</span>. Nouns can vote on proposals
      or delegate their vote to a third party. A minimum of{' '}
      <span className="font-pt font-bold">
        {isNullish(nounsRequired) ? (
          '...'
        ) : (
          <>
            {nounsRequired} {threshold === 0 ? nounSingular : nounPlural}
          </>
        )}
      </span>{' '}
      is required to submit proposals.
    </Trans>
  );

  return (
    <>
      <Section fullWidth={false} className="lg-max:mx-2">
        <div className="mx-auto">
          <div>
            <span className="font-londrina text-brand-text-muted-600 text-2xl">
              <Trans>Governance</Trans>
            </span>
            <h1 className="font-londrina text-56 text-brand-gray-dark-text">
              <Trans>Nouns DAO</Trans>
            </h1>
          </div>
          <p className="font-pt text-brand-dark-green text-xl font-medium">{subHeading}</p>

          <div
            className={cn(
              'border-brand-border-ui mb-12 grid grid-cols-1 gap-6 rounded-2xl border lg:grid-cols-12',
            )}
          >
            <div
              className={cn('border-brand-border-ui md-lg:border-r-2 px-8 py-4', 'lg:col-span-8')}
            >
              <div>
                <span className="font-londrina text-brand-text-muted-600 text-2xl">
                  <Trans>Treasury</Trans>
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div
                  className={cn(
                    'border-brand-border-ui md-lg:border-r-2 flex h-12 min-w-36 pt-1',
                    'lg:col-span-3',
                  )}
                >
                  <h1 className="font-pt mr-2">Ξ</h1>
                  <h1 className="font-londrina text-4xl">
                    {treasuryBalance != undefined &&
                      i18n.number(Number(Number(formatEther(treasuryBalance)).toFixed(0)))}
                  </h1>
                </div>
                <div className="pt-1">
                  <h1 className="font-londrina text-brand-gray-light-text text-4xl">
                    {treasuryBalanceUSD !== undefined
                      ? i18n.number(Number(formatUnits(treasuryBalanceUSD, 6)), {
                          style: 'currency',
                          currency: 'USD',
                        })
                      : null}
                  </h1>
                </div>
              </div>
            </div>
            <div className="font-pt px-8 py-4 font-medium">
              <Trans>
                This treasury exists for <span className="font-pt font-bold">Nouns DAO</span>{' '}
                participants to allocate resources for the long-term growth and prosperity of the
                Nouns project.
              </Trans>
            </div>
          </div>
        </div>
      </Section>

      <Proposals proposals={proposals ?? []} nounsRequired={nounsRequired} />
    </>
  );
};
export default GovernancePage;
