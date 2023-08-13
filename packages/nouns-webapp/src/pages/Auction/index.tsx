// import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setOnDisplayAuctionNounId } from '../../state/slices/onDisplayAuction';
import { push } from 'connected-react-router';
import { nounPath } from '../../utils/history';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';
import { useEffect } from 'react';
// import ProfileActivityFeed from '../../components/ProfileActivityFeed';
import NounsIntroSection from '../../components/NounsIntroSection';
import { useNftCall } from '../../wrappers/atxDaoNft/atxDaoNft';
import NumberGatedComponent from '../../components/NumberGatedComponent';
import { IS_MAINNET } from '../../config';
import { switchNetworkToLocalhost, switchNetworkToEthereum } from '../utils/NetworkSwitcher';

interface AuctionPageProps {
  initialAuctionId?: number;
}

const AuctionPage: React.FC<AuctionPageProps> = props => {
  const { initialAuctionId } = props;
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const onDisplayAuctionNounId = onDisplayAuction?.nounId.toNumber();
  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!lastAuctionNounId) return;

    if (initialAuctionId !== undefined) {
      // handle out of bounds noun path ids
      if (initialAuctionId > lastAuctionNounId || initialAuctionId < 0) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
        dispatch(push(nounPath(lastAuctionNounId)));
      } else {
        if (onDisplayAuction === undefined) {
          // handle regular noun path ids on first load
          dispatch(setOnDisplayAuctionNounId(initialAuctionId));
        }
      }
    } else {
      // no noun path id set
      if (lastAuctionNounId) {
        dispatch(setOnDisplayAuctionNounId(lastAuctionNounId));
      }
    }
  }, [lastAuctionNounId, dispatch, initialAuctionId, onDisplayAuction]);

  const isCoolBackground = useAppSelector(state => state.application.isCoolBackground);
  const backgroundColor = isCoolBackground
    ? 'var(--brand-cool-background)'
    : 'var(--brand-warm-background)';

  if (!IS_MAINNET) {
    switchNetworkToLocalhost();
  }
  else {
    switchNetworkToEthereum();
  }

  let result = useNftCall('balanceOf', [activeAccount]);
  if (result === undefined)
    (result as any) = 0;
  else
    (result as any) = result[0].toNumber();

  return (
    <>
    <NumberGatedComponent number={result}>
      <NounsIntroSection />
      <Documentation
        backgroundColor={
          onDisplayAuctionNounId === undefined || onDisplayAuctionNounId === lastAuctionNounId
            ? backgroundColor
            : undefined
        }
      />
    </NumberGatedComponent>
    {/* { output } */}
    </>
  );
};
export default AuctionPage;
