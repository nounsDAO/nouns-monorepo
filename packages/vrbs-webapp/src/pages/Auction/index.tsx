import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionN00unId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { n00unPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import N00unsIntroSection from '../../components/N00unsIntroSection';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionN00unId = useAppSelector(state => state.onDisplayAuction.lastAuctionN00unId);
  const onDisplayAuctionN00unId = onDisplayAuction?.n00unId.toNumber();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionN00unId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds n00un path ids
      if (initialAuctionId > lastAuctionN00unId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionN00unId(lastAuctionN00unId));
        dispatch(push(n00unPath(lastAuctionN00unId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular n00un path ids on first load
          dispatch(setOnDisplayAuctionN00unId(initialAuctionId));
        }
      }
    } else {
      // no n00un path id set
      if (lastAuctionN00unId) {
        dispatch(setOnDisplayAuctionN00unId(lastAuctionN00unId));
      }
    }
  }, [lastAuctionN00unId, dispatch, initialAuctionId, onDisplayAuction]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  return (
    <>
      <Auction auction={onDisplayAuction} />
      {onDisplayAuctionN00unId !== undefined && onDisplayAuctionN00unId !== lastAuctionN00unId ? (
        <ProfileActivityFeed n00unId={onDisplayAuctionN00unId} />
      ) : (
        <N00unsIntroSection />
      )}
      <Documentation
        backgroundColor={
          onDisplayAuctionN00unId === undefined || onDisplayAuctionN00unId === lastAuctionN00unId
            ? backgroundColor
            : undefined
        }
      />
    </>
  );
};
export default AuctionPage;
