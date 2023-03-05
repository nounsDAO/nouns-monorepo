import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import * as fs from 'fs';


task('metadata-stats-2', 'Gather punks statistics from seeds')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853',
    types.string,
  )
  .setAction(async ({ nToken }, { ethers }) => {

    const nftFactory = await ethers.getContractFactory('NToken');
    const nftContract = nftFactory.attach(nToken);

    const nSeeder = await nftContract.seeder();
    const nSeederFactory = await ethers.getContractFactory('NSeeder');
    const nSeederContract = nSeederFactory.attach(nSeeder);

    const types = [0,0,0,0,0];
    const skins = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
    const accCount = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    const accTypes = [Array(14).fill(0), Array(14).fill(0), Array(14).fill(0), Array(14).fill(0), Array(14).fill(0)]

    for (let i = 0; i < 100_000; i++) {
      let stringNumber = (i).toString(16);
      if (stringNumber.length % 2 == 1) {
        stringNumber = '0' + stringNumber;
      }
      stringNumber = '0x' + stringNumber
      const randomNumber = ethers.BigNumber.from(ethers.utils.keccak256(stringNumber));
      const seed = await nSeederContract.generateSeedFromNumber(randomNumber);
      types[seed[0]] ++;
      skins[seed[0]][seed[1]] ++;
      accCount[seed[0]][seed[2].length] ++;
      for (const acc of seed[2]) {
        accTypes[seed[0]][acc[0]] ++;
      }
      if (i %  10_000 == 9_999) {
        console.log("types are: male, female, alien, ape, zombie");
        console.log("types", types);
        console.log("skin tones are: albino, light, mid, dark, green, brown, blue");
        console.log("skin tones per type", skins);
        console.log("accessories count per punk are: 0 accessories, 1 accessory, 2 accessories, ..., 7 accessories")
        console.log("accCount per type", accCount);
        console.log("acc types are: neck, cheeks, face, lips, emotion, beard, teeth, ears, hat, hair, mouth, glasses, eyes, nose");
        console.log("accTypes per type", accTypes);
      }
    }

    console.log("types are: male, female, alien, ape, zombie");
    console.log("types", types);
    console.log("skin tones are: albino, light, mid, dark, green, brown, blue");
    console.log("skin tones per type", skins);
    console.log("accessories count per punk are: 0 accessories, 1 accessory, 2 accessories, ..., 7 accessories")
    console.log("accCount per type", accCount);
    console.log("acc types are: neck, cheeks, face, lips, emotion, beard, teeth, ears, hat, hair, mouth, glasses, eyes, nose");
    console.log("accTypes per type", accTypes);
  });