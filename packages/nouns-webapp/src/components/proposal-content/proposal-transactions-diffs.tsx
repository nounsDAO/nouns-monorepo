import ReactDiffViewer from 'react-diff-viewer';
import { Hex } from 'viem';

import { Address } from '@/utils/types';
import { ProposalDetail } from '@/wrappers/nounsDao';

import classes from './proposal-content.module.css';
import ProposalTransaction from './proposal-transaction';

type Props = {
  oldTransactions: ProposalDetail[];
  newTransactions: ProposalDetail[];
  activeVersionNumber: number;
};

export default function ProposalTransactions({ oldTransactions, newTransactions }: Props) {
  const buildTxObject = (tx: ProposalDetail) => {
    if (!tx) {
      return {
        target: '' as Address,
        functionSig: '',
        value: 0n,
        callData: '' as Hex,
      };
    }
    return {
      target: tx.target,
      functionSig: tx.functionSig,
      value: tx.value,
      callData: tx.callData,
    };
  };
  const longerArray =
    oldTransactions.length > newTransactions.length ? oldTransactions : newTransactions;
  const transactions = Array.from({ length: longerArray.length }, (_, i) => {
    const oldTx = buildTxObject(oldTransactions[i]);
    const newTx = buildTxObject(newTransactions[i]);
    return {
      oldTx: oldTx,
      newTx: newTx,
    };
  });

  const stringifyTx = (tx: ProposalDetail) => {
    return tx.target + '.' + tx.functionSig + (tx.value ? tx.value : '') + '(' + tx.callData + ')';
  };

  const isEmptyTx = (tx: ProposalDetail) => {
    const item = tx.target + tx.functionSig + (tx.value ? tx.value : '') + tx.callData;
    return item === '';
  };

  return (
    <div>
      <ol className={classes.transactionDiffsList}>
        {transactions.map(
          (
            tx: {
              oldTx: ProposalDetail;
              newTx: ProposalDetail;
            },
            i: number,
          ) => {
            const isDiff = stringifyTx(tx.oldTx) !== stringifyTx(tx.newTx);
            if (!isDiff)
              return (
                <div className="position-relative">
                  <div className={classes.listItemNum}>{i + 1}.</div>
                  <ProposalTransaction transaction={isEmptyTx(tx.oldTx) ? tx.newTx : tx.oldTx} />
                </div>
              );
            return (
              <li key={i} className={classes.transactionDiffsRow}>
                {/* manually add num for better css control */}
                <div className={classes.listItemNum}>{i + 1}.</div>
                <ReactDiffViewer
                  oldValue={isEmptyTx(tx.oldTx) ? '' : stringifyTx(tx.oldTx)}
                  newValue={isEmptyTx(tx.newTx) ? '' : stringifyTx(tx.newTx)}
                  hideLineNumbers={true}
                  showDiffOnly={false}
                  disableWordDiff={true}
                />
              </li>
            );
          },
        )}
      </ol>
    </div>
  );
}
