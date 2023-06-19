import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-vrb', 'Mints a Vrb')
  .addOptionalParam(
    'vrbsToken',
    'The `VrbsToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ vrbsToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('VrbsToken');
    const nftContract = nftFactory.attach(vrbsToken);

    const receipt = await (await nftContract.mint()).wait();
    const vrbCreated = receipt.events?.[1];
    const { tokenId } = vrbCreated?.args as Result;

    console.log(`Vrb minted with ID: ${tokenId.toString()}.`);
  });
