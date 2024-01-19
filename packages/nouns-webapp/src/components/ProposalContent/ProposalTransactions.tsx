import { Fragment } from 'react';
import { ProposalDetail } from '../../wrappers/nounsDao';
import classes from './ProposalContent.module.css';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import config from '../../config';
import { utils } from 'ethers';
import { linkIfAddress } from '.';
import ShortAddress from '../ShortAddress';

type Props = {
  details: ProposalDetail[];
};

export default function ProposalTransactions({ details }: Props) {
  return (
    <ol>
      {details.map((d, i) => {
        return (
          <li key={i} className="m-0">
            {linkIfAddress(d.target)}.{d.functionSig}
            {d.value}
            {!!d.functionSig ? (
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
            {d.target.toLowerCase() === config.addresses.tokenBuyer?.toLowerCase() && d.functionSig === 'transfer' && (
              <div className={classes.txnInfoText}>
                <div className={classes.txnInfoIconWrapper}>
                  <InformationCircleIcon className={classes.txnInfoIcon} />
                </div>
                <div>
                  <Trans>
                    This transaction was automatically added to refill the TokenBuyer. Proposers do
                    not receive this ETH.
                  </Trans>
                </div>
              </div>
            )}
            {d.target.toLowerCase() === config.addresses.payerContract?.toLowerCase() && d.functionSig === 'sendOrRegisterDebt' && (
              <div className={classes.txnInfoText}>
                <div className={classes.txnInfoIconWrapper}>
                  <InformationCircleIcon className={classes.txnInfoIcon} />
                </div>
                <div>
                  <Trans>
                    This transaction sends{' '}
                    {Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(
                      Number(utils.formatUnits(d.callData.split(',')[1], 6)),
                    )}{' '}
                    USDC to <ShortAddress address={d.callData.split(',')[0]} /> via the DAO's
                    PayerContract.
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
