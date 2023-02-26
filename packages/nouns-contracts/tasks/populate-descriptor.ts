import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Punk parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptorV2` contract address',
    '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    types.string,
  )
  .addOptionalParam(
    'nDescriptor',
    'The `NDescriptorV2` contract address',
    '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707',
    types.string,
  )
  .setAction(async ({ nftDescriptor, nDescriptor }, { ethers, network }) => {
    const options = { gasLimit: network.name === 'hardhat' ? 30000000 : undefined };

    const descriptorFactory = await ethers.getContractFactory('NDescriptorV2', {
      libraries: {
        NFTDescriptorV2: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nDescriptor);

    const { /*bgcolors, */palette, images } = ImageData;
    const { types, necks, cheekses, faces, beards, mouths, earses, hats, hairs, teeths, lipses, emotions, eyeses, glasseses, noses } = images;

    const typesPage = dataToDescriptorInput(types.map(({ data }) => data));
    const necksPage = dataToDescriptorInput(necks.map(({ data }) => data));
    const cheeksesPage = dataToDescriptorInput(cheekses.map(({ data }) => data));
    const facesPage = dataToDescriptorInput(faces.map(({ data }) => data));
    const beardsPage = dataToDescriptorInput(beards.map(({ data }) => data));
    const mouthsPage = dataToDescriptorInput(mouths.map(({ data }) => data));
    const earsesPage = dataToDescriptorInput(earses.map(({ data }) => data));
    const hatsPage = dataToDescriptorInput(hats.map(({ data }) => data));
    const hairsPage = dataToDescriptorInput(hairs.map(({ data }) => data));
    const teethsPage = dataToDescriptorInput(teeths.map(({ data }) => data));
    const lipsesPage = dataToDescriptorInput(lipses.map(({ data }) => data));
    const emotionsPage = dataToDescriptorInput(emotions.map(({ data }) => data));
    const eyesesPage = dataToDescriptorInput(eyeses.map(({ data }) => data));
    const glassesesPage = dataToDescriptorInput(glasseses.map(({ data }) => data));
    const nosesPage = dataToDescriptorInput(noses.map(({ data }) => data));

//    await descriptorContract.addManyBackgrounds(bgcolors);
    await descriptorContract.setPalette(0, `0x00000000${palette.join('')}`);

    await descriptorContract.addPunkTypes(
      typesPage.encodedCompressed,
      typesPage.originalLength,
      typesPage.itemCount,
      options,
    );
    await descriptorContract.addNecks(
      necksPage.encodedCompressed,
      necksPage.originalLength,
      necksPage.itemCount,
      options,
    );
    await descriptorContract.addCheekses(
      cheeksesPage.encodedCompressed,
      cheeksesPage.originalLength,
      cheeksesPage.itemCount,
      options,
    );
    await descriptorContract.addFaces(
      facesPage.encodedCompressed,
      facesPage.originalLength,
      facesPage.itemCount,
      options,
    );
    await descriptorContract.addBeards(
      beardsPage.encodedCompressed,
      beardsPage.originalLength,
      beardsPage.itemCount,
      options,
    );
    await descriptorContract.addMouths(
      mouthsPage.encodedCompressed,
      mouthsPage.originalLength,
      mouthsPage.itemCount,
      options,
    );
    await descriptorContract.addEarses(
      earsesPage.encodedCompressed,
      earsesPage.originalLength,
      earsesPage.itemCount,
      options,
    );
    await descriptorContract.addHats(
      hatsPage.encodedCompressed,
      hatsPage.originalLength,
      hatsPage.itemCount,
      options,
    );
    await descriptorContract.addHairs(
      hairsPage.encodedCompressed,
      hairsPage.originalLength,
      hairsPage.itemCount,
      options,
    );
    await descriptorContract.addTeeths(
      teethsPage.encodedCompressed,
      teethsPage.originalLength,
      teethsPage.itemCount,
      options,
    );
    await descriptorContract.addLipses(
      lipsesPage.encodedCompressed,
      lipsesPage.originalLength,
      lipsesPage.itemCount,
      options,
    );
    await descriptorContract.addEmotions(
      emotionsPage.encodedCompressed,
      emotionsPage.originalLength,
      emotionsPage.itemCount,
      options,
    );
    await descriptorContract.addEyeses(
      eyesesPage.encodedCompressed,
      eyesesPage.originalLength,
      eyesesPage.itemCount,
      options,
    );
    await descriptorContract.addGlasseses(
      glassesesPage.encodedCompressed,
      glassesesPage.originalLength,
      glassesesPage.itemCount,
      options,
    );
    await descriptorContract.addNoses(
      nosesPage.encodedCompressed,
      nosesPage.originalLength,
      nosesPage.itemCount,
      options,
    );

    

    console.log('Descriptor populated with palettes and parts.');
  });
