import { find, pipe } from 'remeda';
import { createConfig, http, fallback, webSocket } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { CHAIN_ID, WALLET_CONNECT_V2_PROJECT_ID } from './config';

const activeChainId = Number(CHAIN_ID);

const activeChain =
  pipe(
    [mainnet, sepolia],
    find(chain => chain.id === activeChainId),
  ) ?? sepolia;

const transports = {
  [mainnet.id]: fallback([
    ...(process.env.NEXT_PUBLIC_MAINNET_WSRPC !== undefined
      ? [webSocket(process.env.NEXT_PUBLIC_MAINNET_WSRPC)]
      : []),
    ...(process.env.NEXT_PUBLIC_MAINNET_JSONRPC !== undefined
      ? [http(process.env.NEXT_PUBLIC_MAINNET_JSONRPC)]
      : []),
  ]),
  [sepolia.id]: fallback([
    ...(process.env.NEXT_PUBLIC_SEPOLIA_WSRPC !== undefined
      ? [webSocket(process.env.NEXT_PUBLIC_SEPOLIA_WSRPC)]
      : []),
    ...(process.env.NEXT_PUBLIC_SEPOLIA_JSONRPC !== undefined
      ? [http(process.env.NEXT_PUBLIC_SEPOLIA_JSONRPC)]
      : []),
  ]),
};

export const config = createConfig({
  chains: [activeChain],
  transports,
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLET_CONNECT_V2_PROJECT_ID,
      showQrModal: false,
    }),
    coinbaseWallet({
      appName: 'Nouns.WTF',
      appLogoUrl: 'https://nouns.wtf/static/media/logo.cdea1650.svg',
    }),
  ],
});

export const defaultChain = activeChain;

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
