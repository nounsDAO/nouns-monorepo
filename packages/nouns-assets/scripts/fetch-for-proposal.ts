import { PNGCollectionEncoder } from '@nouns/sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { readPngImage } from './utils';
import { palette } from '../src/image-data.json';
import { deflateRawSync } from 'zlib';
import { ethers } from 'ethers';

export function dataToDescriptorInput(data: string[]): {
  encodedCompressed: string;
  originalLength: number;
  itemCount: number;
} {
  const abiEncoded = ethers.utils.defaultAbiCoder.encode(['bytes[]'], [data]);
  const encodedCompressed = `0x${deflateRawSync(
    Buffer.from(abiEncoded.substring(2), 'hex'),
  ).toString('hex')}`;

  const originalLength = abiEncoded.substring(2).length / 2;
  const itemCount = data.length;

  return {
    encodedCompressed,
    originalLength,
    itemCount,
  };
}

/**
 * @notice creates an additional art json file. it assumes it's not the first one.
 *   it also assumes the existing palette from the first one has all the needed colors.
 * @sourceFolder a folder containing subfolders with the names: ['1-bodies', '2-accessories', '3-heads', '4-glasses']
 * @destinationFilepath where to save the new json file
 */
// const fetch = async (sourceFolder: string, destinationFilepath: string) => {

//   const { images } = ImageData;
//   const { accessories, heads } = images;

//   // const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
//   const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
//   // const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
//   const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));

//   const bodyObj = {
//     // encodedCompressed: bodiesPage.encodedCompressed,
//     // originalLength: bodiesPage.originalLength,
//     // itemCount: bodiesPage.itemCount
//   };

//   const accessoriesObj = {
//     encodedCompressed: accessoriesPage.encodedCompressed,
//     originalLength: accessoriesPage.originalLength,
//     itemCount: accessoriesPage.itemCount
//   };

//   const headsObj = {
//     encodedCompressed: headsPage.encodedCompressed,
//     originalLength: headsPage.originalLength,
//     itemCount: headsPage.itemCount
//   };

//   const glassesObj = {
//     // encodedCompressed: glassesPage.encodedCompressed,
//     // originalLength: glassesPage.originalLength,
//     // itemCount: glassesPage.itemCount
//   };

//   console.log(
//     `bodyObj: ${JSON.stringify(bodyObj)} \n\n accessoriesObj: ${JSON.stringify(accessoriesObj)} \n\n headsObj: ${JSON.stringify(headsObj)} \n\n glassesObj: ${JSON.stringify(glassesObj)}`,
//   );

// };

// fetch(process.argv[2], process.argv[3]);

const fetch = async (sourceFilepath: string, destinationFilepath: string) => {
  // const { images } = ImageData;
  // const { accessories, heads, backgrounds, glasses } = images;

  const SOURCE = path.join(__dirname, '../src/image-data-nouns-v2.json');

  const imageData = await fs.readFile(SOURCE, 'utf-8');
  const { images } = JSON.parse(imageData);

  const dataToDescriptorInput = (data: string[]) => {
    const abiEncoded = ethers.utils.defaultAbiCoder.encode(['bytes[]'], [data]);
    const encodedCompressed = `0x${deflateRawSync(
      Buffer.from(abiEncoded.substring(2), 'hex'),
    ).toString('hex')}`;

    const originalLength = abiEncoded.substring(2).length / 2;
    const itemCount = data.length;

    return {
      encodedCompressed,
      originalLength,
      itemCount,
    };
  };

  const objects = [];

  for (const key in images) {
    if (Object.prototype.hasOwnProperty.call(images, key)) {
      const asset = images[key];
      if (asset) {
        const assetPage = dataToDescriptorInput(asset.map(({ data }: { data: string }) => data));
        objects.push({
          [key]: {
            encodedCompressed: assetPage.encodedCompressed,
            originalLength: assetPage.originalLength,
            itemCount: assetPage.itemCount,
          },
        });
      }
    }
  }

  console.log(`OBJ: ${JSON.stringify(objects)}`);

  // Write objects to destination filepath
  await fs.writeFile(destinationFilepath, JSON.stringify(objects, null, 2));
};

fetch(process.argv[2], process.argv[3]);
