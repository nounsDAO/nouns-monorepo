import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-punk', 'Mints a Punk')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x0165878A594ca255338adfa4d48449f69242Eb8F',
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
