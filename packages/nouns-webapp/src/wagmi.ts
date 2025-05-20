import { find, pipe } from 'remeda';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { CHAIN_ID, WALLET_CONNECT_V2_PROJECT_ID } from './config';

const activeChainId = Number(CHAIN_ID);

const activeChain =
  pipe(
    [mainnet, sepolia],
    find(chain => chain.id === activeChainId),
  ) ?? sepolia;

const mainnetRpcUrl = process.env.VITE_MAINNET_JSONRPC ?? '';
const sepoliaRpcUrl = process.env.VITE_SEPOLIA_JSONRPC ?? '';

export const config = createConfig({
  chains: [activeChain],
  transports: {
    [mainnet.id]: http(mainnetRpcUrl),
    [sepolia.id]: http(sepoliaRpcUrl),
  },
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

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
