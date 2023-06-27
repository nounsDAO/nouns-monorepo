import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-punk', 'Mints a Punk')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
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
