import { useState } from 'react';
import { BigNumber, Contract, utils } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { useEthers } from '@usedapp/core';

import { NounsDescriptorABI, NounsSeederABI, NounsTokenABI } from '@nouns/sdk';
import { StandaloneNounImage } from '../../components/StandaloneNoun';

import classes from './Generate.module.css';
import { useNounSeed } from '../../wrappers/nounToken';

const Generate = () => {
  const [currentSeed, setCurrentSeed] = useState(undefined);
  const [currentImg, setCurrentImg] = useState('');

  const [currentHead, setCurrentHead] = useState('');
  const [currentGlasses, setCurrentGlasses] = useState('');
  const [currentAccessories, setCurrentAccessories] = useState('');
  const [currentBody, setCurrentBody] = useState('');

  const { library: provider, account } = useEthers();

  const NounsDescriptorAbi = new utils.Interface(NounsDescriptorABI);
  const NounsSeederAbi = new utils.Interface(NounsSeederABI);
  const NounsTokenAbi = new utils.Interface(NounsTokenABI);

  const addresses = {
    nounsDescriptor: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    nounsSeeder: '0x0165878a594ca255338adfa4d48449f69242eb8f',
    nounsToken: '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853',
  };

  const contracts = {
    nounsDescriptor: new Contract(addresses.nounsDescriptor, NounsDescriptorAbi, provider),
    nounsSeeder: new Contract(addresses.nounsSeeder, NounsSeederAbi, provider),
    nounsToken: new Contract(addresses.nounsToken, NounsTokenAbi, provider),
  };

  async function generateNoun() {
    // const nounId = Math.floor(Math.random() * 1000);
    // const seed = await contracts.nounsSeeder.generateSeed(nounId, addresses.nounsDescriptor);
    // setCurrentSeed(seed);

    // Seed: [background, body, accessory, head, glasses]
    const seed = [0, 27, 81, 1, 10];

    const yourAddress = account;
    const gasLimit = 1000000; // Setting a higher gas limit
    const tokenURI = await contracts.nounsDescriptor
      .generateSVGImage(seed)
      .then((res: any) => {
        console.log(`response: ${JSON.stringify(res)}`);
      })
      .catch((err: any) => {
        console.log(`ERR: ${JSON.stringify(err)}`);
      });

    console.log(`NOUNS: ${JSON.stringify(tokenURI)}`);

    // setCurrentImg(atob(svg));
  }

  const getHead = async () => {
    const head = 1;
    const svg = await contracts.nounsDescriptor.heads(head);
    console.log(`svg heads: ${svg}`);
    return svg;
  };
  const getGlasses = async () => {
    const glasses = 9;
    const svg = await contracts.nounsDescriptor.glasses(glasses);
    console.log(`svg glasses: ${svg}`);

    return svg;
  };
  const getAccessory = async () => {
    const accessory = 1;
    const svg = await contracts.nounsDescriptor.accessories(accessory);
    console.log(`svg accessories: ${svg}`);
    return svg;
  };
  const getBody = async () => {
    const body = 1;
    const svg = await contracts.nounsDescriptor.bodies(body);
    console.log(`svg bodies: ${svg}`);
    return svg;
  };

  const id = BigNumber.from(3);

  const nounSeed = useNounSeed(id);
  console.log(`SEED: ${nounSeed}`);

  return (
    <div className={classes.App}>
      <button onClick={() => generateNoun()}>Generate Noun</button>
      <br />
      <button onClick={() => getHead()}>Fetch Head</button>
      <button onClick={() => getGlasses()}>Fetch Glasses</button>
      <button onClick={() => getAccessory()}>Fetch Accessory</button>
      <button onClick={() => getBody()}>Fetch Body</button>
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
        <div dangerouslySetInnerHTML={{ __html: currentImg }}></div>
        <div>{currentSeed && JSON.stringify(currentSeed)}</div>
      </div> */}
      <StandaloneNounImage nounId={id} />
    </div>
  );
};
export default Generate;
