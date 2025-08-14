import type { Address } from '@/utils/types';

import React from 'react';

import { Trans } from '@lingui/react/macro';

import ShortAddress from '@/components/short-address';
import { buildEtherscanAddressLink } from '@/utils/etherscan';

import classes from './candidate-sponsors.module.css';

type OriginalSignatureProps = {
  voteCount: number;
  signer: Address;
  isParentProposalUpdatable: boolean;
};

const OriginalSignature: React.FC<OriginalSignatureProps> = ({
  isParentProposalUpdatable,
  signer,
  voteCount,
}) => {
  return (
    <li className={classes.placeholder}>
      <div className={classes.details}>
        <div className={classes.sponsorInfo}>
          <p className={classes.sponsorName}>
            <a href={buildEtherscanAddressLink(signer)} target={'_blank'} rel="noreferrer">
              <ShortAddress address={signer} />
            </a>
          </p>
        </div>
        <p className={classes.voteCount}>
          {voteCount} vote{voteCount !== 1 && 's'}
        </p>
      </div>
      <p className={classes.sigStatus}>
        {isParentProposalUpdatable ? (
          <Trans>Awaiting signature</Trans>
        ) : (
          <Trans>Did not re-sign</Trans>
        )}
      </p>
    </li>
  );
};

export default OriginalSignature;
