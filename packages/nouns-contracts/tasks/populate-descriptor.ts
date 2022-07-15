import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftdescriptor',
    'The `NFTDescriptor` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsdescriptor',
    'The `NounsDescriptor` contract address',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    types.string,
  )
  .setAction(async ({ nftdescriptor, nounsdescriptor }, { ethers }) => {
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptor', {
      libraries: {
        NFTDescriptor: nftdescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsdescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    // Chunk head and accessory population due to high gas usage
    // await descriptorContract.addManyBackgrounds(bgcolors);
    // await descriptorContract.addManyColorsToPalette(0, palette);
    const tx1 = await descriptorContract.addManyBodies(bodies.map(({ data }) => data));
    await tx1.wait(1)

    const accessoryChunk = chunkArray(accessories, 10);
    for (const chunk of accessoryChunk) {
      const tx = await descriptorContract.addManyAccessories(chunk.map(({ data }) => data));
      await tx.wait(1)
    }

    const headChunk = chunkArray(heads, 10);
    for (const chunk of headChunk) {
      const tx = await descriptorContract.addManyHeads(chunk.map(({ data }) => data));
      await tx.wait(1)
    }

    const tx2 = await descriptorContract.addManyGlasses(glasses.map(({ data }) => data));
    await tx2.wait(1)

    console.log('Descriptor populated with palettes and parts.');
  });
