import { task } from 'hardhat/config';
import { dataToDescriptorInput } from './utils';
import { readFileSync } from 'fs';

// see image-data-example-for-populate-via-proposal.json for an example input file
task(
  'populate-descriptor-via-proposal',
  'Populates the descriptor with color palettes and Noun parts; accepts an input JSON with missing properies.',
)
  .addParam('nounsDescriptor', 'The `NounsDescriptor` contract address')
  .addParam('daoAddress', 'The `NounsDAOProxy` contract address')
  .addParam('imageDataPath', 'The path to the image data JSON file')
  .addParam('proposalTextPath', 'Path to the proposal descriptor text file')
  .setAction(
    async ({ nounsDescriptor, daoAddress, imageDataPath, proposalTextPath }, { ethers }) => {
      const ImageData = JSON.parse(readFileSync(imageDataPath, 'utf-8'));
      const proposalText = readFileSync(proposalTextPath, 'utf-8');

      const targets = [];
      const values = [];
      const signatures = [];
      const calldatas = [];

      if (ImageData.bgcolors) {
        targets.push(nounsDescriptor);
        values.push(0);
        signatures.push('addManyBackgrounds(string[])');
        calldatas.push(ethers.utils.defaultAbiCoder.encode(['string[]'], [ImageData.bgcolors]));
      }

      if (ImageData.palettes) {
        for (const [index, colors] of Object.entries(ImageData.palettes)) {
          targets.push(nounsDescriptor);
          values.push(0);
          signatures.push('setPalette(uint8,bytes)');
          calldatas.push(
            ethers.utils.defaultAbiCoder.encode(
              ['uint8', 'bytes'],
              [parseInt(index), `0x000000${(colors as string[]).join('')}`],
            ),
          );
        }
      }

      if (ImageData.images) {
        const { bodies, accessories, heads, glasses } = ImageData.images;

        if (bodies) {
          const bodiesPage = dataToDescriptorInput(
            (bodies as [{ data: string }]).map(({ data }) => data),
          );

          targets.push(nounsDescriptor);
          values.push(0);
          signatures.push('addBodies(bytes,uint80,uint16)');
          calldatas.push(
            ethers.utils.defaultAbiCoder.encode(
              ['bytes', 'uint80', 'uint16'],
              [bodiesPage.encodedCompressed, bodiesPage.originalLength, bodiesPage.itemCount],
            ),
          );
        }

        if (heads) {
          const headsPage = dataToDescriptorInput(
            (heads as [{ data: string }]).map(({ data }) => data),
          );

          targets.push(nounsDescriptor);
          values.push(0);
          signatures.push('addHeads(bytes,uint80,uint16)');
          calldatas.push(
            ethers.utils.defaultAbiCoder.encode(
              ['bytes', 'uint80', 'uint16'],
              [headsPage.encodedCompressed, headsPage.originalLength, headsPage.itemCount],
            ),
          );
        }

        if (glasses) {
          const glassesPage = dataToDescriptorInput(
            (glasses as [{ data: string }]).map(({ data }) => data),
          );

          targets.push(nounsDescriptor);
          values.push(0);
          signatures.push('addGlasses(bytes,uint80,uint16)');
          calldatas.push(
            ethers.utils.defaultAbiCoder.encode(
              ['bytes', 'uint80', 'uint16'],
              [glassesPage.encodedCompressed, glassesPage.originalLength, glassesPage.itemCount],
            ),
          );
        }

        if (accessories) {
          const accessoriesPage = dataToDescriptorInput(
            (accessories as [{ data: string }]).map(({ data }) => data),
          );

          targets.push(nounsDescriptor);
          values.push(0);
          signatures.push('addAccessories(bytes,uint80,uint16)');
          calldatas.push(
            ethers.utils.defaultAbiCoder.encode(
              ['bytes', 'uint80', 'uint16'],
              [
                accessoriesPage.encodedCompressed,
                accessoriesPage.originalLength,
                accessoriesPage.itemCount,
              ],
            ),
          );
        }
      }

      const dao = (await ethers.getContractFactory('NounsDAOLogicV1')).attach(daoAddress);
      const propTx = await dao.propose(targets, values, signatures, calldatas, proposalText);
      await propTx.wait();

      console.log('Proposal submitted!');
    },
  );
