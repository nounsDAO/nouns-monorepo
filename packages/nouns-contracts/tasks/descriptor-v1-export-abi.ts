import { writeFileSync } from 'fs';
import { task, types } from 'hardhat/config';
import path from 'path';
import ImageData from '../files/image-data-v1.json';

task(
  'descriptor-v1-export-abi',
  'Exports the image-data to abi files to be able to load from forge tests',
)
  .addOptionalParam(
    'exportPath',
    'Where to save abi encoded files to be used in forge tests',
    path.join(__dirname, '../test/foundry/files/descriptor_v1/'),
  )
  .setAction(async ({ exportPath }, { ethers }) => {
    const { bgcolors, palette, images } = ImageData;
    let { bodies, accessories, heads, glasses } = images;

    const abiEncoded = ethers.utils.defaultAbiCoder.encode(
      ['string[]', 'string[]', 'bytes[]', 'bytes[]', 'bytes[]', 'bytes[]'],
      [
        bgcolors,
        palette,
        bodies.map(({ data }) => data),
        accessories.map(({ data }) => data),
        heads.map(({ data }) => data),
        glasses.map(({ data }) => data),
      ],
    );

    const filepath = path.join(exportPath, 'image-data.abi');
    writeFileSync(filepath, abiEncoded);
    console.log(`Saved image-data to ${filepath}`);
  });
