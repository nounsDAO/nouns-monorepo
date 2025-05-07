import React from 'react';

import { useEthers } from '@usedapp/core';

import { useIsNetworkEnsSupported } from '../../hooks/useIsNetworkEnsSupported';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { containsBlockedText } from '../../utils/moderation/containsBlockedText';
import { resolveNounContractAddress } from '../../utils/resolveNounsContractAddress';
import Identicon from '../Identicon';

import classes from './ShortAddress.module.css';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const { library: provider } = useEthers();
  const hasENS = useIsNetworkEnsSupported();
  const ens = useReverseENSLookUp(address) || resolveNounContractAddress(address);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {hasENS && avatar && (
          <div key={address}>
            <Identicon size={size} address={address} provider={provider} />
          </div>
        )}
        <span>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</span>
      </div>
    );
  }

  return <>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</>;
};

export default ShortAddress;
