import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { decodeFunctionData, formatEther, parseAbi } from 'viem';

import xIcon from '@/assets/x-icon.png';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { ProposalTransaction } from '@/wrappers/nounsDao';

import classes from './proposal-transactions.module.css';

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
  const getPopover = (tx: ProposalTransaction) => {
    let calldata;
    if (tx.calldata === '0x') {
      calldata = 'None';
    } else if (tx.decodedCalldata) {
      calldata = tx.decodedCalldata;
    } else {
      calldata = tx.calldata;
    }

    if (isProposalUpdate === true && tx.signature && tx.calldata !== '0x') {
      try {
        const abi = parseAbi([`function ${tx.signature}` as any]);
        const { args } = decodeFunctionData({
          abi,
          data: tx.calldata as `0x${string}`,
        });
        calldata = JSON.stringify(args);
      } catch (err) {
        // fallback to raw if decoding fails
        console.warn('Failed to decode calldata:', err);
      }
    }

    return (
      <Popover className={classes.popover} id="transaction-details-popover">
        <Popover.Header as="h3">Transaction Details</Popover.Header>
        <Popover.Body>
          <Row>
            <Col sm="3">
              <b>Address</b>
            </Col>
            <Col sm="9">
              <a href={buildEtherscanAddressLink(tx.address)} target="_blank" rel="noreferrer">
                {tx.address}
              </a>
            </Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Value</b>
            </Col>
            <Col sm="9">{tx.value ? `${formatEther(BigInt(tx.value))} ETH` : 'None'}</Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Function</b>
            </Col>
            <Col sm="9">{tx.signature || 'None'}</Col>
          </Row>
          <Row>
            <Col sm="3">
              <b>Calldata</b>
            </Col>
            <Col sm="9">{calldata}</Col>
          </Row>
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <div className={className}>
      {proposalTransactions.map((tx, i) => (
        <OverlayTrigger
          key={`${tx.signature}-${tx.calldata}`}
          trigger={['hover', 'focus']}
          placement="top"
          overlay={getPopover(tx)}
        >
          <div
            className={`${classes.transactionDetails} d-flex justify-content-between align-items-center`}
          >
            <div>
              <span>Transaction #{i + 1} - </span>
              <span>
                <b>{tx.signature || 'transfer()'}</b>
              </span>
            </div>
            <button
              type="button"
              className={classes.removeTransactionButton}
              onClick={() => onRemoveProposalTransaction(i)}
            >
              <img src={xIcon.src} alt="Remove Transaction" />
            </button>
          </div>
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default ProposalTransactions;
