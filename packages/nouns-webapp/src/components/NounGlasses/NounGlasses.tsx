import { Row } from 'react-bootstrap';
import LeftHandle from './LeftHandle';
import NounsLens from './NounsLens';
import CenterHandle from './CenterHandle';
import ActivityLens from './ActivityLens';

import { useNounToken } from '../../wrappers/nounToken';
import {
  useAuction,
  auctionHouseContractFactory,
  AuctionHouseContractFunctions,
} from '../../wrappers/nounsAuction';
import { useContractFunction } from '@usedapp/core';
import { BigNumber, utils } from '@usedapp/core/node_modules/ethers';
import config from '../../config';

const NounGlasses = () => {
  const noun = useNounToken(BigNumber.from('33'));
  const auction = useAuction(config.auctionProxyAddress);

  const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);
  const { state, send } = useContractFunction(
    auctionHouseContract as any,
    AuctionHouseContractFunctions.createBid,
  );

  const placeBid = (bidAmount: number) => {
    send(auction.nounId, { value: utils.parseEther(bidAmount.toString()) });
  };

  return (
    <Row noGutters={true}>
      <LeftHandle nounId={auction ? auction.nounId.toString() : ''} />
      <NounsLens imgSrc={noun ? noun.image : ''} />
      <CenterHandle />
      <ActivityLens onPlaceBid={placeBid} />
    </Row>
  );
};

export default NounGlasses;
