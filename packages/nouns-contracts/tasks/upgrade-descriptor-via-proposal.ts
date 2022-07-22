import { task } from 'hardhat/config';

task('upgrade-descriptor-via-proposal', 'Upgrade NounsToken to use Descriptor V2.')
  .addParam('descriptor', 'The `NounsDescriptorV2` contract address')
  .addParam('dao', 'The `NounsDAOProxy` contract address')
  .addParam('token', 'The `NounsToken` contract address')
  .setAction(async ({ descriptor, dao, token }, { ethers }) => {
    const targets = [token as string];
    const values = [0];
    const signatures = ['setDescriptor(address)'];
    const calldatas = [ethers.utils.defaultAbiCoder.encode(['address'], [descriptor])];

    const gov = (await ethers.getContractFactory('NounsDAOLogicV1')).attach(dao);
    const propTx = await gov.propose(
      targets,
      values,
      signatures,
      calldatas,
      `# Upgrade NounsToken descriptor to V2\nThis proposal calls a function on NounsToken to set its descriptor to V2.`,
    );
    await propTx.wait();

    console.log('Proposal submitted!');
  });
