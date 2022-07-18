import { ImageData } from '@nouns/sdk/src/image/types';
import { promises as fs } from 'fs';

/**
 * Appends an image-data.json file to an existing one.
 * The purpose is for the webapp to have one file with all the art, not split to pages like in the contracts storage
 */
const merge = async (baseFile: string, newFile: string, destinationFile: string) => {
  const baseData: ImageData = JSON.parse((await fs.readFile(baseFile)).toString());
  const newData: ImageData = JSON.parse((await fs.readFile(newFile)).toString());

  for (const [k, v] of Object.entries(newData.images)) {
    baseData.images[k].push(...v);
  }

  await fs.writeFile(destinationFile, JSON.stringify(baseData, null, 2));
  console.log(`Wrote merged file to: ${destinationFile}`);
};

merge(process.argv[2], process.argv[3], process.argv[4]);
