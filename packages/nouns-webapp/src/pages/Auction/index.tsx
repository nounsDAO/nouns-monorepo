import { BigNumber } from 'ethers';
import Banner from '../../components/Banner';
import CurrentAuction from '../../components/CurrentAuction';
import Documentation from '../../components/Documentation';
import HistoryCollection from '../../components/HistoryCollection';
import config from '../../config';
import { useAuction } from '../../wrappers/nounsAuction';

const Auction = () => {
  const auction = useAuction(config.auctionProxyAddress);

  return (
    <>
      <CurrentAuction auction={auction} />
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
export default Auction;
