import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import * as fs from 'fs';
import probDoc from '../../nouns-assets/src/config/probability.json'
import ImageData from '../files/image-data-v2.json';


const shortPunkType: any = {
    male: "m",
    female: "f",
    alien: "l",
    ape: "p",
    zombie: "z",
}
task('metadata-stats-2', 'Gather punks statistics from seeds')
  .addOptionalParam(
    'nToken',
    'The `NToken` contract address',
    '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
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
    const accTypes = [Array(16).fill(0), Array(16).fill(0), Array(16).fill(0), Array(16).fill(0), Array(16).fill(0)];
    const accIds: Array<Array<Map<number,number>>> = [];
    for (let i = 0; i < 5; i++) {
      const perPunk = [];
      for (let j = 0; j < 16; j++) {
        perPunk.push(new Map());
      }
      accIds.push(perPunk);
    }
    const accNames: Array<Map<string,number>> = [new Map(), new Map(), new Map(), new Map(), new Map()];

    const { palette, images } = ImageData;
    const { necks, cheekses, faces, beards, mouths, earses, hats, helmets, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;
    const orderedAccNames = [necks, cheekses, faces, lipses, emotions, teeths, beards, earses, hats, helmets, hairs, mouths, glasseses, goggleses, eyeses, noses];

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
        let currAccIdCount = accIds[seed[0]][acc[0]].get(acc[1]);
        if (currAccIdCount === undefined) {
          currAccIdCount = 1;
        } else {
          currAccIdCount = currAccIdCount + 1;
        }
        accIds[seed[0]][acc[0]].set(acc[1], currAccIdCount);
        const accName = orderedAccNames[acc[0]][acc[1]].filename;
        accNames[seed[0]].set(accName, currAccIdCount);
      }
      if (i %  10_000 == 9_999) {
        console.log("----------------------------------------------------------------");
        console.log("types are: male, female, alien, ape, zombie");
        console.log("types", types);
        console.log("skin tones are: albino, light, mid, dark, green, brown, blue");
        console.log("skin tones per type", skins);
        console.log("accessories count per punk are: 0 accessories, 1 accessory, 2 accessories, ..., 7 accessories")
        console.log("accCount per type", accCount);
        console.log("acc types are: neck, cheeks, face, lips, emotion, beard, teeth, ears, hat, helmet, hair, mouth, glasses, goggles, eyes, nose");
        console.log("accTypes per type", accTypes);
//         console.log("accIds per punk type per acc type", accIds);
        console.log("accNames per punk type", accNames);
        console.log("----------------------------------------------------------------");
      }
    }

    console.log("types are: male, female, alien, ape, zombie");
    console.log("types", types);
    console.log("skin tones are: albino, light, mid, dark, green, brown, blue");
    console.log("skin tones per type", skins);
    console.log("accessories count per punk are: 0 accessories, 1 accessory, 2 accessories, ..., 7 accessories")
    console.log("accCount per type", accCount);
    console.log("acc types are: neck, cheeks, face, lips, emotion, beard, teeth, ears, hat, helmet, hair, mouth, glasses, goggles, eyes, nose");
    console.log("accTypes per type", accTypes);
//     console.log("accIds per punk type per acc type", accIds);
    console.log("accNames per punk type", accNames);
  });
