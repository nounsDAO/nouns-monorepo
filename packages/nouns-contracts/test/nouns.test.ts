import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { NounsErc721 } from '../typechain';
import { deployNounsErc721 } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsErc721', () => {
  let nounsErc721: NounsErc721;

  beforeEach(async () => {
    nounsErc721 = await deployNounsErc721();
  });

  it('should set base URI', async () => {
    expect(await nounsErc721.baseURI()).to.eq('ipfs://');
  });
});
