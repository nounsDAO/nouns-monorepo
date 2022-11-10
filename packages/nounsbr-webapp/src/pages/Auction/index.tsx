import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounBRId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounbrPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounBRId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounBRId);
  const onDisplayAuctionNounBRId = onDisplayAuction?.nounbrId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounBRId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds nounbr path ids
      if (initialAuctionId > lastAuctionNounBRId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounBRId(lastAuctionNounBRId));
        dispatch(push(nounbrPath(lastAuctionNounBRId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular nounbr path ids on first load
          dispatch(setOnDisplayAuctionNounBRId(initialAuctionId));
        }
      }
    } else {
      // no nounbr path id set
      if (lastAuctionNounBRId) {
        dispatch(setOnDisplayAuctionNounBRId(lastAuctionNounBRId));
      }
    }
  }, [lastAuctionNounBRId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionNounBRId !== undefined && onDisplayAuctionNounBRId !== lastAuctionNounBRId ? (
        <ProfileActivityFeed nounbrId={onDisplayAuctionNounBRId} />
      ) : (
        <Banner />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
