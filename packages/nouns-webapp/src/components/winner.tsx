import type { Address } from '@/utils/types';

import React from 'react';

import { Trans } from '@lingui/react/macro';

import ShortAddress from '@/components/short-address';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';

interface WinnerProps {
  winner: Address;
  isNounders?: boolean;
}

const Winner: React.FC<WinnerProps> = props => {
  const { winner, isNounders } = props;
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const isCool = useAppSelector(state => state.application.isCoolBackground);

  const isWinnerYou =
    activeAccount !== undefined && activeAccount.toLocaleLowerCase() === winner.toLocaleLowerCase();

  const activeLocale = useActiveLocale();

  const nonNounderNounContent = isWinnerYou ? (
    <div className={cn('lg-max:pr-1 mt-1', activeLocale === 'ja-JP' ? 'lg:w-8/12' : 'lg:w-4/12')}>
      <h2
        className="font-pt lg-max:text-[23px] lg-max:mr-2 text-[32px] font-bold"
        style={{
          color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
        }}
      >
        <Trans>You</Trans>
      </h2>
    </div>
  ) : (
    <ShortAddress size={40} address={winner} avatar={true} />
  );

  const nounderNounContent = (
    <a
      href={buildEtherscanAddressLink('nounders.eth')}
      target={'_blank'}
      rel="noreferrer"
      className="text-brand-black hover:text-brand-black active:text-brand-black flex cursor-pointer no-underline hover:no-underline active:no-underline"
    >
      <Tooltip>
        <TooltipContent id="holder-etherscan-tooltip">
          <Trans>View on Etherscan</Trans>
        </TooltipContent>
        <TooltipTrigger>nounders.eth</TooltipTrigger>
      </Tooltip>
    </a>
  );

  return (
    <>
      <div className="lg-max:mt-0 lg-max:w-full lg-max:mx-0 lg-max:px-0 lg-max:justify-between ml-2 mt-[2px] flex flex-wrap pl-6">
        <div className="font-pt lg-max:pl-2 w-auto lg:w-full">
          <h4
            style={{
              color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
            }}
            className="font-pt min-w-[250px] text-[18px] font-bold leading-[27px]"
          >
            <Trans>Winner</Trans>
          </h4>
        </div>
        <div className="flex-1 lg:w-full">
          <h2
            className="font-pt lg-max:text-[23px] lg-max:mr-2 text-[32px] font-bold"
            style={{
              color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)',
            }}
          >
            {isNounders === true ? nounderNounContent : nonNounderNounContent}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Winner;
