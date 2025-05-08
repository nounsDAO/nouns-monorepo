import React from 'react';

import { blo } from 'blo';
import { useEnsName } from 'wagmi';

import ShortAddress from '@/components/ShortAddress';
import { Address } from '@/utils/types';

import classes from './VoteSignals.module.css';

type VoteSignalProps = {
  support: number;
  voteCount: number;
  reason: string;
  address: Address;
};

const VoteSignal: React.FC<VoteSignalProps> = ({ address, reason, voteCount }) => {
  const { data: ensName } = useEnsName({ address });

  return (
    <div className={classes.voteSignal}>
      <div className={classes.voteSignalAvatar}>
        <div className={classes.voter}>
          {!!ensName && (
            <div className={classes.avatar}>
              <img
                alt={address}
                src={blo(address)}
                width={30}
                height={30}
                style={{ borderRadius: '50%' }}
              />
            </div>
          )}
          <div className={classes.details}>
            <strong>
              <ShortAddress address={address} size={10} />
            </strong>
            <span>
              {voteCount} vote{voteCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <p className={classes.reason}>{reason}</p>
      </div>
    </div>
  );
};

export default VoteSignal;
