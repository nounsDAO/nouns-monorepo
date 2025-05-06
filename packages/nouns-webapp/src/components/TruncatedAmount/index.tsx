import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: bigint }> = props => {
  const { amount } = props;

  const eth = utils.formatEther(amount.toString());
  // Format to 2 decimal places
  const formattedEth = parseFloat(eth).toFixed(2);
  return <>Ξ {formattedEth}</>;
};
export default TruncatedAmount;
