import { Row } from 'react-bootstrap';
import NounsLens from './NounsLens';
import ActivityLens from './ActivityLens';
import LoadingNounLens from './LoadingNounLens';

import { useAuction } from '../../wrappers/nounsAuction';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import config from '../../config';
import StandaloneNoun from '../StandaloneNoun';

const NounGlasses = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Row noGutters={true}>
      {auction ? <NounsLens nounId={BigNumber.from(auction.nounId)} /> : <LoadingNounLens />}
      <ActivityLens auction={auction && auction} />
    </Row>
  );
};

export default NounGlasses;
