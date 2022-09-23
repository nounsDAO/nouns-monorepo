import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-punk', 'Mints a Punk')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ nToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NToken');
    const nftContract = nftFactory.attach(nToken);

    const receipt = await (await nftContract.mint()).wait();
    const nCreated = receipt.events?.[1];
    const { tokenId } = nCreated?.args as Result;

    console.log(`Punk minted with ID: ${tokenId.toString()}.`);
  });
