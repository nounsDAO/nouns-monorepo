import { ethers } from 'hardhat';
import fs from 'fs';

async function main() {
  const NounsErc721 = await ethers.getContractFactory('NounsErc721');

  let gas = await NounsErc721.signer.getGasPrice();

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

  console.log('Deploying...');

  const deployTx = await NounsErc721.deploy({
    gasPrice: gas,
  });

  console.log('Contract deployed to:', deployTx.address);

  if (!(await fs.existsSync('logs'))) {
    await fs.mkdirSync('logs');
  }
  await fs.writeFileSync(
    'logs/deploy.json',
    JSON.stringify({
      contractAddress: deployTx.address,
      gitHub: {
        // Get the commit sha when running in CI
        sha: process.env.GITHUB_SHA,
      },
    }),
    { flag: 'w' },
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
