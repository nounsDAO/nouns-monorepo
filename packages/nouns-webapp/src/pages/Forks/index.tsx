import React from 'react'
import { Fork, useForks } from '../../wrappers/nounsDao';
import { Link } from 'react-router-dom';
import Section from '../../layout/Section';
import { Col, Row } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import classes from './Forks.module.css';

type Props = {}

const ForksPage: React.FC<Props> = props => {
  const forks = useForks(0);
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const timestamp = forks.data[forks.data.length - 1].forkingPeriodEndTimestamp;
  const isLatestForkFinished = forks.data && timestamp && currentTime && +timestamp < currentTime;
  // const isLatestForkFinished = forks.data && forks.data[forks.data.length - 1].executed && forks.data[forks.data.length - 1].forkingPeriodEndTimestamp && +forks.data[forks.data.length - 1].forkingPeriodEndTimestamp < now.getTime() / 1000;
  const nextForkId = forks.data && forks.data.length;
  return (
    <div>
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.headerRow}>
            <span>
              <Trans>Governance</Trans>
            </span>
            <h1>
              <Trans>Forks</Trans>
            </h1>
          </Row>
          <p className={classes.subheading}>
            <Trans>
              TKTKTK Nouns govern <span className={classes.boldText}>Nouns DAO</span>. Nouns can vote on
              proposals or delegate their vote to a third party.
            </Trans>
          </p>


        </Col>
      </Section>
      {/* if latest fork id is finished forking, display a callout with an option to start a new fork. */}
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.forksList}>

            {forks.data && forks.data.map((fork: Fork, i: number) => {
              return (
                <div key={i}>
                  <Link to={`/fork/${fork.id}`}>
                    {fork.id}
                  </Link>
                </div>
              )
            })}
          </Row>
          <Row>
            {isLatestForkFinished && nextForkId && (
              <div>
                <p>
                  The latest fork is finished forking. Start a new fork.
                </p>
                <Link to={`/fork/${nextForkId}`}>
                  Start a new fork
                </Link>
              </div>
            )}
          </Row>
        </Col>
      </Section>
    </div>
  )
}

export default ForksPage