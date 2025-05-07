import { blo } from 'blo';

import { useIsNetworkEnsSupported } from '../../hooks/useIsNetworkEnsSupported';
import ShortAddress from '../ShortAddress';

import classes from './VoteSignals.module.css';
import { Address } from '@/utils/types';

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
              <img
                alt={props.address}
                src={blo(props.address as Address)}
                width={30}
                height={30}
                style={{ borderRadius: '50%' }}
              />
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
