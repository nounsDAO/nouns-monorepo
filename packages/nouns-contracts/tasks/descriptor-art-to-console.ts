import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { dataToDescriptorInput } from './utils';

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
  .setAction(async ({ count, start }, { ethers }) => {
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

    console.log('=== PALETTE ===\n');
    console.log(`paletteValue: '${paletteValue}'\n`);

    console.log('=== BODIES ===\n');
    console.log(`bodiesCompressed: '${bodiesPage.encodedCompressed}'\n`);
    console.log(`bodiesLength: ${bodiesPage.originalLength}\n`);

    console.log('=== ACCESSORIES ===\n');
    console.log(`accessoriesCompressed: '${accessoriesPage.encodedCompressed}'\n`);
    console.log(`accessoriesLength: ${accessoriesPage.originalLength}\n`);

    console.log('=== HEADS ===\n');
    console.log(`headsCompressed: '${headsPage.encodedCompressed}'\n`);
    console.log(`headsLength: ${headsPage.originalLength}\n`);

    console.log('=== GLASSES ===\n');
    console.log(`glassesCompressed: '${glassesPage.encodedCompressed}'\n`);
    console.log(`glassesLength: ${glassesPage.originalLength}\n`);
  });
