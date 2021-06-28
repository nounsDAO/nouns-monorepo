import { task, types } from 'hardhat/config';

task('mint-noun', 'Mints a Noun')
  .addOptionalParam(
    'nounsERC721',
    'The `NounsERC721` contract address',
    '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    types.string,
  )
  .setAction(async ({ nounsERC721 }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NounsERC721');
    const nftContract = nftFactory.attach(nounsERC721);

    const receipt = await (await nftContract.mint()).wait();
    const nounCreated = receipt.events?.[1];
    const { tokenId } = nounCreated?.args;

    console.log(`Noun minted with ID: ${tokenId.toString()}.`);
  });
