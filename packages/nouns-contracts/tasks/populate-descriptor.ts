import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers, network }) => {
    const options = { gasLimit: network.name === 'hardhat' ? 30000000 : undefined };

    const descriptorFactory = await ethers.getContractFactory('NounsDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { bgcolors, palette, images } = ImageData;
    const { bodies, accessories, heads, glasses } = images;

    const bodiesPage = dataToDescriptorInput(bodies.map(({ data }) => data));
    const headsPage = dataToDescriptorInput(heads.map(({ data }) => data));
    const glassesPage = dataToDescriptorInput(glasses.map(({ data }) => data));
    const accessoriesPage = dataToDescriptorInput(accessories.map(({ data }) => data));

    const backgroundCount = await descriptorContract.backgroundCount();
    if (backgroundCount.isZero()) {
      await descriptorContract.addManyBackgrounds(bgcolors);
    }

    let pallet0 = "";
    try {
      pallet0 = await descriptorContract.palettes(0);
    } catch (e) {
      console.log(`Pallet[0] may not be registered.`)
    } finally {
      if (pallet0.length === 0) {
        await descriptorContract.setPalette(0, `0x000000${palette.join('')}`);
        console.log("Descriptor populated with palettes")
      }
    }

    const bodyCount = await descriptorContract.bodyCount();
    if (bodyCount.isZero()) {
      await descriptorContract.addBodies(
        bodiesPage.encodedCompressed,
        bodiesPage.originalLength,
        bodiesPage.itemCount,
        options,
      );
      console.log("Descriptor populated with bodies")
    }

    const headCount = await descriptorContract.headCount();
    if (headCount.isZero()) {
      await descriptorContract.addHeads(
          headsPage.encodedCompressed,
          headsPage.originalLength,
          headsPage.itemCount,
          options,
      );
      console.log("Descriptor populated with heads")
    }

    const glassesCount = await descriptorContract.glassesCount();
    if (glassesCount.isZero()) {
      await descriptorContract.addGlasses(
          glassesPage.encodedCompressed,
          glassesPage.originalLength,
          glassesPage.itemCount,
          options,
      );
      console.log("Descriptor populated with glasses")
    }

    const accessoryCount = await descriptorContract.accessoryCount();
    if (accessoryCount.isZero()) {
      await descriptorContract.addAccessories(
          accessoriesPage.encodedCompressed,
          accessoriesPage.originalLength,
          accessoriesPage.itemCount,
          options,
      );
      console.log("Descriptor populated with accessories")
    }

    console.log('Descriptor populated with palettes and parts.');
  });
