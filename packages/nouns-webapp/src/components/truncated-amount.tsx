import React from 'react';

import { formatEther } from 'viem';

interface TruncatedAmountProps {
  amount: bigint;
}

const TruncatedAmount: React.FC<TruncatedAmountProps> = ({ amount }) => {
  const eth = formatEther(BigInt(amount.toString()));
  // Format to 2 decimal places
  const formattedEth = parseFloat(eth).toFixed(2);
  return <>Ξ {formattedEth}</>;
};
export default TruncatedAmount;
