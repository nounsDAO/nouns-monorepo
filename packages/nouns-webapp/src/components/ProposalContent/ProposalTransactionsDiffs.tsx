import { Fragment } from 'react';
import { ProposalDetail } from '../../wrappers/nounsDao';
import classes from './ProposalContent.module.css';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import config from '../../config';
import { utils } from 'ethers';
import { linkIfAddress } from '.';
import ShortAddress from '../ShortAddress';
import ReactDiffViewer from 'react-diff-viewer';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import editorClasses from '../../components/ProposalEditor/ProposalEditor.module.css';
import ProposalTransaction from './ProposalTransaction';


type Props = {
  oldTransactions: ProposalDetail[];
  newTransactions: ProposalDetail[];
  activeVersionNumber: number;
};

export default function ProposalTransactions({ oldTransactions, newTransactions, activeVersionNumber }: Props) {
  const buildTxObject = (tx: ProposalDetail) => {
    if (!tx) {
      return {
        target: '',
        functionSig: '',
        value: '',
        callData: '',
      };
    }
    return {
      target: tx.target,
      functionSig: tx.functionSig,
      value: tx.value,
      callData: tx.callData,
    };
  };
  console.log('oldTransactions', oldTransactions);
  console.log('newTransactions', newTransactions);
  const longerArray = oldTransactions.length > newTransactions.length ? oldTransactions : newTransactions;
  const transactions = Array.from({ length: longerArray.length }, (_, i) => {
    const oldTx = buildTxObject(oldTransactions[i]);
    const newTx = buildTxObject(newTransactions[i]);

    return {
      oldTx: oldTx,
      newTx: newTx,
    };
  });
  const inlineText = (str: string) => {
    return (
      <>
        {str}
      </>
    );
  };

  const stringifyTx = (tx: ProposalDetail) => {
    const item = (
      tx.target + '.' + tx.functionSig + (tx.value ? tx.value : '') + '(' + tx.callData + ')'
    );
    return item;
  };

  const isEmptyTx = (tx: ProposalDetail) => {
    const item = (
      tx.target + tx.functionSig + (tx.value ? tx.value : '') + tx.callData
    );
    return item === '';
  };

  const highlightSyntax = (str: string) => (
    <span
      style={{ display: 'inline' }}
    >{str === '' ? 'empty' : str}
    </span>
  );



  console.log('transaction diffs', transactions);

  return (
    <div>
      {/* <div className={classes.diffsHeader}>
        <p className={classes.diffsHeaderLeft}>
          Version {activeVersionNumber - 1}
        </p>
        <p className={classes.diffsHeaderRight}>
          This version
        </p>
      </div> */}
      <ol className={classes.transactionDiffsList}>
        {transactions.map((
          tx: {
            oldTx: ProposalDetail;
            newTx: ProposalDetail;
          },
          i: number
        ) => {
          const isDiff = stringifyTx(tx.oldTx) !== stringifyTx(tx.newTx);
          if (!isDiff) return (
            <div className='position-relative'>
              <div className={classes.listItemNum}>{i + 1}.</div>
              <ProposalTransaction transaction={isEmptyTx(tx.oldTx) ? tx.newTx : tx.oldTx} />
            </div>
          );
          return (
            <li key={i} className={classes.transactionDiffsRow}>
              {/* manually add num for better css control */}
              <div className={classes.listItemNum}>
                {i + 1}.
              </div>
              <ReactDiffViewer
                oldValue={isEmptyTx(tx.oldTx) ? '' : stringifyTx(tx.oldTx)}
                newValue={isEmptyTx(tx.newTx) ? '' : stringifyTx(tx.newTx)}
                hideLineNumbers={true}
                showDiffOnly={false}
                disableWordDiff={true}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
