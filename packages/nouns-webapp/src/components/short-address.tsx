import React from 'react';

import { blo } from 'blo';
import { useEnsAvatar, useEnsName } from 'wagmi';

import { formatShortAddress } from '@/utils/address-and-ens-display-utils';
import { containsBlockedText } from '@/utils/moderation/contains-blocked-text';
import { resolveNounContractAddress } from '@/utils/resolve-nouns-contract-address';
import { Address } from '@/utils/types';

// Safe transparent pixel to avoid JSDOM issues with data:svg URLs in tests
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

interface ShortAddressProps {
  address: Address;
  avatar?: boolean;
  size?: number;
}

// Local error boundary to gracefully handle environments without WagmiProvider
class ShortAddressErrorBoundary extends React.Component<
  { fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // no-op
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const EnsAwareShortAddress: React.FC<ShortAddressProps> = ({
  address,
  avatar = false,
  size = 24,
}) => {
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
        key={`${address}-img`}
        className="shrink-0 rounded-full"
        alt={address}
        src={ensAvatar ?? TRANSPARENT_PIXEL}
        style={{ width: size, height: size, backgroundImage: `url(${blo(address)})` }}
      />
      <span className="font-[PT_Root_UI] font-bold tracking-[0.2px]">{displayName}</span>
    </div>
  );
};

const ShortAddress: React.FC<ShortAddressProps> = ({ address, avatar = false, size = 24 }) => {
  const shortAddress = formatShortAddress(address);

  if (!avatar) {
    return (
      <ShortAddressErrorBoundary fallback={<>{shortAddress}</>}>
        <EnsAwareShortAddress address={address} avatar={false} size={size} />
      </ShortAddressErrorBoundary>
    );
  }

  return (
    <ShortAddressErrorBoundary
      fallback={
        <div className="flex flex-row flex-nowrap items-center gap-1.5">
          <img
            key={`${address}-img`}
            className="shrink-0 rounded-full"
            alt={address}
            src={blo(address)}
            style={{ width: size, height: size, backgroundImage: `url(${blo(address)})` }}
          />
          <span className="font-[PT_Root_UI] font-bold tracking-[0.2px]">{shortAddress}</span>
        </div>
      }
    >
      <EnsAwareShortAddress address={address} avatar size={size} />
    </ShortAddressErrorBoundary>
  );
};

export default ShortAddress;
