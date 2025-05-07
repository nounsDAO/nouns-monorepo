import React, { Component } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { blo } from 'blo';
import { Address } from '@/utils/types';

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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    return (
      <>
        {this.state.fallback ? (
          <div
            style={{
              width: this.props.size,
              height: this.props.size,
              borderRadius: '50%',
              backgroundColor: '#' + this.props.address.slice(2, 8), // Simple visualization based on address
            }}
          />
        ) : (
          <img
            alt={this.props.address}
            src={blo(this.props.address as Address)}
            width={this.props.size}
            height={this.props.size}
            style={{ borderRadius: '50%' }}
          />
        )}
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
