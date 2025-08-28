import { Fragment } from 'react';

import { InformationCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { isNullish } from 'remeda';
import { formatUnits } from 'viem';

import { linkIfAddress } from '@/components/proposal-content';
import ShortAddress from '@/components/short-address';
import { nounsTokenBuyerAddress, nounsPayerAddress } from '@/contracts';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { ProposalDetail } from '@/wrappers/nouns-dao';

type Props = {
  details: ProposalDetail[];
};

export default function ProposalTransactions({ details }: Readonly<Props>) {
  const chainId = defaultChain.id;

  return (
    <ol>
      {details.map((d, i) => {
        return (
          <li key={i} className="m-0">
            {linkIfAddress(d.target)}.{d.functionSig}
            {(() => {
              const v = d.value as unknown;
              const hasNumberValue = typeof v === 'number' && !Number.isNaN(v) && v !== 0;
              const hasBigIntValue = typeof v === 'bigint' && v !== 0n;
              const hasStringValue = typeof v === 'string' && v !== '';
              const hasValue =
                !isNullish(v) && (hasNumberValue || hasBigIntValue || hasStringValue);
              return hasValue ? String(v) : null;
            })()}
            {d.functionSig ? (
              <>
                (<br />
                {d.callData.split(',').map((content, i) => {
                  return (
                    <Fragment key={i}>
                      <span key={i}>
                        &emsp;
                        {linkIfAddress(content)}
                        {d.callData.split(',').length - 1 === i ? '' : ','}
                      </span>
                      <br />
                    </Fragment>
                  );
                })}
                )
              </>
            ) : (
              d.callData
            )}
            {d.target.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase() &&
              d.functionSig === 'transfer' && (
                <div className="text-brand-gray-light-text my-1 ml-[-0.1rem] flex items-center text-[16px] font-medium lg-max:mt-4 lg-max:items-start">
                  <div className="flex w-[25px] items-center">
                    <InformationCircleIcon className="size-[18px] opacity-50 lg-max:mr-2 lg-max:mt-1" />
                  </div>
                  <div>
                    <Trans>
                      This transaction was automatically added to refill the TokenBuyer. Proposers
                      do not receive this ETH.
                    </Trans>
                  </div>
                </div>
              )}
            {d.target.toLowerCase() === nounsPayerAddress[chainId].toLowerCase() &&
              d.functionSig === 'sendOrRegisterDebt' && (
                <div className="text-brand-gray-light-text my-1 ml-[-0.1rem] flex items-center text-[16px] font-medium lg-max:mt-4 lg-max:items-start">
                  <div className="flex w-[25px] items-center">
                    <InformationCircleIcon className="size-[18px] opacity-50 lg-max:mr-2 lg-max:mt-1" />
                  </div>
                  <div>
                    <Trans>
                      This transaction sends{' '}
                      {Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(
                        Number(formatUnits(BigInt(d.callData.split(',')[1]), 6)),
                      )}{' '}
                      USDC to <ShortAddress address={d.callData.split(',')[0] as Address} /> via the
                      DAO&apos;s PayerContract.
                    </Trans>
                  </div>
                </div>
              )}
          </li>
        );
      })}
    </ol>
  );
}
