import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneNoun from '../StandaloneNoun';
import { LoadingNoun } from '../Noun';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounId } = props;

  if (!latestNounId) return null;

  const startAtZero = BigNumber.from(latestNounId).sub(historyCount).lt(0);

  let nounIds: Array<BigNumber | null> = new Array(historyCount);
  nounIds = nounIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestNounId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestNounId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const nounsContent = nounIds.map((nounId, i) => {
    return !nounId ? <LoadingNoun key={i} /> : <StandaloneNoun key={i} nounId={nounId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && nounsContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
