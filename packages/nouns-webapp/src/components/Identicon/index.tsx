import Davatar, { Image } from '@davatar/react';
import { Web3Provider } from '@ethersproject/providers';
import { Component } from 'react';

interface IdenticonInnerProps {
  address: string;
  provider: Web3Provider;
  size: number;
}

interface IdenticonOutterProps {
  address: string;
  provider?: Web3Provider;
  size?: number;
}

class IdenticonInner extends Component<IdenticonInnerProps> {
  state: { fallback: boolean } = { fallback: false };

  static getDerivedStateFromError() {
    // use Jazzicon if Davatar throws;
    return { fallback: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  renderDavatar(address: string, provider: Web3Provider, size: number) {
    return <Davatar address={address} size={size} provider={provider} />;
  }

  renderJazzicon(address: string, size: number) {
    return <Image address={address} size={size} />;
  }

  render() {
    return (
      <>
        {this.state.fallback
          ? this.renderJazzicon(this.props.address, this.props.size)
          : this.renderDavatar(this.props.address, this.props.provider, this.props.size)}
      </>
    );
  }
}

const Identicon: React.FC<IdenticonOutterProps> = props => {
  const { size, address, provider } = props;

  if (!provider) {
    return <></>;
  }

  return <IdenticonInner size={size ?? 24} address={address} provider={provider} />;
};

export default Identicon;
