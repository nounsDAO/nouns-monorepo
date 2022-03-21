import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React from 'react';
import { useAppSelector } from '../../hooks';
import { isMobileScreen } from '../../utils/isMobile';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;
  const { mona, eth } = useAppSelector(state => state.application);
  const isMobile = isMobileScreen();

  const monaValue = new BigNumber(utils.formatEther(amount.toString())).toFixed(2);

  const ethValue = ((parseFloat(monaValue) * mona) / eth).toFixed(2);

  return (
    <>
      {isMobile ? (
        <>{`${monaValue}`} MONA</>
      ) : (
        <>
          {`${ethValue}`} ETH ({`${monaValue}`} MONA)
        </>
      )}
    </>
  );
};
export default TruncatedAmount;
