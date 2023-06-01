import { Modal } from 'react-bootstrap';
import { CHAIN_ID } from '../../config';

const networkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 5:
      return 'the Goerli network';
    case 11155111:
      return 'the Sepolia network';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const metamaskNetworkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 5:
      return 'Goerli Test Network';
    // TODO bring back after adding Sepolia support
    // case 11155111:
    // return 'Sepolia Test Network';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const NetworkAlert = () => {
  return (
    <>
      <Modal show={true} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Wrong Network Detected</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Punkers DAO auctions require you to switch over {networkName()} to be able to
            participate.
          </p>
          <p>
            <b>To get started, please switch your network by following the instructions below:</b>
          </p>
          <ol>
            <li>Open Metamask</li>
            <li>Click the network select dropdown</li>
            <li>Click on "{metamaskNetworkName()}"</li>
          </ol>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default NetworkAlert;
