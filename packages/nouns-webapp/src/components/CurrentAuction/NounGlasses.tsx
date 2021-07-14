import { Row } from 'react-bootstrap';
import LeftHandle from './LeftHandle';
import NounsLens from './NounsLens';
import CenterHandle from './CenterHandle';
import ActivityLens from './ActivityLens';
import LoadingNounLens from './LoadingNounLens';

import { useAuction } from '../../wrappers/nounsAuction';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import config from '../../config';

const NounGlasses = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Row noGutters={true}>
      <LeftHandle />
      {auction ? <NounsLens nounId={BigNumber.from(auction.nounId)} /> : <LoadingNounLens />}
      <CenterHandle />
      <ActivityLens auction={auction && auction} />
    </Row>
  );
};

export default NounGlasses;
