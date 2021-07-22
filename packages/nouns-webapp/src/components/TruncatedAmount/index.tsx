import { BigNumber } from '@ethersproject/bignumber';
import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;
  return <span>{`${Number(utils.formatEther(amount)).toFixed(2)} ETH`}</span>;
};
export default TruncatedAmount;
