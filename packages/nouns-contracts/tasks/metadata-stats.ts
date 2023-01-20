import { Result } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import * as fs from 'fs';


task('metadata-stats', 'Gather punks statistics from generated metadata')
  .setAction(async ({ }, { ethers }) => {

    const types = [0,0,0,0,0];
    const skins = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]];
    const accCount = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    const accTypes = [Array(14).fill(0), Array(14).fill(0), Array(14).fill(0), Array(14).fill(0), Array(14).fill(0)]

    for (let i = 0; i < 10000; i++) {
      const fileContent = fs.readFileSync("./output/seeds/seed_" + i + ".json", "utf8");
      const seed = JSON.parse(fileContent)["seed"];
      types[seed[0]] ++;
      skins[seed[0]][seed[1]] ++;
      accCount[seed[0]][seed[2].length] ++;
      for (const acc of seed[2]) {
        accTypes[seed[0]][acc[0]] ++;
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