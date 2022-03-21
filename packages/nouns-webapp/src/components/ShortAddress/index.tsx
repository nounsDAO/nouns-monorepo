import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';
import { black, primary } from '../../utils/nounBgColors';

export const useShortAddress = (address: string) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const ShortAddress: React.FC<{
  address: string;
  avatar?: boolean;
  size?: number;
  isEthereum?: boolean;
}> = props => {
  const { address, avatar, size = 24, isEthereum } = props;
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
        <span style={{ color: isEthereum ? primary : black }}>{ens ? ens : shortAddress}</span>
      </div>
    );
  }

  return <span style={{ color: isEthereum ? primary : black }}>{ens ? ens : shortAddress}</span>;
};

export default ShortAddress;
