import React from 'react';

import { blo } from 'blo';
import { useEnsAvatar, useEnsName } from 'wagmi';

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

const ShortAddress: React.FC<ShortAddressProps> = ({ address, avatar = false, size = 24 }) => {
  const { data: ensName } = useEnsName({ address });
  const resolvedName = ensName ?? resolveNounContractAddress(address);
  const isBlocklisted = resolvedName ? containsBlockedText(resolvedName, 'en') : false;
  const shortAddress = useShortAddress(address);
  const { data: ensAvatar } = useEnsAvatar({ name: resolvedName });

  const displayName = resolvedName && !isBlocklisted ? resolvedName : shortAddress;

  if (!avatar) {
    return <>{displayName}</>;
  }

  return (
    <div className={classes.shortAddress}>
      <div>
        <img
          alt={address}
          src={ensAvatar ?? blo(address)}
          width={size}
          height={size}
          style={{ borderRadius: '50%' }}
        />
      </div>
      <span>{displayName}</span>
    </div>
  );
};

export default ShortAddress;
