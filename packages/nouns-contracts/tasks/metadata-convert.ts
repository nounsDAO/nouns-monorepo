import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import * as fs from 'fs';
import probDoc from '../../nouns-assets/src/config/probability.json'
import ImageData from '../files/image-data-v2.json';


task('metadata-convert', 'Convert seeds from generated punks to something more readable')
  .setAction(async ({ }, { ethers }) => {

    const { palette, images } = ImageData;
    const { necks, cheekses, faces, beards, mouths, earses, hats, helmets, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;
    const orderedAccNames = [necks, cheekses, faces, lipses, emotions, teeths, beards, earses, hats, helmets, hairs, mouths, glasseses, goggleses, eyeses, noses];

    for (let i = 0; i < 10_000; i++) {
      const fileContent = fs.readFileSync("./output/seeds/seed_" + i + ".json", "utf8");
      const seed = JSON.parse(fileContent)["seed"];

      const seedConverted = [probDoc.types[seed[0]], probDoc.skins[seed[1]]];
      for (let acc of seed[2]) {
        seedConverted.push(orderedAccNames[acc[0]][acc[1]].filename);
      }
      console.log(seedConverted.join(','));
    }

  });