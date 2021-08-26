import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import { setUseGreyBackground } from '../../state/slices/application';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  const dispatch = useAppDispatch();

  if (initialAuctionId) {
    dispatch(setOnDisplayAuctionNounId(initialAuctionId));
  } else {
    if (lastAuctionNounId) dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
  }

  return (
    <>
      {onDisplayAuction && (
        <Auction
          auction={onDisplayAuction}
          bgColorHandler={useGrey => dispatch(setUseGreyBackground(useGrey))}
        />
      )}
      <Banner />
      {lastAuctionNounId && (
        <HistoryCollection latestNounId={BigNumber.from(lastAuctionNounId)} historyCount={10} />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
