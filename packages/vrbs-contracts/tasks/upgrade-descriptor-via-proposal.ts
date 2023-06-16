import { task } from 'hardhat/config';

task('upgrade-descriptor-via-proposal', 'Upgrade N00unsToken to use Descriptor V2.')
  .addParam('descriptor', 'The `N00unsDescriptorV2` contract address')
  .addParam('dao', 'The `N00unsDAOProxy` contract address')
  .addParam('token', 'The `N00unsToken` contract address')
  .setAction(async ({ descriptor, dao, token }, { ethers }) => {
    const targets = [token as string];
    const values = [0];
    const signatures = ['setDescriptor(address)'];
    const calldatas = [ethers.utils.defaultAbiCoder.encode(['address'], [descriptor])];

    const gov = (await ethers.getContractFactory('N00unsDAOLogicV1')).attach(dao);
    const propTx = await gov.propose(
      targets,
      values,
      signatures,
      calldatas,
      `# Upgrade N00unsToken descriptor to V2\nThis proposal calls a function on N00unsToken to set its descriptor to V2.`,
    );
    await propTx.wait();

    console.log('Proposal submitted!');
  });
