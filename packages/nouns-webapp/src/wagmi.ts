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
    ...(import.meta.env.VITE_MAINNET_WSRPC ? [webSocket(import.meta.env.VITE_MAINNET_WSRPC)] : []),
    ...(import.meta.env.VITE_MAINNET_JSONRPC ? [http(import.meta.env.VITE_MAINNET_JSONRPC)] : []),
  ]),
  [sepolia.id]: fallback([
    ...(import.meta.env.VITE_SEPOLIA_WSRPC ? [webSocket(import.meta.env.VITE_SEPOLIA_WSRPC)] : []),
    ...(import.meta.env.VITE_SEPOLIA_JSONRPC ? [http(import.meta.env.VITE_SEPOLIA_JSONRPC)] : []),
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
