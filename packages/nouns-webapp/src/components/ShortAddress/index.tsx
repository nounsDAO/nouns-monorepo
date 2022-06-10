import { useReverseENSLookUp } from '../../utils/ensLookup';
import { useEthers } from '@usedapp/core';
import Davatar from '@davatar/react';
import classes from './ShortAddress.module.css';
import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const { library: provider } = useEthers();

  const ens = useReverseENSLookUp(address);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Davatar size={size} address={address} provider={provider} />
          </div>
        )}
        <span>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</span>
      </div>
    );
  }

  return <>{ens ? ens : shortAddress}</>;
};

export default ShortAddress;
