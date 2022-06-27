import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { deflateRawSync } from 'zlib';
import { ethers } from 'ethers';

task(
  'descriptor-art-to-console',
  'Prints the descriptor art config in the final format, to be used in foundry / manual tests.',
)
  .addOptionalParam(
    'slice',
    'How many items to take from each of the image arrays',
    undefined,
    types.int,
  )
  .setAction(async ({ slice }, { ethers }) => {
    const { bgcolors, palette, images } = ImageData;
    let { bodies, accessories, heads, glasses } = images;

    if (slice !== undefined) {
      bodies = bodies.slice(0, slice);
      accessories = accessories.slice(0, slice);
      heads = heads.slice(0, slice);
      glasses = glasses.slice(0, slice);
    }

    const {
      encodedCompressed: bodiesCompressed,
      originalLength: bodiesLength,
      itemCount: bodiesCount,
    } = dataToDescriptorInput(bodies.map(({ data }) => data));
    const {
      encodedCompressed: accessoriesCompressed,
      originalLength: accessoriesLength,
      itemCount: accessoriesCount,
    } = dataToDescriptorInput(accessories.map(({ data }) => data));
    const {
      encodedCompressed: headsCompressed,
      originalLength: headsLength,
      itemCount: headsCount,
    } = dataToDescriptorInput(heads.map(({ data }) => data));
    const {
      encodedCompressed: glassesCompressed,
      originalLength: glassesLength,
      itemCount: glassesCount,
    } = dataToDescriptorInput(glasses.map(({ data }) => data));

    const paletteValue = `0x000000${palette.join('')}`;

    console.log('=== PALETTE ===\n');
    console.log(`paletteValue: '${paletteValue}'\n`);

    console.log('=== BODIES ===\n');
    console.log(`bodiesCompressed: '${bodiesCompressed}'\n`);
    console.log(`bodiesLength: ${bodiesLength}\n`);

    console.log('=== ACCESSORIES ===\n');
    console.log(`accessoriesCompressed: '${accessoriesCompressed}'\n`);
    console.log(`accessoriesLength: ${accessoriesLength}\n`);

    console.log('=== HEADS ===\n');
    console.log(`headsCompressed: '${headsCompressed}'\n`);
    console.log(`headsLength: ${headsLength}\n`);

    console.log('=== GLASSES ===\n');
    console.log(`glassesCompressed: '${glassesCompressed}'\n`);
    console.log(`glassesLength: ${glassesLength}\n`);
  });

function dataToDescriptorInput(data: string[]): {
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
