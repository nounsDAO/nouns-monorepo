import { useLingui } from '@lingui/react';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;

  const { i18n } = useLingui();

  const eth = new BigNumber(utils.formatEther(amount.toString())).toFixed(2);
  return <>Ξ {`${i18n.number(Number(eth))}`}</>;
};
export default TruncatedAmount;
