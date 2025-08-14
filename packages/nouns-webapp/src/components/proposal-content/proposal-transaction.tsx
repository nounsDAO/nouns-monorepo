import { Fragment } from 'react';

import { InformationCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { formatUnits } from 'viem';

import ShortAddress from '@/components/short-address';
import { nounsTokenBuyerAddress, nounsPayerAddress } from '@/contracts';
import { defaultChain } from '@/wagmi';
import { ProposalDetail } from '@/wrappers/nounsDao';

import classes from './proposal-content.module.css';

import { linkIfAddress } from '.';

type ProposalTransactionProps = {
  transaction: ProposalDetail;
};

export default function ProposalTransaction({ transaction }: Readonly<ProposalTransactionProps>) {
  const chainId = defaultChain.id;

  return (
    <li className="m-0">
      {linkIfAddress(transaction.target)}.{transaction.functionSig}
      {transaction.value ? String(transaction.value) : null}
      {transaction.functionSig ? (
        <>
          (<br />
          {transaction.callData.split(',').map((content, i) => {
            return (
              <Fragment key={i}>
                <span key={i}>
                  &emsp;
                  {linkIfAddress(content)}
                  {transaction.callData.split(',').length - 1 === i ? '' : ','}
                </span>
                <br />
              </Fragment>
            );
          })}
          )
        </>
      ) : (
        transaction.callData
      )}
      {transaction.target.toLowerCase() === nounsTokenBuyerAddress[chainId].toLowerCase() &&
        transaction.functionSig === 'transfer' && (
          <div className={classes.txnInfoText}>
            <div className={classes.txnInfoIconWrapper}>
              <InformationCircleIcon className={classes.txnInfoIcon} />
            </div>
            <div>
              <Trans>
                This transaction was automatically added to refill the TokenBuyer. Proposers do not
                receive this ETH.
              </Trans>
            </div>
          </div>
        )}
      {transaction.target.toLowerCase() === nounsPayerAddress[chainId].toLowerCase() &&
        transaction.functionSig === 'sendOrRegisterDebt' && (
          <div className={classes.txnInfoText}>
            <div className={classes.txnInfoIconWrapper}>
              <InformationCircleIcon className={classes.txnInfoIcon} />
            </div>
            <div>
              <Trans>
                This transaction sends{' '}
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(
                  Number(formatUnits(BigInt(transaction.callData.split(',')[1]), 6)),
                )}{' '}
                USDC to{' '}
                <ShortAddress address={transaction.callData.split(',')[0] as `0x${string}`} /> via
                the DAO&apos;s PayerContract.
              </Trans>
            </div>
          </div>
        )}
    </li>
  );
}
