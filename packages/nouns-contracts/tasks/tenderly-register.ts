import { task, types } from 'hardhat/config';
// import hre from 'hardhat';

task('tenderly-register', 'Register contract source code to tenderly dashboard.').setAction(
  async (args, { ethers }) => {
    // hre.tenderly.persistArtifacts([
    //   {
    //     name: 'NToken',
    //     address: '0xc1ED69A6793699BA5D896b329FFED92b1F4D505C',
    //   },
    //   {
    //     name: 'NSeeder',
    //     address: '0xE5EA2Ed69180D9EA821E41b4C377a4984F98e722',
    //   },
    //   {
    //     name: 'NAuctionHouseProxy',
    //     address: '0x8f7103384b1F9d3f5099074F6ADA838c4E69be71',
    //   },
    //   {
    //     name: 'NAuctionHouse',
    //     address: '0xFFD294d4161e0cE9b7623A3d0EB9f53Dfdc6d423',
    //   },
    //   {
    //     name: 'NDescriptor',
    //     address: '0x91541AE2167D67D36b6ac1B06FD4574F93493e6d',
    //   },
    //   {
    //     name: 'NAuctionHouseProxyAdmin',
    //     address: '0x314D3C310036B1F18A501D6b4B580054b2037Dc6',
    //   },
    // ]);
  },
);
