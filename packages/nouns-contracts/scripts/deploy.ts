import { ethers } from 'hardhat';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

async function main() {
  const NounsErc721 = await ethers.getContractFactory('NounsErc721');

  let gas = await NounsErc721.signer.getGasPrice();
  const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gas, 'gwei')));

  promptjs.start();

  let result = await promptjs.get([
    {
      properties: {
        gasPrice: {
          type: 'integer',
          required: true,
          description: 'Enter a gas price (gwei)',
          default: gasInGwei,
        },
      },
    },
  ]);

  gas = ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');

  const price = await NounsErc721.signer.estimateGas(
    NounsErc721.getDeployTransaction({
      gasPrice: gas,
    }),
  );
  console.log(
    'Estimated cost to deploy contact:',
    ethers.utils.formatUnits(price.mul(gas), 'ether'),
    'ETH',
  );

  result = await promptjs.get([
    {
      properties: {
        confirm: {
          type: 'string',
          description: 'Type "DEPLOY" to confirm:',
        },
      },
    },
  ]);

  if (result.confirm != 'DEPLOY') {
    console.log('Exiting');
    return;
  }

  console.log('Deploying...');

  const deployTx = await NounsErc721.deploy({
    gasPrice: gas,
  });

  console.log('Contract deployed to:', deployTx.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
