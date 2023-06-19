import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionVrbId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { vrbPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import VrbIntroSection from '../../components/VrbIntroSection';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionVrbId = useAppSelector(state => state.onDisplayAuction.lastAuctionVrbId);
  const onDisplayAuctionVrbId = onDisplayAuction?.vrbId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionVrbId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds vrb path ids
      if (initialAuctionId > lastAuctionVrbId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionVrbId(lastAuctionVrbId));
        dispatch(push(vrbPath(lastAuctionVrbId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular vrb path ids on first load
          dispatch(setOnDisplayAuctionVrbId(initialAuctionId));
        }
      }
    } else {
      // no vrb path id set
      if (lastAuctionVrbId) {
        dispatch(setOnDisplayAuctionVrbId(lastAuctionVrbId));
      }
    }
  }, [lastAuctionVrbId, dispatch, initialAuctionId, onDisplayAuction]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionVrbId !== undefined && onDisplayAuctionVrbId !== lastAuctionVrbId ? (
        <ProfileActivityFeed vrbId={onDisplayAuctionVrbId} />
      ) : (
        <VrbIntroSection />
      )}
      <Documentation
        backgroundColor={
          onDisplayAuctionVrbId === undefined || onDisplayAuctionVrbId === lastAuctionVrbId
            ? backgroundColor
            : undefined
        }
      />
    </>
  );
};
export default AuctionPage;
