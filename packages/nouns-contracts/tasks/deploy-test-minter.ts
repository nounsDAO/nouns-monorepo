import { task } from 'hardhat/config';

task('deploy-test-minter', 'Deploy NounsTestMinter given a descriptor')
  .addParam('descriptorAddress', 'Address of a deployed descriptor contractor')
  .addParam('seederAddress', 'Address of a deployed seeder contract')
  .setAction(async ({ descriptorAddress, seederAddress }, { ethers, run, network }) => {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const nonce = await deployer.getTransactionCount();
    const expectedTokenAddress = ethers.utils.getContractAddress({
      from: deployer.address,
      nonce: nonce + 1,
    });

    const proxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

    const minter = await (
      await ethers.getContractFactory('NounsTestMinter', deployer)
    ).deploy(expectedTokenAddress);
    console.log(`NounsTestMinter deployed to ${minter.address}`);

    const token = await (
      await ethers.getContractFactory('NounsTokenHarness', deployer)
    ).deploy(
      deployer.address,
      minter.address,
      descriptorAddress,
      seederAddress,
      proxyRegistryAddress,
    );
    console.log(`NounsTokenHarness deployed to: ${token.address}`);

    console.log('Done');
  });
