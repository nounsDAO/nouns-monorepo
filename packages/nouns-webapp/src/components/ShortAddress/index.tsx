import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';

export const useShortAddress = (address: string) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const { library: provider } = useEthers();

  const ens = useReverseENSLookUp(address);
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Davatar size={size} address={address} provider={provider} />
          </div>
        )}
        <span style={{ letterSpacing: '0.2px', fontFamily: 'PT Root UI', fontWeight: 'bold' }}>
          {ens ? ens : shortAddress}
        </span>
      </div>
    );
  }

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
