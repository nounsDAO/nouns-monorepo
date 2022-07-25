import { task, types } from 'hardhat/config';
import { ContractName, DeployedContract } from './types';

// prettier-ignore
// These contracts require a fully qualified name to be passed because
// they share bytecode with the underlying contract.
const nameToFullyQualifiedName: Record<string, string> = {
  NounsAuctionHouseProxy: 'contracts/proxies/NounsAuctionHouseProxy.sol:NounsAuctionHouseProxy',
  NounsAuctionHouseProxyAdmin: 'contracts/proxies/NounsAuctionHouseProxyAdmin.sol:NounsAuctionHouseProxyAdmin',
  NounsDAOLogicV1Harness: 'contracts/test/NounsDAOLogicV1Harness.sol:NounsDAOLogicV1Harness'
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(async ({ contracts }: { contracts: Record<ContractName, DeployedContract> }, hre) => {
    for (const [, contract] of Object.entries(contracts)) {
      console.log(`verifying ${contract.name}...`);
      try {
        const code = await contract.instance?.provider.getCode(contract.address);
        if (code === '0x') {
          console.log(
            `${contract.name} contract deployment has not completed. waiting to verify...`,
          );
          await contract.instance?.deployed();
        }
        await hre.run('verify:verify', {
          ...contract,
          contract: nameToFullyQualifiedName[contract.name],
        });
      } catch ({ message }) {
        if ((message as string).includes('Reason: Already Verified')) {
          continue;
        }
        console.error(message);
      }
    }
  });
