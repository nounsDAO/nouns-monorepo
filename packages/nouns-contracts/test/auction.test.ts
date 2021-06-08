import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers, upgrades } from 'hardhat';
import { NounsAuctionHouse, NounsErc721, Weth } from '../typechain';
import { deployNounsErc721, deployWeth } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsAuctionHouse', () => {
  let nounsAuctionHouse: NounsAuctionHouse;
  let nounsErc721: NounsErc721;
  let weth: Weth;
  let noundersDAO: SignerWithAddress;
  let nounsDAO: SignerWithAddress;

  const TIME_BUFFER = 15 * 60;
  const MIN_INCREMENT_BID_PERCENTAGE = 5;
  const DURATION = 60 * 60 * 24;

  async function deploy(deployer?: SignerWithAddress) {
    const auctionHouseFactory = await ethers.getContractFactory(
      'NounsAuctionHouse',
      deployer,
    );
    nounsAuctionHouse = (await upgrades.deployProxy(auctionHouseFactory, [
      nounsErc721.address,
      nounsDAO.address,
      noundersDAO.address,
      weth.address,
      TIME_BUFFER,
      MIN_INCREMENT_BID_PERCENTAGE,
      DURATION,
    ])) as NounsAuctionHouse;

    return nounsAuctionHouse.deployed();
  }

  beforeEach(async () => {
    [noundersDAO, nounsDAO] = await ethers.getSigners();
    nounsErc721 = await deployNounsErc721(noundersDAO);
    weth = await deployWeth(noundersDAO);
    await deploy(noundersDAO);

    await nounsErc721.transferOwnership(nounsAuctionHouse.address);
  });

  it('should allow the noundersDAO to create the first auction', async () => {
    const tx = await nounsAuctionHouse.createFirstAuction();
    await tx.wait();

    const auction = await nounsAuctionHouse.auction();
    expect(auction.startTime.toNumber()).to.be.greaterThan(0);
  });
});
