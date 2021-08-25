import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import { useAuction } from '../../wrappers/nounsAuction';
import { setUseGreyBackground } from '../../state/slices/application';
import { useAppDispatch, useAppSelector } from '../../hooks';
import config from '../../config';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const auction = useAuction(config.auctionProxyAddress);
  const onDisplayAuction = useOnDisplayAuction();
  const onDisplayAuctionId = useAppSelector(state => state.onDisplayAuction.onDisplayAuctionNounId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialAuctionId && !onDisplayAuction && auction)
      dispatch(setOnDisplayAuctionNounId(auction.nounId.toNumber()));
  }, [initialAuctionId, auction, onDisplayAuctionId, dispatch, onDisplayAuction]);

  if (initialAuctionId) dispatch(setOnDisplayAuctionNounId(initialAuctionId));

  return (
    <>
      {onDisplayAuction && (
        <Auction
          auction={onDisplayAuction}
          bgColorHandler={useGrey => dispatch(setUseGreyBackground(useGrey))}
        />
      )}
      <Banner />
      <HistoryCollection
        latestNounId={auction && BigNumber.from(auction.nounId)}
        historyCount={10}
      />
      <Documentation />
    </>
  );
};
export default AuctionPage;
