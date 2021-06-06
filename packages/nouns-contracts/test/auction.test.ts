import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsAuctionHouse, NounsErc721, Weth } from '../typechain';
import { deployNounsErc721, deployWeth } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsAuctionHouse', () => {

  let weth: Weth;
  let nounsAuctionHouse: NounsAuctionHouse;
  let nounsErc721: NounsErc721;

  async function deploy() {
    const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse');
    nounsAuctionHouse = await auctionHouseFactory.deploy(weth.address, nounsErc721.address) as NounsAuctionHouse;
  }

  beforeEach(async () => {
    weth = await deployWeth();
    nounsErc721 = await deployNounsErc721();
    await deploy();
  });

  it('should deploy', async () => {
    expect(nounsAuctionHouse.address).to.not.be.null;
    expect(nounsErc721.address).to.not.be.null;
  });
});
