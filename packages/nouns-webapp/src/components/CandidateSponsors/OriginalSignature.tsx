import React from 'react';
import classes from './CandidateSponsors.module.css';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import ShortAddress from '../ShortAddress';
import { Trans } from '@lingui/macro';

type OriginalSignatureProps = {
  voteCount: number;
  signer: string;
  isParentProposalUpdatable: boolean;
};

const OriginalSignature: React.FC<OriginalSignatureProps> = props => {
  return (
    <li className={classes.placeholder}>
      <div className={classes.details}>
        <div className={classes.sponsorInfo}>
          <p className={classes.sponsorName}>
            <a href={buildEtherscanAddressLink(props.signer)} target={'_blank'} rel="noreferrer">
              <ShortAddress address={props.signer} />
            </a>
          </p>
        </div>
        <p className={classes.voteCount}>
          {props.voteCount} vote{props.voteCount !== 1 && 's'}
        </p>
      </div>
      <p className={classes.sigStatus}>
        {props.isParentProposalUpdatable ? (
          <Trans>Awaiting signature</Trans>
        ) : (
          <Trans>Did not re-sign</Trans>
        )}
      </p>
    </li>
  );
};

export default OriginalSignature;
