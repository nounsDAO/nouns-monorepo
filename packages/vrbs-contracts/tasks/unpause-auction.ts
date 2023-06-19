import { task, types } from 'hardhat/config';

task('unpause-auction', 'Unpause the auction')
  .addOptionalParam(
    'vrbsAuctionHouse',
    'The `AuctionHouse` contract address',
    '0x2aE62d59B775c5037023D434E1f4a2c07077776d',
    types.string,
  )
  .setAction(async ({ vrbsAuctionHouse }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('AuctionHouse');
    const nftContract = nftFactory.attach(vrbsAuctionHouse);

    await (await nftContract.unpause()).wait();

    console.log(`Success unpaused the auction`);
  });
