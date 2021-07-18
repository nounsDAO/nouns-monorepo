import { Col } from 'react-bootstrap';
import { useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';
import StandaloneNoun from '../StandaloneNoun';
import AuctionActivity from './AuctionActivity';
import Section from '../Section';
import Noun from '../Shared/Noun';
import { Image } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';

const CurrentAuction = () => {
  const auction = useAuction(config.auctionProxyAddress);

  const testnetContent = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Image src={testnetNoun} fluid />
      <h1 style={{ fontFamily: 'Londrina Solid', fontSize: '2rem', color: '#504f49' }}>
        TESTNET VERSION
      </h1>
    </div>
  );

  return (
    <Section bgColor="transparent" fullWidth={false}>
      <Col lg={{ span: 5, offset: 1 }}>
        {auction ? (
          <>
            {testnetContent}
            <StandaloneNoun nounId={auction.nounId} />
          </>
        ) : (
          <Noun imgPath="" alt="" />
        )}
      </Col>
      <Col lg={6}>
        <AuctionActivity auction={auction && auction} />
      </Col>
    </Section>
  );
};

export default CurrentAuction;
