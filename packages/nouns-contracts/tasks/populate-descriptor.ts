import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';
import { deflateRawSync } from 'zlib';
import { ethers } from 'ethers';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptor` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptor` contract address',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers }) => {
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

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

    await descriptorContract.addManyBackgrounds(bgcolors);
    await descriptorContract.setPalette(0, `0x000000${palette.join('')}`);

    await descriptorContract.addBodies(bodiesCompressed, bodiesLength, bodiesCount, {
      gasLimit: 30_000_000,
    });
    await descriptorContract.addHeads(headsCompressed, headsLength, headsCount, {
      gasLimit: 30_000_000,
    });
    await descriptorContract.addGlasses(glassesCompressed, glassesLength, glassesCount, {
      gasLimit: 30_000_000,
    });
    await descriptorContract.addAccessories(
      accessoriesCompressed,
      accessoriesLength,
      accessoriesCount,
      { gasLimit: 30_000_000 },
    );

    console.log('Descriptor populated with palettes and parts.');
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
