import { defineConfig } from '@wagmi/cli';
import { actions, etherscan, react } from '@wagmi/cli/plugins';
import 'dotenv/config';
import { mainnet, sepolia } from 'wagmi/chains';

const contractConfigs = [
  {
    name: 'NounsGovernor',
    fileName: 'nouns-governor',
    address: {
      [mainnet.id]: '0x6f3e6272a167e8accb32072d08e0957f9c79223d',
      [sepolia.id]: '0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57',
    },
  },
  {
    name: 'NounsLegacyTreasury',
    fileName: 'nouns-legacy-treasury',
    address: {
      [mainnet.id]: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
      [sepolia.id]: '0x332db58b51393f3a6b28d4DD8964234967e1aD33',
    },
  },
  {
    name: 'NounsTreasury',
    fileName: 'nouns-treasury',
    address: {
      [mainnet.id]: '0xb1a32fc9f9d8b2cf86c068cae13108809547ef71',
      [sepolia.id]: '0x07e5d6a1550ad5e597a9b0698a474aa080a2fb28',
    },
  },
  {
    name: 'NounsData',
    fileName: 'nouns-data',
    address: {
      [mainnet.id]: '0xf790a5f59678dd733fb3de93493a91f472ca1365',
      [sepolia.id]: '0x9040f720aa8a693f950b9cf94764b4b06079d002',
    },
  },
  {
    name: 'NounsToken',
    fileName: 'nouns-token',
    address: {
      [mainnet.id]: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
      [sepolia.id]: '0x4c4674bb72a096855496a7204962297bd7e12b85',
    },
  },
  {
    name: 'NounsAuctionHouse',
    fileName: 'nouns-auction-house',
    address: {
      [mainnet.id]: '0x830bd73e4184cef73443c15111a1df14e495c706',
      [sepolia.id]: '0x488609b7113fcf3b761a05956300d605e8f6bcaf',
    },
  },
  {
    name: 'NounsDescriptor',
    fileName: 'nouns-descriptor',
    address: {
      [mainnet.id]: '0x33a9c445fb4fb21f2c030a6b2d3e2f12d017bfac',
      [sepolia.id]: '0x79e04ebcdf1ac2661697b23844149b43acc002d5',
    },
  },
  {
    name: 'NounsStreamFactory',
    fileName: 'nouns-stream-factory',
    address: {
      [mainnet.id]: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
      [sepolia.id]: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
    },
  },
  {
    name: 'NounsPayer',
    fileName: 'nouns-payer',
    address: {
      [mainnet.id]: '0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D',
      [sepolia.id]: '0x5a2A0951C6b3479DBEe1D5909Aac7B325d300D94',
    },
  },
  {
    name: 'NounsTokenBuyer',
    fileName: 'nouns-token-buyer',
    address: {
      [mainnet.id]: '0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5',
      [sepolia.id]: '0x821176470cFeF1dB78F1e2dbae136f73c36ddd48',
    },
  },
  {
    name: 'USDC',
    fileName: 'usdc',
    address: {
      [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [sepolia.id]: '0xEbCC972B6B3eB15C0592BE1871838963d0B94278',
    },
  },
  {
    name: 'WETH',
    fileName: 'weth',
    address: {
      [mainnet.id]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      [sepolia.id]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    },
  },
  {
    name: 'stETH',
    fileName: 'steth',
    address: {
      [mainnet.id]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      [sepolia.id]: '0x3e3FE7dBc6B4C189E7128855dD526361c49b40Af',
    },
  },
  {
    name: 'mETH',
    fileName: 'meth',
    address: {
      [mainnet.id]: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
      [sepolia.id]: '0x072d71b257ECa6B60b5333626F6a55ea1B0c451c',
    },
  },
  {
    name: 'mETHStaking',
    fileName: 'meth-staking',
    address: {
      [mainnet.id]: '0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f',
      [sepolia.id]: '0xCAfD88816f07d4FFF671D0aAc5E4c1E29875AB2D',
    },
  },
  {
    name: 'ETHToUSDPriceOracle',
    fileName: 'eth-to-usd-price-oracle',
    address: {
      [mainnet.id]: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      [sepolia.id]: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    },
  },
];

export default defineConfig(() =>
  contractConfigs.map(({ name, fileName, address }) => ({
    out: `src/contracts/${fileName}.gen.ts`,
    plugins: [
      etherscan({
        apiKey: process.env.VITE_ETHERSCAN_API_KEY!,
        chainId: mainnet.id,
        contracts: [
          {
            name,
            address: address as Record<1, `0x${string}`> & Partial<Record<number, `0x${string}`>>,
          },
        ],
        tryFetchProxyImplementation: true,
      }),
      react(),
      actions(),
    ],
  })),
);
