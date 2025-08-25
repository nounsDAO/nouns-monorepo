import type { Address } from '@/utils/types';

import React from 'react';

import { useReverseENSLookUp } from '@/utils/ens-lookup';
import { containsBlockedText } from '@/utils/moderation/contains-blocked-text';

interface EnsOrLongAddressProps {
  address: Address;
}

/**
 * Resolves ENS for address if one exists, otherwise falls back to full address
 */
const EnsOrLongAddress: React.FC<EnsOrLongAddressProps> = props => {
  const { address } = props;
  const ens = useReverseENSLookUp(address);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  return <>{ens && !ensMatchesBlocklistRegex ? ens : address}</>;
};

export default EnsOrLongAddress;
