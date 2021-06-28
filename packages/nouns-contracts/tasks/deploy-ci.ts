import fs from 'fs';
import { task } from 'hardhat/config';

task('deploy-ci', 'Deploy contracts (automated by CI)')
  .addOptionalParam(
    'nounsDAO',
    'The NounsDAO contract address',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  )
  .setAction(async ({ nounsDAO }, { run }) => {
    const contracts = await run('deploy', { nounsDAO });

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
