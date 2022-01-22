import { useReverseENSLookUp } from '../../utils/ensLookup';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';
import { useWeb3Context } from '../../hooks/useWeb3';

export const useShortAddress = (address: string) => {
  return address && [address.substr(0, 4), address.substr(38, 4)].join('...');
};

const ShortAddress: React.FC<{ address: string; avatar?: boolean }> = props => {
  const { address, avatar } = props;
  const { provider } = useWeb3Context();

  const ens = useReverseENSLookUp(address);
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Davatar size={24} address={address} provider={provider} />
          </div>
        )}
        {ens ? ens : shortAddress}
      </div>
    );
  }

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
