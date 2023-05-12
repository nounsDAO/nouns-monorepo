import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionTokenId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { tokenPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import React, { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionTokenId = useAppSelector(state => state.onDisplayAuction.lastAuctionTokenId);
  const onDisplayAuctionTokenId = onDisplayAuction?.tokenId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("LAST_AUCTION", initialAuctionId)
    if (!lastAuctionTokenId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds token path ids
      if (initialAuctionId > lastAuctionTokenId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionTokenId(lastAuctionTokenId));
        dispatch(push(tokenPath(lastAuctionTokenId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular token path ids on first load
          dispatch(setOnDisplayAuctionTokenId(initialAuctionId));
        }
      }
    } else {
      // no token path id set
      if (lastAuctionTokenId) {
        dispatch(setOnDisplayAuctionTokenId(lastAuctionTokenId));
      }
    }
  }, [lastAuctionTokenId, dispatch, initialAuctionId, onDisplayAuction]);

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionTokenId !== undefined && onDisplayAuctionTokenId !== lastAuctionTokenId ? (
        <ProfileActivityFeed tokenId={onDisplayAuctionTokenId} />
      ) : (
        <Banner />
      )}
      <Documentation />
    </>
  );
};
export default AuctionPage;
