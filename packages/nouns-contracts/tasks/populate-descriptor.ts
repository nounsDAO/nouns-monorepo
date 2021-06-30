import { task, types } from 'hardhat/config';
import { colors, layers } from '../test/files/encoded-layers.json';

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

    const backgrounds = ['e1e5e3'];
    const [bodies, accessories, heads, glasses] = layers;
    await Promise.all([
      descriptorContract.addManyColorsToPalette(
        0,
        colors.map(color => color),
      ),
      descriptorContract.addManyBackgrounds(backgrounds),
      descriptorContract.addManyBodies(bodies.map(({ data }) => data)),
      descriptorContract.addManyAccessories(accessories.map(({ data }) => data)),
      // Split up head insertion due to high gas usage
      descriptorContract.addManyHeads(heads.map(({ data }) => data).filter((_, i) => i % 2 === 0)),
      descriptorContract.addManyHeads(heads.map(({ data }) => data).filter((_, i) => i % 2 === 1)),
      descriptorContract.addManyGlasses(glasses.map(({ data }) => data)),
    ]);
    console.log('Descriptor populated with palettes and parts');
  });
