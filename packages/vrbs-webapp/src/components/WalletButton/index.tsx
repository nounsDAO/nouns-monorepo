import { Button } from 'react-bootstrap';
import classes from './WalletButton.module.css';
import metamaskLogo from '../../assets/wallet-brand-assets/metamask-fox.svg';
import fortmaticLogo from '../../assets/wallet-brand-assets/fortmatic.svg';
import walletconnectLogo from '../../assets/wallet-brand-assets/walletconnect-logo.svg';
import braveLogo from '../../assets/wallet-brand-assets/brave.svg';
import ledgerLogo from '../../assets/wallet-brand-assets/ledger.svg';
import trezorLogo from '../../assets/wallet-brand-assets/trezor.svg';
import coinbaseWalletLogo from '../../assets/wallet-brand-assets/coinbase-wallet-dot.svg';

export enum WALLET_TYPE {
  metamask = 'Metamask',
  brave = 'Brave',
  ledger = 'Ledger',
  walletconnect = 'WalletConnect',
  fortmatic = 'Fortmatic',
  trezor = 'Trezor',
  coinbaseWallet = 'Coinbase Wallet',
}

const logo = (walletType: WALLET_TYPE) => {
  switch (walletType) {
    case WALLET_TYPE.metamask:
      return metamaskLogo;
    case WALLET_TYPE.fortmatic:
      return fortmaticLogo;
    case WALLET_TYPE.walletconnect:
      return walletconnectLogo;
    case WALLET_TYPE.brave:
      return braveLogo;
    case WALLET_TYPE.ledger:
      return ledgerLogo;
    case WALLET_TYPE.trezor:
      return trezorLogo;
    case WALLET_TYPE.coinbaseWallet:
      return coinbaseWalletLogo;
    default:
      return '';
  }
};

const WalletButton: React.FC<{ onClick: () => void; walletType: WALLET_TYPE }> = props => {
  const { onClick, walletType } = props;

  return (
    <Button className={classes.walletButton} onClick={onClick}>
      <img src={logo(walletType)} alt={`${walletType} logo`} />
      {walletType}
    </Button>
  );
};
export default WalletButton;
