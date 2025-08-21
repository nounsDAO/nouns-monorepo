'use client';

import React from 'react';

import { Trans } from '@lingui/react/macro';
import { cn } from '@/lib/utils';
import { Col, Row } from 'react-bootstrap';

import ForkStatus from '@/components/fork-status';
import Section from '@/components/section';
import { Fork, ForkState, useForks } from '@/wrappers/nouns-dao';
import { Link } from 'react-router';

import classes from './forks.module.css';

const ForksPage: React.FC = () => {
  const forks = useForks();
  const now = new Date();
  const currentTime = now.getTime() / 1000;
  const lastForkEndTs =
    Array.isArray(forks.data) && forks.data.length > 0
      ? Number(forks.data[forks.data.length - 1].forkingPeriodEndTimestamp)
      : undefined;
  const isLatestForkFinished =
    Number.isFinite(lastForkEndTs) && (lastForkEndTs as number) < currentTime;
  const nextForkId = Array.isArray(forks.data) ? forks.data.length : undefined;

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
          <p className={cn(classes.subheading, 'm-0')}>
            <Trans>
              Forking is the crypto-native way for groups of token holders to exit together into a
              new instance of their protocol, resulting in maximal conservation of momentum in the
              ecosystem.
            </Trans>
          </p>
          <p className={cn(classes.subheading, 'mt-0')}>
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
      {/* if the latest fork id is finished forking, display a callout with an option to start a new fork. */}
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.forksList}>
            {Array.isArray(forks.data) && forks.data.length > 0
              ? forks.data
                  .map((fork: Fork, i: number) => {
                    const forkEndTs = Number(fork.forkingPeriodEndTimestamp);
                    const isForkPeriodActive =
                      Number.isFinite(forkEndTs) && forkEndTs > currentTime;
                    let status = ForkState.ESCROW;
                    if (isForkPeriodActive) {
                      status = ForkState.ACTIVE;
                    } else if (fork.executed === true) {
                      status = ForkState.EXECUTED;
                    }

                    return (
                      <Link to={`/fork/${fork.id}`} className={classes.forkCard} key={i}>
                        <div className={classes.title}>Nouns DAO Fork #{fork.id}</div>
                        <div
                          className={cn(classes.proposalStatusWrapper, classes.votePillWrapper)}
                        >
                          <ForkStatus status={status} />
                        </div>
                      </Link>
                    );
                  })
                  .reverse()
              : null}
          </Row>
          <Row>
            {((Array.isArray(forks.data) && forks.data.length === 0) ||
              (isLatestForkFinished && typeof nextForkId === 'number')) && (
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
