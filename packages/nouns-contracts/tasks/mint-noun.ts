import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-nounbr', 'Mints a NounBR')
  .addOptionalParam(
    'nounsbrToken',
    'The `NounsBRToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ nounsbrToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NounsBRToken');
    const nftContract = nftFactory.attach(nounsbrToken);

    const receipt = await (await nftContract.mint()).wait();
    const nounbrCreated = receipt.events?.[1];
    const { tokenId } = nounbrCreated?.args as Result;

    console.log(`NounBR minted with ID: ${tokenId.toString()}.`);
  });
