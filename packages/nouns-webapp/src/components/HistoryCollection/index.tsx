import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneToken from '../StandaloneToken';
import { LoadingPunk } from '../Punk';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestTokenId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestTokenId } = props;

  if (!latestTokenId) return null;

  const startAtZero = BigNumber.from(latestTokenId).sub(historyCount).lt(0);

  let tokenIds: Array<BigNumber | null> = new Array(historyCount);
  tokenIds = tokenIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestTokenId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestTokenId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const tokensContent = tokenIds.map((tokenId, i) => {
    return !tokenId ? <LoadingPunk key={i} /> : <StandaloneToken key={i} tokenId={tokenId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && tokensContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
