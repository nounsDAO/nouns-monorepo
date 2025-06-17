import React from 'react';

import { blo } from 'blo';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { formatShortAddress } from '@/utils/addressAndENSDisplayUtils';
import { containsBlockedText } from '@/utils/moderation/containsBlockedText';
import { resolveNounContractAddress } from '@/utils/resolveNounsContractAddress';
import { Address } from '@/utils/types';

interface ShortAddressProps {
  address: Address;
  avatar?: boolean;
  size?: number;
}

const ShortAddress: React.FC<ShortAddressProps> = ({ address, avatar = false, size = 24 }) => {
  const { data: ensName } = useEnsName({ address });
  const resolvedName = ensName ?? resolveNounContractAddress(address);
  const isBlocklisted = resolvedName ? containsBlockedText(resolvedName, 'en') : false;
  const shortAddress = formatShortAddress(address);
  const { data: ensAvatar } = useEnsAvatar({ name: resolvedName });

  const displayName = resolvedName && !isBlocklisted ? resolvedName : shortAddress;

  if (!avatar) {
    return <>{displayName}</>;
  }

  return (
    <div className="flex flex-row flex-nowrap items-center gap-1.5">
      <img
        className="rounded-full"
        alt={address}
        src={ensAvatar ?? blo(address)}
        style={{ width: size, height: size }}
      />
      <span className="font-[PT_Root_UI] font-bold tracking-[0.2px]">{displayName}</span>
    </div>
  );
};

export default ShortAddress;
