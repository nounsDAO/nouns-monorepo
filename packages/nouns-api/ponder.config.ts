import { nounsAuctionHouseAbi } from '@nouns/sdk/auction-house';
import { nounsTokenAbi } from '@nouns/sdk/token';
import { nounsGovernorAbi } from '@nouns/sdk/governor';
import { nounsStreamFactoryAbi } from '@nouns/sdk/stream-factory';
import { nounsStreamAbi } from '@nouns/sdk/stream';
import { createConfig, factory } from 'ponder';
import { getAbiItem } from 'viem';
import dotenv from 'dotenv';

dotenv.config();

const mainnetConfig = createConfig({
  chains: {
    mainnet: { id: 1, rpc: process.env.PONDER_RPC_URL_1, ws: process.env.PONDER_WS_URL_1 },
  },
  contracts: {
    NounsAuctionHouseV2: {
      chain: 'mainnet',
      address: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
      abi: nounsAuctionHouseAbi,
      startBlock: 12985451,
    },
    NounsToken: {
      chain: 'mainnet',
      address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
      abi: nounsTokenAbi,
      startBlock: 12985438,
    },
    NounsDAOV4: {
      chain: 'mainnet',
      address: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
      abi: nounsGovernorAbi,
      startBlock: 12985453,
    },
    StreamFactory: {
      chain: 'mainnet',
      address: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
      abi: nounsStreamFactoryAbi,
      startBlock: 16576500,
    },

    Stream: {
      chain: 'mainnet',
      address: factory({
        address: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
        event: getAbiItem({ abi: nounsStreamFactoryAbi, name: 'StreamCreated' }),
        parameter: getAbiItem({ abi: nounsStreamFactoryAbi, name: 'StreamCreated' }).inputs[7].name,
      }),
      abi: nounsStreamAbi,
      startBlock: 16576500,
    },
  },
});

const sepoliaConfig = createConfig({
  chains: {
    sepolia: {
      id: 11155111,
      rpc: process.env.PONDER_RPC_URL_11155111,
      ws: process.env.PONDER_WS_URL_11155111,
    },
  },
  contracts: {
    NounsAuctionHouseV2: {
      chain: 'sepolia',
      address: '0x488609b7113FCf3B761A05956300d605E8f6BcAf',
      abi: nounsAuctionHouseAbi,
      startBlock: 3594847,
    },
    NounsToken: {
      chain: 'sepolia',
      address: '0x4C4674bb72a096855496a7204962297bd7e12b85',
      abi: nounsTokenAbi,
      startBlock: 3594846,
    },
    NounsDAOV4: {
      chain: 'sepolia',
      address: '0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57',
      abi: nounsGovernorAbi,
      startBlock: 3594849,
    },
    StreamFactory: {
      chain: 'sepolia',
      address: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
      abi: nounsStreamFactoryAbi,
      startBlock: 2564095,
    },

    Stream: {
      chain: 'sepolia',
      address: factory({
        address: '0xb78ccF3BD015f209fb9B2d3d132FD8784Df78DF5',
        event: getAbiItem({ abi: nounsStreamFactoryAbi, name: 'StreamCreated' }),
        parameter: getAbiItem({ abi: nounsStreamFactoryAbi, name: 'StreamCreated' }).inputs[7].name,
      }),
      abi: nounsStreamAbi,
      startBlock: 2564095,
    },
  },
});

export default process.env.PONDER_CHAIN === 'sepolia' ? sepoliaConfig : mainnetConfig;
