import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('mint-n00un', 'Mints a N00un')
  .addOptionalParam(
    'vrbsToken',
    'The `N00unsToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ vrbsToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('N00unsToken');
    const nftContract = nftFactory.attach(vrbsToken);

    const receipt = await (await nftContract.mint()).wait();
    const n00unCreated = receipt.events?.[1];
    const { tokenId } = n00unCreated?.args as Result;

    console.log(`N00un minted with ID: ${tokenId.toString()}.`);
  });
