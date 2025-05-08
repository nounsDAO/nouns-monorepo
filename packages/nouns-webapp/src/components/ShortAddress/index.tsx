import React from 'react';

import { blo } from 'blo';
import { useEnsName } from 'wagmi';

import { useShortAddress } from '@/utils/addressAndENSDisplayUtils';
import { containsBlockedText } from '@/utils/moderation/containsBlockedText';
import { resolveNounContractAddress } from '@/utils/resolveNounsContractAddress';
import { Address } from '@/utils/types';

import classes from './ShortAddress.module.css';

interface ShortAddressProps {
  address: Address;
  avatar?: boolean;
  size?: number;
}

const ShortAddress: React.FC<ShortAddressProps> = ({ address, avatar, size = 24 }) => {
  const { data: ensName } = useEnsName({ address });
  const ens = ensName ?? resolveNounContractAddress(address);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = useShortAddress(address);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {!!ens && (
          <div key={address}>
            <img
              alt={address}
              src={blo(address)}
              width={size}
              height={size}
              style={{ borderRadius: '50%' }}
            />
          </div>
        )}
        <span>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</span>
      </div>
    );
  }

  return <>{ens && !ensMatchesBlocklistRegex ? ens : shortAddress}</>;
};

export default ShortAddress;
