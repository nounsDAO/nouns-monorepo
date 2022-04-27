import { Modal } from 'react-bootstrap';
import { CHAIN_ID } from '../../config';

const networkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 4:
      return 'the Rinkeby network';
    case 43114:
      return 'Avalanche testnet';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const metamaskNetworkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 4:
      return 'Rinkeby Test Network';
    case 43114:
      return 'Avalanche testnet';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const AVALANCHE_TESTNET_PARAMS = {
  chainId: '0xa86a',
  chainName: 'Avalanche testnet',
  nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 2
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
}

const handleAddNetworkClick = () => {
  const injected = new InjectedConnector({
          supportedChainIds: [43114],
        });

  injected.getProvider().then(provider => {
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_TESTNET_PARAMS]
      })
      .catch((error: any) => {
        console.log(error)
      })
  })

  return false;
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
            Nouns DAO auctions require you to switch over {networkName()} to be able to participate.
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
