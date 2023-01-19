import { task, types } from 'hardhat/config';

task('unpause-auction', 'Unpause the auction')
  .addOptionalParam(
    'n00unsAuctionHouse',
    'The `N00unsAuctionHouse` contract address',
    '0x2aE62d59B775c5037023D434E1f4a2c07077776d',
    types.string,
  )
  .setAction(async ({ n00unsAuctionHouse }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('N00unsAuctionHouse');
    const nftContract = nftFactory.attach(n00unsAuctionHouse);

    await (await nftContract.unpause()).wait();

    console.log(`Success unpaused the auction`);
  });
