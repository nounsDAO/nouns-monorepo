import { createConfig, http } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';

export default {
  baseUri: process.env.NEXT_PUBLIC_BASE_URI,
  mainnetBlockDurationSeconds: 12,
} as const;

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.JSON_RPC),
  },
});
