import React from 'react';
import { Fork, ForkState, useForks } from '../../wrappers/nounsDao';
import { Link } from 'react-router-dom';
import Section from '../../layout/Section';
import { Col, Row } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import classes from './Forks.module.css';
import clsx from 'clsx';
import ForkStatus from '../../components/ForkStatus';

type Props = {};

const ForksPage: React.FC<Props> = props => {
  const forks = useForks();
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const timestamp =
    forks.data?.length > 0 && forks.data[forks.data.length - 1].forkingPeriodEndTimestamp;
  const isLatestForkFinished = forks?.data && timestamp && currentTime && +timestamp < currentTime;
  const nextForkId = forks?.data && forks.data?.length;

  return (
    <div>
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.headerRow}>
            <span>
              <Trans>Governance</Trans>
            </span>
            <h1>
              <Trans>Fork</Trans>
            </h1>
          </Row>
          <p className={clsx(classes.subheading, 'm-0')}>
            <Trans>
              Forking is the crypto-native way for groups of token holders to exit together into a
              new instance of their protocol, resulting in maximal conservation of momentum in the
              ecosystem.
            </Trans>
          </p>
          <p className={clsx(classes.subheading, 'mt-0')}>
            <a
              href="https://mirror.xyz/0x10072dfc23771101dC042fD0014f263316a6E400/iN0FKOn_oYVBzlJkwPwK2mhzaeL8K2-W80u82F7fHj8"
              target="_blank"
              rel="noreferrer"
            >
              Learn more about Nouns Fork
            </a>
          </p>
        </Col>
      </Section>
      {/* if latest fork id is finished forking, display a callout with an option to start a new fork. */}
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.forksList}>
            {forks?.data &&
              forks.data
                .map((fork: Fork, i: number) => {
                  const isForkPeriodActive =
                    fork.forkingPeriodEndTimestamp &&
                    currentTime &&
                    +fork.forkingPeriodEndTimestamp > currentTime;
                  let status = ForkState.ESCROW;
                  if (isForkPeriodActive) {
                    status = ForkState.ACTIVE;
                  } else if (fork.executed) {
                    status = ForkState.EXECUTED;
                  }

                  return (
                    <Link to={`/fork/${fork.id}`} className={classes.forkCard} key={i}>
                      <div className={classes.title}>Nouns DAO Fork #{fork.id}</div>
                      <div className={clsx(classes.proposalStatusWrapper, classes.votePillWrapper)}>
                        {/* <ForkStatus status={
                      fork.executed ? ForkState.EXECUTED : ForkState.ACTIVE} /> */}
                        <ForkStatus status={status} />
                      </div>
                    </Link>
                  );
                })
                .reverse()}
          </Row>
          <Row>
            {(forks?.data?.length === 0 || (isLatestForkFinished && nextForkId)) && (
              <div>
                <p className={classes.startFork}>
                  <Trans>There are no active forks.</Trans>{' '}
                  <Link to={`/fork/${nextForkId}`}>
                    <Trans>Start a new fork</Trans>
                  </Link>
                </p>
              </div>
            )}
          </Row>
        </Col>
      </Section>
    </div>
  );
};

export default ForksPage;
