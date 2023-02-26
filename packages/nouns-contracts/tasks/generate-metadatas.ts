import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import * as fs from 'fs';

// Made based on 'genertate-metadata.ts'.

task('generate-metadatas', 'Generates virtual Metadata')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    types.string,
  )
  .setAction(async ({ nToken }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('NToken');
    const nftContract = nftFactory.attach(nToken);

    const nSeeder = await nftContract.seeder();
    const nSeederFactory = await ethers.getContractFactory('NSeeder');
    const nSeederContract = nSeederFactory.attach(nSeeder);

    const descriptor = await nftContract.descriptor();
    const descriptorFactory = await ethers.getContractFactory(
      'NDescriptorV2',
      { libraries: { NFTDescriptorV2: ethers.constants.AddressZero } }
    );
    const descriptorContract = descriptorFactory.attach(descriptor);

    for (let i = 0; i < 10_000; i++) {
      const startTime = new Date().valueOf();

      let stringNumber = (i).toString(16);
      if (stringNumber.length % 2 == 1) {
        stringNumber = '0' + stringNumber;
      }
      stringNumber = '0x' + stringNumber
      const randomNumber = ethers.BigNumber.from(ethers.utils.keccak256(stringNumber));

      const seed = await nSeederContract.generateSeedFromNumber(randomNumber);

      const tokenImage = await descriptorContract.generateSVGImage(
        seed,
        { gasLimit: 1_000_000_000 }
      );
      const encodedImage = Buffer.from(tokenImage, 'base64').toString()

      fs.writeFileSync(
        "./output/svgs/" + Math.floor(i / 1000) + "/punk_" + i + ".svg",
        encodedImage
      );

      const timeDiff = (new Date().valueOf() - startTime) / 1000
      console.log("Iteration: " + i + ". <-> " + "timeDiff: " + timeDiff)
      fs.writeFileSync("./output/seeds/seed_" + i + ".json", JSON.stringify(
        {
          'seed': seed,
          'timeToGenerate': timeDiff,
        }
      ));
    }
  });