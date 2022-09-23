import { task } from 'hardhat/config';

task('upgrade-descriptor-via-proposal', 'Upgrade NToken to use Descriptor V2.')
  .addParam('descriptor', 'The `NDescriptorV2` contract address')
  .addParam('dao', 'The `NDAOProxy` contract address')
  .addParam('token', 'The `NToken` contract address')
  .setAction(async ({ descriptor, dao, token }, { ethers }) => {
    const targets = [token as string];
    const values = [0];
    const signatures = ['setDescriptor(address)'];
    const calldatas = [ethers.utils.defaultAbiCoder.encode(['address'], [descriptor])];

    const gov = (await ethers.getContractFactory('NDAOLogicV1')).attach(dao);
    const propTx = await gov.propose(
      targets,
      values,
      signatures,
      calldatas,
      `# Upgrade NToken descriptor to V2\nThis proposal calls a function on NToken to set its descriptor to V2.`,
    );
    await propTx.wait();

    console.log('Proposal submitted!');
  });
