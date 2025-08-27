import ReactDiffViewer from 'react-diff-viewer';
import { Hex } from 'viem';

import { Address } from '@/utils/types';
import { ProposalDetail } from '@/wrappers/nouns-dao';

import ProposalTransaction from './proposal-transaction';

type Props = {
  oldTransactions: ProposalDetail[];
  newTransactions: ProposalDetail[];
  activeVersionNumber: number;
};

export default function ProposalTransactions({ oldTransactions, newTransactions }: Props) {
  const buildTxObject = (tx: ProposalDetail) => {
    if (tx == null) {
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
    const includeValue =
      tx.value != null && Number(tx.value) !== 0 && !Number.isNaN(Number(tx.value))
        ? String(tx.value)
        : '';
    return tx.target + '.' + tx.functionSig + includeValue + '(' + tx.callData + ')';
  };

  const isEmptyTx = (tx: ProposalDetail) => {
    const includeValue =
      tx.value != null && Number(tx.value) !== 0 && !Number.isNaN(Number(tx.value))
        ? String(tx.value)
        : '';
    const item = tx.target + tx.functionSig + includeValue + tx.callData;
    return item === '';
  };

  return (
    <div>
      <ol className="relative flex list-none flex-col gap-4 p-0">
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
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-0">{i + 1}.</div>
                  <ProposalTransaction transaction={isEmptyTx(tx.oldTx) ? tx.newTx : tx.oldTx} />
                </div>
              );
            return (
              <li
                key={i}
                className="[&_table]:!bg-brand-surface-subtle relative [&_table:first-of-type]:ml-0 [&_table]:!m-0 [&_table]:block [&_table]:!w-full [&_tbody]:block [&_td:nth-child(even)]:w-[calc(50%_-_25px)] [&_td:nth-child(odd)]:pr-[5px] [&_tr]:flex [&_tr]:w-full [&_tr]:items-stretch"
              >
                {/* manually add num for better css control */}
                <div className="absolute -left-6 top-0">{i + 1}.</div>
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
