import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';
import { Trans } from '@lingui/macro';
import { i18n } from '@lingui/core';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : undefined;

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  // Note: We have to extract this copy out of the <span> otherwise the Lingui macro gets confused
  const nounSingular = <Trans>Noun</Trans>;
  const nounPlural = <Trans>Nouns</Trans>;
  const subHeading = (
    <Trans>
      Nouns govern <span className={classes.boldText}>Nouns DAO</span>. Nouns can vote on proposals
      or delegate their vote to a third party. A minimum of{' '}
      <span className={classes.boldText}>
        {nounsRequired ? (
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
        </Col>
      </Section>

      <Proposals proposals={proposals} nounsRequired={nounsRequired} />
    </>
  );
};
export default GovernancePage;
