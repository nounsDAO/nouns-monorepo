import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('get-uri', 'Gets a noun uri')
  .addParam('tokenid', 'The noun token id')
  .addOptionalParam(
    'nounstoken',
    'The `NounsToken` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ tokenid, nounstoken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NounsToken');
    const nftContract = nftFactory.attach(nounstoken);

    const uri = await nftContract.tokenURI(tokenid)
    console.log({uri})

  });
