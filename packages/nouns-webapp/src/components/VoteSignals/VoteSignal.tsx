import React from 'react';
import classes from './VoteSignals.module.css';
import ShortAddress from '../ShortAddress';

type Props = {
  support: number;
  voteCount: number;
  reason: string;
  address: string;
};

const VoteSignal = (props: Props) => {
  return (
    <div className={classes.voteSignal}>
      <div className={classes.voteSignalAvatar}>
        {/* fetch noun image for address */}
        <div className={classes.voter}>
          <div className={classes.avatar}>
            <img src="https://noun.pics/0" alt="Voter avatar" />
          </div>
          <div className={classes.details}>
            <strong>
              <ShortAddress address={props.address} size={10} />
            </strong>
            <span>
              {props.voteCount} vote{props.voteCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <p className={classes.reason}>{props.reason}</p>
      </div>
    </div>
  );
};

export default VoteSignal;
