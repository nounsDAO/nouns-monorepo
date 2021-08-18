import { task } from 'hardhat/config';

type ContractName =
  | 'NFTDescriptor'
  | 'NounsDescriptor'
  | 'NounsSeeder'
  | 'NounsToken'
  | 'NounsAuctionHouse'
  | 'NounsAuctionHouseProxyAdmin'
  | 'NounsDAOExecutor'
  | 'NounsDAOLogicV1'
  | 'NounsDAOProxy'
  | 'NounsAuctionHouseProxy';

interface VerifyArgs {
  address: string;
  constructorArguments?: (string | number)[];
  libraries?: Record<string, string>;
}

const contracts: Record<ContractName, VerifyArgs> = {
  NFTDescriptor: {
    address: '0xd72C2172FAE870DA70f11bA44F10DCFE4149959d',
  },
  NounsDescriptor: {
    address: '0x829a49e81c37d94277B92c6C857E51e18e28fdD8',
    libraries: {
      NFTDescriptor: '0xd72C2172FAE870DA70f11bA44F10DCFE4149959d',
    },
  },
  NounsSeeder: {
    address: '0x8d401dAa496F2a80E9067Eb0e9f2C270c8B10f76',
  },
  NounsToken: {
    address: '0xfC40A203C1ed9F4985a73a10Df818ec9620083E3',
    constructorArguments: [
      '0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5',
      '0xE83d46D049679dD9b2736c2F4c6a75f64eAd0394',
      '0x829a49e81c37d94277B92c6C857E51e18e28fdD8',
      '0x8d401dAa496F2a80E9067Eb0e9f2C270c8B10f76',
      '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    ],
  },
  NounsAuctionHouse: {
    address: '0x2C128FF70de543A3d20f56a8241a6a1E6541C7BA',
  },
  NounsAuctionHouseProxyAdmin: {
    address: '0x4cF3a897D8B3D854B87875882278B4c09dDA40c9',
  },
  NounsAuctionHouseProxy: {
    address: '0xE83d46D049679dD9b2736c2F4c6a75f64eAd0394',
    constructorArguments: [
      '0x2C128FF70de543A3d20f56a8241a6a1E6541C7BA',
      '0x4cF3a897D8B3D854B87875882278B4c09dDA40c9',
      '0x87f49f54000000000000000000000000fc40a203c1ed9f4985a73a10df818ec9620083e3000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000012c00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000001518',
    ],
  },
  NounsDAOExecutor: {
    address: '0x8C2730a9832c4d0C7690380E5E0D55C506e8B7DF',
    constructorArguments: ['0xc0b6662F16786E9352679710cFE16898d89Caf1F', 172800],
  },
  NounsDAOLogicV1: {
    address: '0x878eCe18EA234C440A105020808b229A3F946EC9',
  },
  NounsDAOProxy: {
    address: '0xc0b6662F16786E9352679710cFE16898d89Caf1F',
    constructorArguments: [
      '0x8C2730a9832c4d0C7690380E5E0D55C506e8B7DF',
      '0xfC40A203C1ed9F4985a73a10Df818ec9620083E3',
      '0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5',
      '0x8C2730a9832c4d0C7690380E5E0D55C506e8B7DF',
      '0x878eCe18EA234C440A105020808b229A3F946EC9',
      19710,
      13140,
      500,
      1000,
    ],
  },
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan').setAction(async (_, hre) => {
  for (const [name, args] of Object.entries(contracts)) {
    console.log(`verifying ${name}...`);
    try {
      await hre.run('verify:verify', {
        ...args,
      });
    } catch (e) {
      console.error(e);
    }
  }
});
