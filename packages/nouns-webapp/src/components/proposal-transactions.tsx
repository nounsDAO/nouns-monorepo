import { decodeFunctionData, formatEther, parseAbi } from 'viem';

import xIcon from '@/assets/x-icon.png';
import { ProposalTransaction } from '@/wrappers/nouns-dao';

interface ProposalTransactionsProps {
  className?: string;
  proposalTransactions: ProposalTransaction[];
  onRemoveProposalTransaction: (index: number) => void;
  isProposalUpdate?: boolean;
}

const ProposalTransactions = ({
  className,
  proposalTransactions,
  onRemoveProposalTransaction,
  isProposalUpdate,
}: ProposalTransactionsProps) => {
  const getHoverText = (tx: ProposalTransaction) => {
    let calldata: string | unknown = 'None';
    if (tx.calldata === '0x') {
      calldata = 'None';
    } else if (tx.decodedCalldata) {
      calldata = tx.decodedCalldata;
    } else if (tx.calldata) {
      calldata = tx.calldata;
    }

    if (isProposalUpdate === true && tx.signature && tx.calldata !== '0x') {
      try {
        const abi = parseAbi([`function ${tx.signature}`] as never);
        const { args } = decodeFunctionData({
          abi,
          data: tx.calldata as `0x${string}`,
        });
        calldata = JSON.stringify(args);
      } catch (err) {
        console.warn('Failed to decode calldata:', err);
      }
    }

    const value = tx.value ? `${formatEther(BigInt(tx.value))} ETH` : 'None';
    const address = tx.address;
    const func = tx.signature || 'None';

    return `Transaction Details\nAddress: ${address}\nValue: ${value}\nFunction: ${func}\nCalldata: ${calldata}`;
  };

  return (
    <div className={className}>
      {proposalTransactions.map((tx, i) => (
        <div
          key={`${tx.signature}-${tx.calldata}`}
          title={getHoverText(tx)}
          className={
            'mt-4 flex items-center justify-between rounded-[8px] border border-[#aaa] px-4 py-2'
          }
        >
          <div>
            <span>Transaction #{i + 1} - </span>
            <span>
              <b>{tx.signature || 'transfer()'}</b>
            </span>
          </div>
          <button
            type="button"
            className="border-0 bg-transparent shadow-none outline-none"
            onClick={() => onRemoveProposalTransaction(i)}
          >
            <img className="w-4" src={xIcon.src} alt="Remove Transaction" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProposalTransactions;
