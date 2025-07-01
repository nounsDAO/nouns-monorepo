import { createConfig, factory } from 'ponder';
import { getAbiItem } from 'viem';

import { NounsAuctionHouseV2Abi } from './abis/NounsAuctionHouseV2Abi';
import { NounsDAOV4Abi } from './abis/NounsDAOV4Abi';
import { NounsTokenAbi } from './abis/NounsTokenAbi';
import { streamAbi } from './abis/StreamAbi';
import { streamFactoryAbi } from './abis/StreamFactoryAbi';

export default createConfig({
  chains: {
    mainnet: { id: 1, rpc: process.env.PONDER_RPC_URL_1, ws: process.env.PONDER_WS_URL_1 },
  },
  contracts: {
    NounsAuctionHouseV2: {
      chain: 'mainnet',
      address: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
      abi: NounsAuctionHouseV2Abi,
      startBlock: 12985451,
    },
    NounsToken: {
      chain: 'mainnet',
      address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
      abi: NounsTokenAbi,
      startBlock: 12985438,
    },
    NounsDAOV4: {
      chain: 'mainnet',
      address: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
      abi: NounsDAOV4Abi,
      startBlock: 12985453,
    },
    StreamFactory: {
      chain: 'mainnet',
      address: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
      abi: streamFactoryAbi,
      startBlock: 16576500,
    },

    Stream: {
      chain: 'mainnet',
      address: factory({
        address: '0x0fd206FC7A7dBcD5661157eDCb1FFDD0D02A61ff',
        event: getAbiItem({ abi: streamFactoryAbi, name: 'StreamCreated' }),
        parameter: getAbiItem({ abi: streamFactoryAbi, name: 'StreamCreated' }).inputs[7].name,
      }),
      abi: streamAbi,
      startBlock: 16576500,
    },
    // NounsDAOData: {
    //   network: "mainnet",
    //   address: "0xf790A5f59678dd733fb3De93493A91f472ca1365",
    //   abi: NounsDAODataAbi,
    //   startBlock: 17812145,
    // },
  },
});
