import { defineConfig } from '@wagmi/cli';
import { actions, etherscan, react } from '@wagmi/cli/plugins';
import 'dotenv/config';
import { mainnet, sepolia } from 'wagmi/chains';

export default defineConfig({
  out: 'src/contracts/index.ts',
  contracts: [],
  plugins: [
    etherscan({
      apiKey: process.env.VITE_ETHERSCAN_API_KEY!,
      chainId: mainnet.id,
      contracts: [
        {
          name: 'NounsGovernor',
          address: {
            [mainnet.id]: '0x6f3e6272a167e8accb32072d08e0957f9c79223d',
            [sepolia.id]: '0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57',
          },
        },
        {
          name: 'NounsTreasury',
          address: {
            [mainnet.id]: '0xb1a32fc9f9d8b2cf86c068cae13108809547ef71',
            [sepolia.id]: '0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28',
          },
        },
        {
          name: 'NounsData',
          address: {
            [mainnet.id]: '0xf790a5f59678dd733fb3de93493a91f472ca1365',
            [sepolia.id]: '0x9040f720aa8a693f950b9cf94764b4b06079d002',
          },
        },
        {
          name: 'NounsToken',
          address: {
            [mainnet.id]: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
            [sepolia.id]: '0x4c4674bb72a096855496a7204962297bd7e12b85',
          },
        },
        {
          name: 'NounsAuctionHouse',
          address: {
            [mainnet.id]: '0x830bd73e4184cef73443c15111a1df14e495c706',
            [sepolia.id]: '0x488609b7113fcf3b761a05956300d605e8f6bcaf',
          },
        },
        {
          name: 'NounsDescriptor',
          address: {
            [mainnet.id]: '0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac',
            [sepolia.id]: '0x79e04ebcdf1ac2661697b23844149b43acc002d5',
          },
        },
      ],
      tryFetchProxyImplementation: true,
    }),
    react(),
    actions(),
  ],
});
