import React from 'react';
import classes from './VoteSignals.module.css';
import ShortAddress from '../ShortAddress';
import Avatar from '@davatar/react';
import { useIsNetworkEnsSupported } from '../../hooks/useIsNetworkEnsSupported';

type Props = {
  support: number;
  voteCount: number;
  reason: string;
  address: string;
};

const VoteSignal = (props: Props) => {
  const hasENS = useIsNetworkEnsSupported();
  return (
    <div className={classes.voteSignal}>
      <div className={classes.voteSignalAvatar}>
        <div className={classes.voter}>
          {hasENS && (
            <div className={classes.avatar}>
              <Avatar address={props.address} size={30} />
            </div>
          )}
          <div className={classes.details}>
            <strong>
              <ShortAddress address={props.address} size={10} />
            </strong>
            <span>
              {props.voteCount} vote{props.voteCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <p className={classes.reason}>{props.reason}</p>
      </div>
    </div>
  );
};

export default VoteSignal;
