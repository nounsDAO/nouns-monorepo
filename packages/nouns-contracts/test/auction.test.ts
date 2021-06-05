import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { NounsAuctionHouse, Weth } from '../typechain';
import { deployWeth } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsAuctionHouse', () => {

  let weth: Weth;
  let nounsAuctionHouse: NounsAuctionHouse;

  async function deploy() {
    const auctionHouseFactory = await ethers.getContractFactory('NounsAuctionHouse');
    nounsAuctionHouse = await auctionHouseFactory.deploy(weth.address) as NounsAuctionHouse;
  }

  beforeEach(async () => {
    weth = await deployWeth();
    await deploy();
  });

  it('should deploy', async () => {
    expect(nounsAuctionHouse.address).to.not.be.null;
  });
});
