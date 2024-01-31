import { task, types } from 'hardhat/config';
import ImageData from '../files/newart.json';
import { dataToDescriptorInput } from './utils';
import { KeyObject } from 'crypto';

task('populate-descriptor-add-new-images', 'Populates the descriptor with color palettes and Noun parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptorV2` contract address',
    '0xc0bfBC2516A3699cBa1cd4876Dc4D3d0E4f7ed05',
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

    const images = ImageData.images

    if ("bodies" in images) {
      const bodiesPage = dataToDescriptorInput(images.bodies.map(({ data }) => data));
      console.log("bodies_encodedCompressed：" + bodiesPage.encodedCompressed)
      console.log("bodies_originalLength：" + bodiesPage.originalLength)
      console.log("bodies_itemCount：" + bodiesPage.itemCount)
    }

    if ("accessories" in images) {
      const accessoriesPage = dataToDescriptorInput(images.accessories.map(({ data }) => data));
      console.log("accessories_encodedCompressed：" + accessoriesPage.encodedCompressed)
      console.log("accessories_originalLength：" + accessoriesPage.originalLength)
      console.log("accessories_itemCount：" + accessoriesPage.itemCount)
    }

    if ("heads" in images) {
      const headsPage = dataToDescriptorInput(images.heads.map(({ data }) => data));
      console.log("heads_encodedCompressed：" + headsPage.encodedCompressed)
      console.log("heads_originalLength：" + headsPage.originalLength)
      console.log("heads_itemCount：" + headsPage.itemCount)
    }

    if ("glasses" in images) {
      const glassesPage = dataToDescriptorInput(images.glasses.map(({ data }) => data));
      console.log("glasses_encodedCompressed：" + glassesPage.encodedCompressed)
      console.log("glasses_originalLength：" + glassesPage.originalLength)
      console.log("glasses_itemCount：" + glassesPage.itemCount)
    }
  });
