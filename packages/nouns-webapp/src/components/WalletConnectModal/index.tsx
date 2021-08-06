import Modal from '../Modal';
import WalletButton from '../WalletButton';
import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import config from '../../config';

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = props => {
  const { onDismiss } = props;
  const { activateBrowserWallet, activate, deactivate } = useEthers();

  const wallets = (
    <>
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({ 
            supportedChainIds: [config.supportedChainId]
          });
          activate(injected);
        }}
        walletType={WALLET_TYPE.metamask}
      />
      <WalletButton
        onClick={() => {
          const fortmatic = new FortmaticConnector({
            apiKey: 'pk_test_FB5E5C15F2EC5AE6',
            chainId: config.supportedChainId,
          });
          activate(fortmatic);
        }}
        walletType={WALLET_TYPE.fortmatic}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletLinkConnector({
            appName: 'Nouns.WTF',
            appLogoUrl: 'https://nouns.wtf/static/media/logo.cdea1650.svg',
            url: config.rinkebyJsonRpc,
            supportedChainIds: [config.supportedChainId],
          });
          activate(walletlink);
        }}
        walletType={WALLET_TYPE.walletconnect}
      />
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({ 
            supportedChainIds: [config.supportedChainId]
           });
          activate(injected);
        }}
        walletType={WALLET_TYPE.brave}
      />
      {/* <WalletButton
        onClick={() => {
          const ledger = new LedgerConnector({
            //TODO: refactor
            chainId: config.supportedChainId,
            url: config.rinkebyJsonRpc,
          });
          activate(ledger);
        }}
        walletType={WALLET_TYPE.ledger}
      /> */}
      <WalletButton
        onClick={() => {
          const trezor = new TrezorConnector({
            // TODO: refactor
            chainId: config.supportedChainId,
            url: config.rinkebyJsonRpc,
            manifestAppUrl: 'nounops+trezorconnect@protonmail.com',
            manifestEmail: 'https://nouns.wtf',
          });
          activate(trezor);
        }}
        walletType={WALLET_TYPE.trezor}
      />
    </>
  );
  return <Modal title="Connect your wallet" content={wallets} onDismiss={onDismiss} />;
};
export default WalletConnectModal;
