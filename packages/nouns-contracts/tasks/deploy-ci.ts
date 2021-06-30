import fs from 'fs';
import { task } from 'hardhat/config';
import { constants } from 'ethers';

task('deploy-ci', 'Deploy contracts (automated by CI)')
  .addOptionalParam('noundersDAO', 'The nounders DAO contract address')
  .addOptionalParam(
    'nounsAuctionHouse',
    'The NounsAuctionHouse proxy contract address',
    constants.AddressZero,
  )
  .setAction(async ({ noundersDAO, nounsAuctionHouse }, { ethers, run }) => {
    const [deployer] = await ethers.getSigners();
    const contracts = await run('deploy', {
      nounsAuctionHouse,
      noundersDAO: noundersDAO || deployer.address,
    });

    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
    fs.writeFileSync(
      'logs/deploy.json',
      JSON.stringify({
        contractAddresses: {
          NFTDescriptor: contracts.NFTDescriptor.address,
          NounsDescriptor: contracts.NounsDescriptor.address,
          NounsSeeder: contracts.NounsSeeder.address,
          NounsERC721: contracts.NounsERC721.address,
        },
        gitHub: {
          // Get the commit sha when running in CI
          sha: process.env.GITHUB_SHA,
        },
      }),
      { flag: 'w' },
    );
  });
