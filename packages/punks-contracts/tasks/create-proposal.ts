import { utils } from 'ethers';
import { task, types } from 'hardhat/config';

task('create-proposal', 'Create a governance proposal')
  .addOptionalParam(
    'nDaoProxy',
    'The `NDAOProxy` contract address',
    '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    types.string,
  )
  .setAction(async ({ nDaoProxy }, { ethers }) => {
    const nDaoFactory = await ethers.getContractFactory('NDAOLogicV1');
    const nDao = nDaoFactory.attach(nDaoProxy);

    const [deployer] = await ethers.getSigners();
    const oneETH = utils.parseEther('1');

    const receipt = await (
      await nDao.propose(
        [deployer.address],
        [oneETH],
        [''],
        ['0x'],
        '# Test Proposal\n## This is a **test**.',
      )
    ).wait();
    if (!receipt.events?.length) {
      throw new Error('Failed to create proposal');
    }
    console.log('Proposal created');
  });
