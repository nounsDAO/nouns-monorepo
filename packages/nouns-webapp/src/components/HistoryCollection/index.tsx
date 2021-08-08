import { BigNumber, BigNumberish } from 'ethers';
import Section from '../../layout/Section';
import classes from './HistoryCollection.module.css';
import clsx from 'clsx';
import StandaloneNoun from '../StandaloneNoun';
import config from '../../config';
import { Container, Row } from 'react-bootstrap';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: BigNumberish;
  rtl: boolean;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = (props: HistoryCollectionProps) => {
  const { historyCount, latestNounId, rtl } = props;

  let nounIds =
    latestNounId &&
    new Array(historyCount)
      .fill(0)
      .map((_, i) => BigNumber.from(latestNounId).sub(BigNumber.from(i)));

  rtl && nounIds && nounIds.reverse();

  return (
    <Section bgColor="white" fullWidth={true}>
      <Container fluid>
        <Row className="justify-content-md-center">
          <div className={clsx(classes.historyCollection, rtl && classes.rtl)}>
            {config.enableHistory &&
              nounIds &&
              nounIds.map((nounId, i) => <StandaloneNoun key={i} nounId={nounId} />)}
          </div>
        </Row>
      </Container>
    </Section>
  );
};

export default HistoryCollection;
