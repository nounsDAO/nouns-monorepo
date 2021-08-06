import Modal from '../Modal';
import WalletButton from '../WalletButton';
import { WALLET_TYPE } from '../WalletButton';

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = props => {
  const { onDismiss } = props;

  const wallets = (
    <>
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.metamask} />
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.fortmatic} />
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.walletconnect} />
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.brave} />
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.ledger} />
      <WalletButton onClick={() => {}} walletType={WALLET_TYPE.trezor} />
    </>
  );
  return <Modal title="Connect your wallet" content={wallets} onDismiss={onDismiss} />;
};
export default WalletConnectModal;
