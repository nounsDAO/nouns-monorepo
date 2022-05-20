import { Contract } from 'ethers';
import { task, types } from 'hardhat/config';
import { ContractName } from './types';

interface VerifyArgs {
  address: string;
  instance?: Contract;
  constructorArguments?: (string | number)[];
  libraries?: Record<string, string>;
}

// prettier-ignore
// These contracts require a fully qualified name to be passed because
// they share bytecode with the underlying contract.
const nameToFullyQualifiedName: Record<string, string> = {
  NounsAuctionHouseProxy: 'contracts/proxies/NounsAuctionHouseProxy.sol:NounsAuctionHouseProxy',
  NounsAuctionHouseProxyAdmin: 'contracts/proxies/NounsAuctionHouseProxyAdmin.sol:NounsAuctionHouseProxyAdmin',
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(async ({ contracts }: { contracts: Record<ContractName, VerifyArgs> }, hre) => {
    for (const [name, contract] of Object.entries(contracts)) {
      console.log(`verifying ${name}...`);
      try {
        const code = await contract.instance?.provider.getCode(contract.address);
        if (code === '0x') {
          console.log(`${name} contract deployment has not completed. waiting to verify...`);
          await contract.instance?.deployed();
        }
        await hre.run('verify:verify', {
          ...contract,
          contract: nameToFullyQualifiedName[name],
        });
      } catch ({ message }) {
        if ((message as string).includes('Reason: Already Verified')) {
          continue;
        }
        console.error(message);
      }
    }
  });
