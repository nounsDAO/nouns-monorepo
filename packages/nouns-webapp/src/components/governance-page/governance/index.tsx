'use client';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import {
  useReadNounsTreasuryBalancesInEth,
  useReadNounsTreasuryBalancesInUsd,
} from '@nouns/sdk/react/treasury';
import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import { formatEther, formatUnits } from 'viem';

import Proposals from '@/components/proposals';
import Section from '@/components/section';
import { useAllProposals, useProposalThreshold } from '@/wrappers/nounsDao';

import classes from './Governance.module.css';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold == null ? undefined : threshold + 1;

  const treasuryBalance = useReadNounsTreasuryBalancesInEth({
    query: {
      select: balances => {
        console.log('eth', balances);
        return balances.total;
      },
    },
  }).data;
  const treasuryBalanceUSD = useReadNounsTreasuryBalancesInUsd({
    query: {
      select: balances => {
        console.log(
          'usd',
          Object.entries(balances).map(([token, value]) => [token, formatUnits(value, 6)]),
        );
        return balances.total;
      },
    },
  }).data;

  // Note: We have to extract this copy out of the <span> otherwise the Lingui macro gets confused
  const nounSingular = <Trans>Noun</Trans>;
  const nounPlural = <Trans>Nouns</Trans>;
  const subHeading = (
    <Trans>
      Nouns govern <span className={classes.boldText}>Nouns DAO</span>. Nouns can vote on proposals
      or delegate their vote to a third party. A minimum of{' '}
      <span className={classes.boldText}>
        {nounsRequired !== undefined ? (
          <>
            {nounsRequired} {threshold === 0 ? nounSingular : nounPlural}
          </>
        ) : (
          '...'
        )}
      </span>{' '}
      is required to submit proposals.
    </Trans>
  );

  return (
    <>
      <Section fullWidth={false} className={classes.section}>
        <Col lg={10} className={classes.wrapper}>
          <Row className={classes.headerRow}>
            <span>
              <Trans>Governance</Trans>
            </span>
            <h1>
              <Trans>Nouns DAO</Trans>
            </h1>
          </Row>
          <p className={classes.subheading}>{subHeading}</p>

          <Row className={classes.treasuryInfoCard}>
            <Col lg={8} className={classes.treasuryAmtWrapper}>
              <Row className={classes.headerRow}>
                <span>
                  <Trans>Treasury</Trans>
                </span>
              </Row>
              <Row>
                <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                  <h1 className={classes.ethSymbol}>Ξ</h1>
                  <h1>
                    {treasuryBalance != undefined &&
                      i18n.number(Number(Number(formatEther(treasuryBalance)).toFixed(0)))}
                  </h1>
                </Col>
                <Col className={classes.usdTreasuryAmt}>
                  <h1 className={classes.usdBalance}>
                    {treasuryBalanceUSD !== undefined &&
                      i18n.number(Number(formatUnits(treasuryBalanceUSD, 6)), {
                        style: 'currency',
                        currency: 'USD',
                      })}
                  </h1>
                </Col>
              </Row>
            </Col>
            <Col className={classes.treasuryInfoText}>
              <Trans>
                This treasury exists for <span className={classes.boldText}>Nouns DAO</span>{' '}
                participants to allocate resources for the long-term growth and prosperity of the
                Nouns project.
              </Trans>
            </Col>
          </Row>
        </Col>
      </Section>

      <Proposals proposals={proposals ?? []} nounsRequired={nounsRequired} />
    </>
  );
};
export default GovernancePage;
