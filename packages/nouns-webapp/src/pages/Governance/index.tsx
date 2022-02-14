import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import { utils } from 'ethers/lib/ethers';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTreasuryBalance } from '../../hooks/useTreasuryBalance';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Noun' : 'Nouns'}`;

  const treasuryBalance = useTreasuryBalance();
  const [treasuryBalanceUSD, setTreasuryBalanceUSD] = useState(0);
  const [ethUSDConversionRate, setEthUSDConversionRate] = useState(0);

  useEffect(() => {
    async function getEthPriceInUSD() {
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
      );
      const json = await response.json();
      setEthUSDConversionRate(Number(json?.USD));
    }

    if (!treasuryBalance) {
      return;
    }
    getEthPriceInUSD();

    setTreasuryBalanceUSD(Number(utils.formatEther(treasuryBalance)) * ethUSDConversionRate);
  }, [treasuryBalance, ethUSDConversionRate]);

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Governance</span>
          <h1>Nouns DAO</h1>
        </Row>
        <p className={classes.subheading}>
          Nouns govern <span className={classes.boldText}>NounsDAO</span>. Nouns can vote on
          proposals or delegate their vote to a third party. A minimum of{' '}
          <span className={classes.boldText}>{nounThresholdCopy}</span> is required to submit
          proposals.
        </p>

        <Row className={classes.treasuryInfoCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>Treasury</span>
            </Row>
            <Row>
              <Col className={clsx(classes.ethTreasuryAmt)} lg={3}>
                <h1 style={{ marginBottom: '0px' }} className={classes.ethSymbol}>
                  Ξ
                </h1>
                <h1 style={{ marginBottom: '0px' }}>
                  {treasuryBalance &&
                    Number(Number(utils.formatEther(treasuryBalance)).toFixed(0)).toLocaleString(
                      'en-US',
                    )}
                </h1>
              </Col>
              <Col className={classes.usdTreasuryAmt}>
                <h1 className={classes.usdBalance}>
                  ${' '}
                  {treasuryBalanceUSD &&
                    Number(treasuryBalanceUSD.toFixed(0)).toLocaleString('en-US')}
                </h1>
              </Col>
            </Row>
          </Col>
          <Col className={classes.treasuryInfoText}>
            This treasury exists for <span className={classes.boldText}>NounsDAO</span> participants
            to allocate resources for the long-term growth and prosperity of the Nouns project.
          </Col>
        </Row>
        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
