import React from 'react';

import { utils } from 'ethers';

const TruncatedAmount: React.FC<{ amount: bigint }> = props => {
  const { amount } = props;

  const eth = utils.formatEther(amount.toString());
  // Format to 2 decimal places
  const formattedEth = parseFloat(eth).toFixed(2);
  return <>Ξ {formattedEth}</>;
};
export default TruncatedAmount;
