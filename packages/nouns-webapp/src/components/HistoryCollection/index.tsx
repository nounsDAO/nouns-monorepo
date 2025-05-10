import React from 'react';

import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import { LoadingNoun } from '@/components/Noun';
import StandaloneNoun from '@/components/StandaloneNoun';
import config from '@/config';
import Section from '@/layout/Section';

import classes from './HistoryCollection.module.css';

interface HistoryCollectionProps {
  historyCount: number;
  latestNounId: bigint | boolean | number | string;
}

const HistoryCollection: React.FC<HistoryCollectionProps> = ({
  historyCount,
  latestNounId,
}: HistoryCollectionProps) => {
  if (!latestNounId) return null;

  const startAtZero = BigInt(latestNounId) - BigInt(historyCount) < 0n;

  let nounIds: Array<bigint | null> = new Array(historyCount);
  nounIds = nounIds.fill(null).map((_, i) => {
    if (BigInt(i) < BigInt(latestNounId)) {
      const index = startAtZero ? BigInt(0) : BigInt(Number(latestNounId) - historyCount);
      return index + BigInt(i);
    } else {
      return null;
    }
  });

  const nounsContent = nounIds.map((nounId, i) => {
    return !nounId ? <LoadingNoun key={i} /> : <StandaloneNoun key={i} nounId={BigInt(nounId)} />;
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
