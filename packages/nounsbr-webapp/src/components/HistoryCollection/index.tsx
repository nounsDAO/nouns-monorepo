import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneNounBR from '../StandaloneNounBR';
import { LoadingNounBR } from '../NounBR';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounBRId: BigNumberish;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounBRId } = props;

  if (!latestNounBRId) return null;

  const startAtZero = BigNumber.from(latestNounBRId).sub(historyCount).lt(0);

  let nounbrIds: Array<BigNumber | null> = new Array(historyCount);
  nounbrIds = nounbrIds.fill(null).map((_, i) => {
    if (BigNumber.from(i).lt(latestNounBRId)) {
      const index = startAtZero
        ? BigNumber.from(0)
        : BigNumber.from(Number(latestNounBRId) - historyCount);
      return index.add(i);
    } else {
      return null;
    }
  });

  const nounsbrContent = nounbrIds.map((nounbrId, i) => {
    return !nounbrId ? <LoadingNounBR key={i} /> : <StandaloneNounBR key={i} nounbrId={nounbrId} />;
  });

  return (
    <Section fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection)}>
            {config.app.enableHistory && nounsbrContent}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
