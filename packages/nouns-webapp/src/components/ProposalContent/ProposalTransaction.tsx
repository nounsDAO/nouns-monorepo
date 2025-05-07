import { Fragment } from 'react';

import { InformationCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { utils } from 'ethers';

import config from '@/config';
import { ProposalDetail } from '@/wrappers/nounsDao';
import ShortAddress from '@/components/ShortAddress';

import classes from './ProposalContent.module.css';

import { linkIfAddress } from '.';

type Props = {
  transaction: ProposalDetail;
};

export default function ProposalTransaction({ transaction }: Props) {
  return (
    <li className="m-0">
      {linkIfAddress(transaction.target)}.{transaction.functionSig}
      {transaction.value}
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
      {transaction.target.toLowerCase() === config.addresses.tokenBuyer?.toLowerCase() &&
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
      {transaction.target.toLowerCase() === config.addresses.payerContract?.toLowerCase() &&
        transaction.functionSig === 'sendOrRegisterDebt' && (
          <div className={classes.txnInfoText}>
            <div className={classes.txnInfoIconWrapper}>
              <InformationCircleIcon className={classes.txnInfoIcon} />
            </div>
            <div>
              <Trans>
                This transaction sends{' '}
                {Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(
                  Number(utils.formatUnits(transaction.callData.split(',')[1], 6)),
                )}{' '}
                USDC to <ShortAddress address={transaction.callData.split(',')[0]} /> via the DAO's
                PayerContract.
              </Trans>
            </div>
          </div>
        )}
    </li>
  );
}
