'use client';

import React from 'react';

import { Trans } from '@lingui/react/macro';

import ForkStatus from '@/components/fork-status';
import Section from '@/components/section';
import { cn } from '@/lib/utils';
import { Fork, ForkState, useForks } from '@/wrappers/nouns-dao';
import { Link } from 'react-router';

const ForksPage: React.FC = () => {
  const forks = useForks();
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const lastForkEndTs =
    Array.isArray(forks.data) && forks.data.length > 0
      ? Number(forks.data[forks.data.length - 1].forkingPeriodEndTimestamp)
      : undefined;
  const isLatestForkFinished =
    Number.isFinite(lastForkEndTs) && (lastForkEndTs as number) < currentTime;
  const nextForkId = Array.isArray(forks.data) ? forks.data.length : undefined;

  return (
    <div>
      <Section fullWidth={false} className="lg-max:mx-2">
        <div className={`mx-auto w-full lg:w-10/12`}>
          <div className={`flex flex-col gap-2`}>
            <span className="font-londrina text-brand-text-muted-600 text-2xl">
              <Trans>Governance</Trans>
            </span>
            <h1 className="font-londrina text-brand-gray-dark-text text-[56px]">
              <Trans>Fork</Trans>
            </h1>
          </div>
          <p className={cn('font-pt text-brand-dark-green m-0 text-[1.2rem] font-medium')}>
            <Trans>
              Forking is the crypto-native way for groups of token holders to exit together into a
              new instance of their protocol, resulting in maximal conservation of momentum in the
              ecosystem.
            </Trans>
          </p>
          <p className={cn('font-pt text-brand-dark-green mt-0 text-[1.2rem] font-medium')}>
            <a
              href="https://mirror.xyz/0x10072dfc23771101dC042fD0014f263316a6E400/iN0FKOn_oYVBzlJkwPwK2mhzaeL8K2-W80u82F7fHj8"
              target="_blank"
              rel="noreferrer"
              className="font-pt text-brand-gray-dark-text font-bold hover:no-underline"
            >
              Learn more about Nouns Fork
            </a>
          </p>
        </div>
      </Section>
      {/* if the latest fork id is finished forking, display a callout with an option to start a new fork. */}
      <Section fullWidth={false} className="lg-max:mx-2">
        <div className={`mx-auto w-full lg:w-10/12`}>
          <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`}>
            {Array.isArray(forks.data) && forks.data.length > 0
              ? forks.data
                  .map((fork: Fork, i: number) => {
                    const forkEndTs = Number(fork.forkingPeriodEndTimestamp);
                    const isForkPeriodActive =
                      Number.isFinite(forkEndTs) && forkEndTs > currentTime;
                    let status = ForkState.ESCROW;
                    if (isForkPeriodActive) {
                      status = ForkState.ACTIVE;
                    } else if (fork.executed === true) {
                      status = ForkState.EXECUTED;
                    }

                    return (
                      <Link
                        to={`/fork/${fork.id}`}
                        className="border-brand-gray-border bg-brand-gray-background font-pt text-22 mb-4 mt-[0.4rem] flex justify-between gap-4 rounded-2xl border p-4 font-bold text-inherit no-underline hover:cursor-pointer hover:bg-white"
                        key={i}
                      >
                        <div className={"font-londrina text-brand-gray-dark-text text-23"}>Nouns DAO Fork #{fork.id}</div>
                        <div className={cn('ml-2 min-w-max max-w-[5rem]')}>
                          <ForkStatus status={status} />
                        </div>
                      </Link>
                    );
                  })
                  .reverse()
              : null}
          </div>
          <div className="mt-4">
            {((Array.isArray(forks.data) && forks.data.length === 0) ||
              (isLatestForkFinished && typeof nextForkId === 'number')) && (
              <div>
                <p className="w-full text-center">
                  <Trans>There are no active forks.</Trans>{' '}
                  <Link to={`/fork/${nextForkId}`}>
                    <Trans>Start a new fork</Trans>
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ForksPage;
