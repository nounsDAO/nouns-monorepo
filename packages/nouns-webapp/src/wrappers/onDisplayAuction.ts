import { BigNumber } from '@ethersproject/bignumber';
import { ActiveAuction } from '../state/slices/auction';
import { useAppSelector } from '../hooks';

const useOnDisplayAuction = (): ActiveAuction | undefined => {
  const lastAuctionNounId = useAppSelector(state => state.auction.activeAuction?.nounId);
  const onDisplayAuctionNounId = useAppSelector(
    state => state.onDisplayAuction.onDisplayAuctionNounId,
  );
  const currentAuction = useAppSelector(state => state.auction.activeAuction);
  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);

  if (!onDisplayAuctionNounId || !lastAuctionNounId || !currentAuction || !pastAuctions) return;

  if (onDisplayAuctionNounId === lastAuctionNounId) {
    return currentAuction;
  } else {
    return pastAuctions.find(auction => {
      const nounId = auction.activeAuction && BigNumber.from(auction.activeAuction.nounId);
      return nounId && nounId.toNumber() === onDisplayAuctionNounId;
    })?.activeAuction;
  }
};
export default useOnDisplayAuction;
