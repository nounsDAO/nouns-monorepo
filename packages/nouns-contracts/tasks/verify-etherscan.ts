import { task } from 'hardhat/config';

type ContractName =
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
  NounsDescriptor: {
    address: '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
  },
  NounsSeeder: {
    address: '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
  },
  NounsToken: {
    address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
    constructorArguments: [
      '0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5',
      '0x830BD73E4184ceF73443C15111a1DF14e495C706',
      '0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63',
      '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515',
      '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    ],
  },
  NounsAuctionHouse: {
    address: '0xF15a943787014461d94da08aD4040f79Cd7c124e',
  },
  NounsAuctionHouseProxyAdmin: {
    address: '0xC1C119932d78aB9080862C5fcb964029f086401e',
  },
  NounsAuctionHouseProxy: {
    address: '0x830BD73E4184ceF73443C15111a1DF14e495C706',
    constructorArguments: [
      '0x2C128FF70de543A3d20f56a8241a6a1E6541C7BA',
      '0x4cF3a897D8B3D854B87875882278B4c09dDA40c9',
      '0x87f49f540000000000000000000000009C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000012c00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000001518',
    ],
  },
  NounsDAOExecutor: {
    address: '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
    constructorArguments: ['0x6f3E6272A167e8AcCb32072d08E0957F9c79223d', 172800],
  },
  NounsDAOLogicV1: {
    address: '0xa43aFE317985726E4e194eb061Af77fbCb43F944',
  },
  NounsDAOProxy: {
    address: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
    constructorArguments: [
      '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
      '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
      '0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5',
      '0x0BC3807Ec262cB779b38D65b38158acC3bfedE10',
      '0xa43aFE317985726E4e194eb061Af77fbCb43F944',
      19710,
      13140,
      500,
      1000,
    ],
  },
};

const mumbaiContracts: Record<ContractName, VerifyArgs> = {
  NounsDescriptor: {
    address: '0x4E0F5EDE0f549EED428D61D0487E34bbDB776520',
  },
  NounsSeeder: {
    address: '0xE8C16bF481bA4b2fF5f8463ea0367DB907F856a9',
  },
  NounsToken: {
    address: '0x000e5e8F1F71052F514295960F4D9fE4378974ca',
    constructorArguments: [
      '0x747077E892A9d719D30F4D2c1Dad4Fa506Db3108',
      '0xC9b0D2E57E249692BD2B9e7FC0DFB4D5DbFD5158',
      '0x9348ae989088a779806CBCd67b85a7630f40CD05',
      '0x4E0F5EDE0f549EED428D61D0487E34bbDB776520',
      '0xE8C16bF481bA4b2fF5f8463ea0367DB907F856a9',
      '0x58807baD0B376efc12F5AD86aAc70E78ed67deaE',
    ],
  },
  NounsAuctionHouse: {
    address: '0xB882D5Da7a3CEcC67B0cdF1aA745FB6B6aed31A8',
  },
  NounsAuctionHouseProxyAdmin: {
    address: '0xe1322dFF1b5098484AB578DDA2929399981c711e',
  },
  NounsAuctionHouseProxy: {
    address: '0xC9b0D2E57E249692BD2B9e7FC0DFB4D5DbFD5158',
    constructorArguments: [
      '0xB882D5Da7a3CEcC67B0cdF1aA745FB6B6aed31A8',
      '0xe1322dFF1b5098484AB578DDA2929399981c711e',
      '0x87f49f54000000000000000000000000000e5e8f1f71052f514295960f4d9fe4378974ca0000000000000000000000009c3c9283d3e44854697cd22d3faa240cfb032889000000000000000000000000000000000000000000000000000000000000012c000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000015180',
    ],
  },
  NounsDAOExecutor: {
    address: '0xF9842b376BC2978Ec48B76ba50dAd45eE1D0CdA7',
    constructorArguments: ['0xd9A3F32Fd329Af93BbF4dd89Eb89Aa636b80FC4C', 172800],
  },
  NounsDAOLogicV1: {
    address: '0xD0c31E41CBf3389572E8F786CD825A22fB15A02F',
  },
  NounsDAOProxy: {
    address: '0xd9A3F32Fd329Af93BbF4dd89Eb89Aa636b80FC4C',
    constructorArguments: [
      '0xF9842b376BC2978Ec48B76ba50dAd45eE1D0CdA7',
      '0x000e5e8F1F71052F514295960F4D9fE4378974ca',
      '0x747077E892A9d719D30F4D2c1Dad4Fa506Db3108',
      '0xF9842b376BC2978Ec48B76ba50dAd45eE1D0CdA7',
      '0xD0c31E41CBf3389572E8F786CD825A22fB15A02F',
      17280,
      1,
      500,
      1000,
    ],
  },
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan').setAction(async (_, hre) => {
  const network = await hre.ethers.provider.getNetwork();

  // TODO: update if you want to support another testnet
  const _contracts = network.chainId === 1 ? contracts : mumbaiContracts;

  for (const [name, args] of Object.entries(_contracts)) {
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
