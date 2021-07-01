import { task, types } from 'hardhat/config';
import { bgcolors, partcolors, parts } from '../files/encoded-layers.json';
import { chunkArray } from '../utils';

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
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const [bodies, accessories, heads, glasses] = parts;

    // Chunk head and accessory population due to high gas usage
    await Promise.all([
      descriptorContract.addManyBackgrounds(bgcolors),
      descriptorContract.addManyColorsToPalette(0, partcolors),
      descriptorContract.addManyBodies(bodies.map(({ data }) => data)),
      chunkArray(accessories, 10).map(chunk =>
        chunk.map(({ data }) => descriptorContract.addManyAccessories(data)),
      ),
      chunkArray(heads, 10).map(chunk =>
        chunk.map(({ data }) => descriptorContract.addManyHeads(data)),
      ),
      descriptorContract.addManyGlasses(glasses.map(({ data }) => data)),
    ]);
    console.log('Descriptor populated with palettes and parts');
  });
