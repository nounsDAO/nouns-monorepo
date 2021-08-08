import { Modal } from 'react-bootstrap';
import { CHAIN_ID } from '../../config';

const networkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return "Ethereum Mainnet";
    case 4:
      return "the Rinkeby network";
    default:
      return `Network ${CHAIN_ID}`;
  }
}

const NetworkAlert = () => {
  return (
    <>
      <Modal show={true} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Wrong Network Detected</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Nouns DAO testnet auctions require you to switch over {networkName()} to be able
            to participate.
          </p>
          <p>
            <b>To get started, please swtich your network by following the instructions below:</b>
          </p>
          <ol>
            <li>Open Metamask</li>
            <li>Click on "Ethereum Mainnet" button at the top</li>
            <li>Click on the "Rinkeby Test Network"</li>
          </ol>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default NetworkAlert;
