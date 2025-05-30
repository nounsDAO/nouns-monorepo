import React from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Connector, useConnect } from 'wagmi';

import Modal from '../Modal';
import WalletButton, { WALLET_TYPE } from '../WalletButton';

import classes from './WalletConnectModal.module.css';

interface WalletConnectModalProps {
  onDismiss: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = props => {
  const { onDismiss } = props;
  const { connect, connectors } = useConnect();

  const connectToWallet = (connector?: Connector) => {
    if (connector) {
      console.log(`Attempting to connect with wallet: ${connector.id}`);
      connect({ connector });
    } else {
      console.log('No connector provided for wallet connection');
    }
  };

  const wallets = (
    <div className={classes.walletConnectModal}>
      <WalletButton
        onClick={() => {
          const injectedConnector = connectors.find(c => c.id === 'injected');
          connectToWallet(injectedConnector);
        }}
        walletType={WALLET_TYPE.metamask}
      />
      <WalletButton
        onClick={() => {
          const walletConnectConnector = connectors.find(c => c.id === 'walletConnect');
          connectToWallet(walletConnectConnector);
        }}
        walletType={WALLET_TYPE.walletconnect}
      />
      <WalletButton
        onClick={() => {
          const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWallet');
          connectToWallet(coinbaseConnector);
        }}
        walletType={WALLET_TYPE.coinbaseWallet}
      />
      <WalletButton
        onClick={() => {
          const injectedConnector = connectors.find(c => c.id === 'injected');
          connectToWallet(injectedConnector);
        }}
        walletType={WALLET_TYPE.brave}
      />
      <div
        className={clsx(classes.clickable, classes.walletConnectData)}
        onClick={() => localStorage.removeItem('walletconnect')}
      >
        <Trans>Clear WalletConnect Data</Trans>
      </div>
    </div>
  );
  return (
    <Modal title={<Trans>Connect your wallet</Trans>} content={wallets} onDismiss={onDismiss} />
  );
};
export default WalletConnectModal;
