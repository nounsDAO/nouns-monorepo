import { writeFileSync } from 'fs';
import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data-v2.json';
import { dataToDescriptorInput } from './utils';
import path from 'path';
import { ethers } from 'ethers';

const saveToFileAbiEncoded = (
  filepath: string,
  traitPage: { encodedCompressed: string; originalLength: number; itemCount: number },
) => {
  const abiEncoded = ethers.utils.defaultAbiCoder.encode(
    ['bytes', 'uint80', 'uint16'],
    [traitPage.encodedCompressed, traitPage.originalLength, traitPage.itemCount],
  );
  writeFileSync(filepath, abiEncoded);
  console.log(`Saved traitPage to ${filepath}`);
};

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
  .addOptionalParam(
    'exportPath',
    'Where to save abi encoded files to be used in forge tests',
    path.join(__dirname, '../test/foundry/files/descriptor_v2/'),
  )
  .setAction(async ({ count, start, exportPath }, { ethers }) => {
    const { palette, images } = ImageData;
    let { types, necks, cheekses, faces, beards, mouths, earses, hats, hairs, teeths, lipses, emotions, eyeses, glasseses, goggleses, noses } = images;

    if (count !== undefined) {
      start = start === undefined ? 0 : start;

      types = types.slice(start, count + start);
      necks = necks.slice(start, count + start);
      cheekses = cheekses.slice(start, count + start);
      faces = faces.slice(start, count + start);
      beards = beards.slice(start, count + start);
      mouths = mouths.slice(start, count + start);
      earses = earses.slice(start, count + start);
      hats = hats.slice(start, count + start);
      hairs = hairs.slice(start, count + start);
      teeths = teeths.slice(start, count + start);
      lipses = lipses.slice(start, count + start);
      emotions = emotions.slice(start, count + start);
      eyeses = eyeses.slice(start, count + start);
      glasseses = glasseses.slice(start, count + start);
      goggleses = goggleses.slice(start, count + start);
      noses = noses.slice(start, count + start);
    }

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
    const gogglesesPage = dataToDescriptorInput(goggleses.map(({ data }) => data));
    const nosesPage = dataToDescriptorInput(noses.map(({ data }) => data));

    const paletteValue = `0x000000${palette.join('')}`;

    writeFileSync(
      path.join(exportPath, 'paletteAndBackgrounds.abi'),
      ethers.utils.defaultAbiCoder.encode(['bytes', 'string[]'], [paletteValue]),
    );

    console.log('=== PALETTE ===\n');
    console.log(`paletteValue: '${paletteValue}'\n`);

    console.log('=== TYPES ===\n');
    console.log(`typesCompressed: '${typesPage.encodedCompressed}'\n`);
    console.log(`typesLength: ${typesPage.originalLength}\n`);
    console.log(`types count: ${typesPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'typesPage.abi'), typesPage);

    console.log('=== NECKS ===\n');
    console.log(`necksCompressed: '${necksPage.encodedCompressed}'\n`);
    console.log(`necksLength: ${necksPage.originalLength}\n`);
    console.log(`necks count: ${necksPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'necksPage.abi'), necksPage);

    console.log('=== CHEEKSES ===\n');
    console.log(`cheeksesCompressed: '${cheeksesPage.encodedCompressed}'\n`);
    console.log(`cheeksesLength: ${cheeksesPage.originalLength}\n`);
    console.log(`cheekses count: ${cheeksesPage.itemCount}`);
    saveToFileAbiEncoded(path.join(exportPath, 'cheeksesPage.abi'), cheeksesPage);

    console.log('=== FACES ===\n');
    console.log(`facesCompressed: '${facesPage.encodedCompressed}'\n`);
    console.log(`facesLength: ${facesPage.originalLength}\n`);
    console.log(`faces count: ${facesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'facesPage.abi'), facesPage);

    console.log('=== BEARDS ===\n');
    console.log(`beardsCompressed: '${beardsPage.encodedCompressed}'\n`);
    console.log(`beardsLength: ${beardsPage.originalLength}\n`);
    console.log(`beards count: ${beardsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'beardsPage.abi'), beardsPage);
    
    console.log('=== MOUTHS ===\n');
    console.log(`mouthsCompressed: '${mouthsPage.encodedCompressed}'\n`);
    console.log(`mouthsLength: ${mouthsPage.originalLength}\n`);
    console.log(`mouths count: ${mouthsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'mouthsPage.abi'), mouthsPage);

    console.log('=== EARSES ===\n');
    console.log(`earsesCompressed: '${earsesPage.encodedCompressed}'\n`);
    console.log(`earsesLength: ${earsesPage.originalLength}\n`);
    console.log(`earses count: ${earsesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'earsesPage.abi'), earsesPage);

    console.log('=== HATS ===\n');
    console.log(`hatsCompressed: '${hatsPage.encodedCompressed}'\n`);
    console.log(`hatsLength: ${hatsPage.originalLength}\n`);
    console.log(`hats count: ${hatsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'hatsPage.abi'), hatsPage);

    console.log('=== HAIRS ===\n');
    console.log(`hairsCompressed: '${hairsPage.encodedCompressed}'\n`);
    console.log(`hairsLength: ${hairsPage.originalLength}\n`);
    console.log(`hairs count: ${hairsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'hairsPage.abi'), hairsPage);

    console.log('=== TEETHS ===\n');
    console.log(`teethsCompressed: '${teethsPage.encodedCompressed}'\n`);
    console.log(`teethsLength: ${teethsPage.originalLength}\n`);
    console.log(`teeths count: ${teethsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'teethsPage.abi'), teethsPage);

    console.log('=== LIPSES ===\n');
    console.log(`lipsesCompressed: '${lipsesPage.encodedCompressed}'\n`);
    console.log(`lipsesLength: ${lipsesPage.originalLength}\n`);
    console.log(`lipses count: ${lipsesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'lipsesPage.abi'), lipsesPage);

    console.log('=== EMOTIONS ===\n');
    console.log(`emotionsCompressed: '${emotionsPage.encodedCompressed}'\n`);
    console.log(`emotionsLength: ${emotionsPage.originalLength}\n`);
    console.log(`emotions count: ${emotionsPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'emotionsPage.abi'), emotionsPage);

    console.log('=== EYESES ===\n');
    console.log(`eyesesCompressed: '${eyesesPage.encodedCompressed}'\n`);
    console.log(`eyesesLength: ${eyesesPage.originalLength}\n`);
    console.log(`eyeses count: ${eyesesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'eyesesPage.abi'), eyesesPage);

    console.log('=== GLASSESES ===\n');
    console.log(`glassesesCompressed: '${glassesesPage.encodedCompressed}'\n`);
    console.log(`glassesesLength: ${glassesesPage.originalLength}\n`);
    console.log(`glasseses count: ${glassesesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'glassesPage.abi'), glassesesPage);

    console.log('=== GOGGLESES ===\n');
    console.log(`gogglesesCompressed: '${gogglesesPage.encodedCompressed}'\n`);
    console.log(`gogglesesLength: ${gogglesesPage.originalLength}\n`);
    console.log(`goggleses count: ${gogglesesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'gogglesPage.abi'), gogglesesPage);

    console.log('=== NOSES ===\n');
    console.log(`nosesCompressed: '${nosesPage.encodedCompressed}'\n`);
    console.log(`nosesLength: ${nosesPage.originalLength}\n`);
    console.log(`noses count: ${nosesPage.itemCount}\n`);
    saveToFileAbiEncoded(path.join(exportPath, 'nosesPage.abi'), nosesPage);
  });
