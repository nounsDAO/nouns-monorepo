import { writeFileSync } from 'fs';
import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';
import path from 'path';
import { ethers } from 'ethers';

const saveToFileAbiEncoded = (
  filepath: string,
  traitPage: { encodedCompressed: string; originalLength: number; itemCount: number },
) => {
  const abiEncoded = ethers.utils.defaultAbiCoder.encode(
    ['bytes', 'uint80', 'uint16'],
    [traitPage.encodedCompressed, traitPage.originalLength, traitPage.itemCount],
  );
  writeFileSync(filepath, abiEncoded);
  console.log(`Saved traitPage to ${filepath}`);
};

task(
  'descriptor-art-to-console',
  'Prints the descriptor art config in the final format, to be used in foundry / manual tests.',
)
  .addOptionalParam(
    'count',
    'The length of the image slice to take from each of the image arrays',
    undefined,
    types.int,
  )
  .addOptionalParam('start', 'The index at which to start the image slice', undefined, types.int)
  .addOptionalParam(
    'exportPath',
    'Where to save abi encoded files to be used in forge tests',
    path.join(__dirname, '../test/foundry/files/descriptor_v2/'),
  )
  .setAction(async ({ count, start, exportPath }, { ethers }) => {
    const { bgcolors, palette, images } = ImageData;
    let { bodies, accessories, heads, glasses } = images;

    if (count !== undefined) {
      start = start === undefined ? 0 : start;

      bodies = bodies.slice(start, count + start);
      accessories = accessories.slice(start, count + start);
      heads = heads.slice(start, count + start);
      glasses = glasses.slice(start, count + start);
    }

    const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
    const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));
    const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
    const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
    const paletteValue = `0x000000${palette.join('')}`;

    writeFileSync(
      path.join(exportPath, 'paletteAndBackgrounds.abi'),
      ethers.utils.defaultAbiCoder.encode(['bytes', 'string[]'], [paletteValue, bgcolors]),
    );

    console.log('=== PALETTE ===\n');
    console.log(`paletteValue: '${paletteValue}'\n`);

    console.log('=== BODIES ===\n');
    console.log(`bodiesCompressed: '${bodiesPage.encodedCompressed}'\n`);
    console.log(`bodiesLength: ${bodiesPage.originalLength}\n`);
    console.log(`bodies count: ${bodiesPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'bodiesPage.abi'), bodiesPage);

    console.log('=== ACCESSORIES ===\n');
    console.log(`accessoriesCompressed: '${accessoriesPage.encodedCompressed}'\n`);
    console.log(`accessoriesLength: ${accessoriesPage.originalLength}\n`);
    console.log(`accessories count: ${accessoriesPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'accessoriesPage.abi'), accessoriesPage);

    console.log('=== HEADS ===\n');
    console.log(`headsCompressed: '${headsPage.encodedCompressed}'\n`);
    console.log(`headsLength: ${headsPage.originalLength}\n`);
    console.log(`heads count: ${headsPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'headsPage.abi'), headsPage);

    console.log('=== GLASSES ===\n');
    console.log(`glassesCompressed: '${glassesPage.encodedCompressed}'\n`);
    console.log(`glassesLength: ${glassesPage.originalLength}\n`);
    console.log(`glasses count: ${glassesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'glassesPage.abi'), glassesPage);
  });
