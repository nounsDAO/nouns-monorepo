import { ExternalLinkIcon } from '@heroicons/react/solid';
import React from 'react';
import { buildEtherscanTxLink } from '../../../../../utils/etherscan';
import classes from './TransactionHashPill.module.css';

interface TransactionHashPillProps {
  transactionHash: string;
}

const TransactionHashPill: React.FC<TransactionHashPillProps> = props => {
  const { transactionHash } = props;

  return (
    <div
      onClick={() => window.open(buildEtherscanTxLink(transactionHash), '_blank')}
      className={classes.transactionHashWrapper}
    >
      <ExternalLinkIcon className={classes.externalLinkIcon} />
      {transactionHash.substring(0, 4) +
        '...' +
        transactionHash.substring(transactionHash.length - 4, transactionHash.length)}
    </div>
  );
};

export default TransactionHashPill;
