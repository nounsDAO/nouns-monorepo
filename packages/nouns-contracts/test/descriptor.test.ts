import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { formatUnits } from 'ethers/lib/utils';
import { NounsDescriptor } from '../typechain-types';
import { deployNounsDescriptor } from './utils';

chai.use(solidity);
const { expect } = chai;

describe('NounsDescriptor', () => {
  let nounsDescriptor: NounsDescriptor;
  let snapshotId: number;

  before(async () => {
    nounsDescriptor = await deployNounsDescriptor();
  });

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId]);
  });

  it('should return expected var values', async () => {
    const {
      volumeCountRange: vcR,
      maxVolumeHeightRange: mvhR,
      waterFeatureCountRange: wfcR,
      grassFeatureCountRange: gfcR,
      treeCountRange: tcR,
      bushCountRange: bcR,
      peopleCountRange: pcR,
      timeOfDayRange: todR,
      seasonRange: sR,
      greenRooftopPRange: grpR,
      siteEdgeOffsetRange: seoR,
      orientationRange: oR,
    } = await nounsDescriptor.getAttributeRanges();

    expect(vcR).to.deep.equal([2, 40]);
    expect(mvhR).to.deep.equal([5, 8]);
    expect(wfcR).to.deep.equal([5, 10]);
    expect(gfcR).to.deep.equal([5, 10]);
    expect(tcR).to.deep.equal([2, 20]);
    expect(bcR).to.deep.equal([0, 100]);
    expect(pcR).to.deep.equal([5, 20]);
    expect(todR).to.deep.equal([0, 2]);
    expect(sR).to.deep.equal([0, 3]);
    expect(grpR).to.deep.equal([0, 255]);

    expect([Number(formatUnits(seoR[0], 10)), Number(formatUnits(seoR[1], 10))]).to.deep.eq([
      0.1, 0.3,
    ]);
    expect([Number(formatUnits(oR[0], 10)), Number(formatUnits(oR[1], 10))]).to.deep.eq([0, 10]);
  });

  // TODO: add testing for locking
  // TODO: add setters checks
});
