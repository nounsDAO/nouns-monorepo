import { Row } from 'react-bootstrap';
import LeftHandle from './LeftHandle';
import NounsLens from './NounsLens';
import CenterHandle from './CenterHandle';
import ActivityLens from './ActivityLens';

import { useNounToken } from '../../wrappers/nounToken';
import { useAuction } from '../../wrappers/nounsAuction';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import config from '../../config';

const NounGlasses = () => {
  const noun = useNounToken(BigNumber.from('33'));
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <Row noGutters={true}>
      <LeftHandle nounId={auction ? auction.nounId.toString() : ''} />
      <NounsLens imgSrc={noun ? noun.image : ''} />
      <CenterHandle />
      <ActivityLens />
    </Row>
  );
};

export default NounGlasses;
