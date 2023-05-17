import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';

task('generate-metadata', 'Generates virtual Metadata')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    types.string,
  )
  .setAction(async ({ nToken }, { ethers }) => {
//     const randomNumber = '972416539812324512364354326547893581';
    const randomNumber = ethers.BigNumber.from(ethers.utils.keccak256('0x9f'));
//     const randomNumber = ethers.BigNumber.from(ethers.utils.randomBytes(32));
    const tokenId = 1;

    const nftFactory = await ethers.getContractFactory('NToken');
    const nftContract = nftFactory.attach(nToken);

    const nSeeder = await nftContract.seeder();
    const nSeederFactory = await ethers.getContractFactory('NSeeder');
    const nSeederContract = nSeederFactory.attach(nSeeder);

    const descriptor = await nftContract.descriptor();
    const descriptorFactory = await ethers.getContractFactory('NDescriptorV2', { libraries: { NFTDescriptorV2: ethers.constants.AddressZero } });
    const descriptorContract = descriptorFactory.attach(descriptor);

    const seed = await nSeederContract.generateSeedFromNumber(randomNumber);
//     const seed =
// 	       {
// 	             punkType: 3,
//                  skinTone: 5,
//                  accessories: [
// 	               {
// 		            accType: 4,
//                     accId: 0,
//                    },
// 	               {
// 		            accType: 7,
//                     accId: 0,
//                    },
// 	               {
// 		            accType: 12,
//                     accId: 0,
//                    },
// 		         ],
//                };
    console.log('Generated Seed: ', seed);

//    const parts = await descriptorContract.getPartsForSeed(seed, {gasLimit: 100_000_000});
//    console.log('parts', parts);

//    const tokenMetadata = await descriptorContract.tokenURI(tokenId, seed);
//    console.log(`Generated Metadata: ${tokenMetadata}`);

    console.log(await descriptorContract.estimateGas.generateSVGImage(seed, {gasLimit: 100_000_000}));
    const tokenImage = await descriptorContract.generateSVGImage(seed, {gasLimit: 100_000_000});
    console.log(`Generated Image: ${tokenImage}`);
  });