import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import Auction from '../../components/Auction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import { useAuction } from '../../wrappers/nounsAuction';
import { setUseGreyBackground } from '../../state/slices/application';
import { useAppDispatch } from '../../hooks';
import config from '../../config';

const AuctionPage = () => {
  const auction = useAuction(config.auctionProxyAddress);

  const dispatch = useAppDispatch();
  const bgColorHandler = (useGrey: boolean) => {
    dispatch(setUseGreyBackground(useGrey));
  };

  return (
    <>
      <Auction auction={auction} bgColorHandler={bgColorHandler} />
      <Banner />
      <HistoryCollection
        latestNounId={auction && BigNumber.from(auction.nounId).sub(1)}
        historyCount={10}
        rtl={true}
      />
      <Documentation />
    </>
  );
};

export default AuctionPage;
