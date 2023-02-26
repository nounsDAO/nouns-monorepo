import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-punk', 'Mints a Punk')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    types.string,
  )
  .setAction(async ({ nToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NToken');
    const nftContract = nftFactory.attach(nToken);

    const receipt = await (await nftContract.mint()).wait();
    console.log(receipt)
    const nCreated = receipt.events?.[1];
    const { tokenId } = nCreated?.args as Result;

    console.log(`Punk minted with ID: ${tokenId.toString()}.`);
  });
