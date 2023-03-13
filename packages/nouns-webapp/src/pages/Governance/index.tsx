import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { ProposalState, useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';
import SnapshotProposals from '../../components/SnapshotProposals';

const snapshotProposals = [
  {
    id: '0x7f4db41648494a7406d58a2a621280fb3568aaa87c5f26aadd36b1f657a0e7a9',
    title: 'Nouns DAO Split (a version of ragequit) Urgency Signaling',
    status: ProposalState.ACTIVE,
    startDateMs: 1678406400000,
    endDateMs: 1679356800000,
  },
];

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  // Note: We have to extract this copy out of the <span> otherwise the Lingui macro gets confused
  const nounSingular = <Trans>Noun</Trans>;
  const nounPlural = <Trans>Nouns</Trans>;

  return (
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
        <p className={classes.subheading}>
          <Trans>
            Nouns govern <span className={classes.boldText}>Nouns DAO</span>. Nouns can vote on
            proposals or delegate their vote to a third party. A minimum of{' '}
            <span className={classes.boldText}>
              {nounsRequired} {threshold === 0 ? nounSingular : nounPlural}
            </span>{' '}
            is required to submit proposals.
          </Trans>
        </p>

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
                  {treasuryBalance &&
                    i18n.number(Number(Number(utils.formatEther(treasuryBalance)).toFixed(0)))}
                </h1>
              </Col>
              <Col className={classes.usdTreasuryAmt}>
                <h1 className={classes.usdBalance}>
                  {treasuryBalanceUSD &&
                    i18n.number(Number(treasuryBalanceUSD.toFixed(0)), {
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
        <SnapshotProposals proposals={snapshotProposals} />
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
