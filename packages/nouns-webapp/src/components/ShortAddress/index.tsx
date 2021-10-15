import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEnsAvatarLookup } from '../../utils/ensAvatar';
import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';

const ShortAddress: React.FC<{ address: string; avatar?: boolean }> = props => {
  const { address, avatar } = props;
  const { library: provider } = useEthers();

  const ens = useReverseENSLookUp(address);
  const ensAvatar = useEnsAvatarLookup(address);
  console.log(ensAvatar);
  const shortAddress = address && [address.substr(0, 4), address.substr(38, 4)].join('...');

  return (
    <div className={classes.shortAddress}>
      {avatar && <Davatar size={24} address={address} provider={provider} />}
      {ens ? ens : shortAddress}
    </div>
  );
};

export default ShortAddress;
