import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftdescriptor',
    'The `NFTDescriptor` contract address',
    '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    types.string,
  )
  .addOptionalParam(
    'nounsdescriptor',
    'The `NounsDescriptor` contract address',
    '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
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
    const bgtx = await descriptorContract.addManyBackgrounds(bgcolors);
    await bgtx.wait(1);
    console.log(`tx ${bgtx.hash} mined`);

    const cotx = await descriptorContract.addManyColorsToPalette(0, palette);
    await cotx.wait(1);
    console.log(`tx ${cotx.hash} mined`);
    const botx = await descriptorContract.addManyBodies(bodies.map(({ data }) => data));
    await botx.wait(1);
    console.log(`tx ${botx.hash} mined`);

    const accessoryChunk = chunkArray(accessories, 10);
    for (const chunk of accessoryChunk) {
      const actx = await descriptorContract.addManyAccessories(chunk.map(({ data }) => data));
      await actx.wait(1);
      console.log(`tx ${actx.hash} mined`);
    }

    const headChunk = chunkArray(heads, 10);
    for (const chunk of headChunk) {
      const hetx = await descriptorContract.addManyHeads(chunk.map(({ data }) => data));
      await hetx.wait(1);
      console.log(`tx ${hetx.hash} mined`);
    }

    const gltx = await descriptorContract.addManyGlasses(glasses.map(({ data }) => data));
    await gltx.wait(1);
    console.log(`tx ${gltx.hash} mined`);

    console.log('Descriptor populated with palettes and parts.');
  });
