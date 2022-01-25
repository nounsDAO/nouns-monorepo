import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Proposals from '../../components/Proposals';
import classes from './Governance.module.css';
import useLidoBalance from '../../hooks/useLidoBalance';
import { useEtherBalance } from '@usedapp/core';
import config from "../../config";
import { utils } from 'ethers/lib/ethers';
import { useEffect, useState } from 'react';

const GovernancePage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Noun' : 'Nouns'}`;

  // TODO make this its own hook
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const [treasuryBalanceUSD, setTreasuryBalanceUSD] = useState(0);
  const [ethUSDConversionRate, setEthUSDConversionRate] = useState(0);

  useEffect(() => {

    async function getEthPriceInUSD() {
      const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      const json = await response.json();
      setEthUSDConversionRate(Number(json?.USD));
    }

    if (!treasuryBalance) {
      return;
    }
    getEthPriceInUSD();

    setTreasuryBalanceUSD(
      Number(utils.formatEther(treasuryBalance)) * ethUSDConversionRate 
    );

  },[treasuryBalance, ethUSDConversionRate]);


  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={{ span: 10}} style={{
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Row className={classes.headerRow}>
          <span>Governance</span>
          <h1>Nouns DAO</h1>
        </Row>
        <p className={classes.subheading}>
          Nouns govern <span className={classes.boldText}>NounsDAO</span>. Nouns can vote on proposals or delegate their vote to a third
          party. A minimum of <span className={classes.boldText}>{nounThresholdCopy}</span> is required to submit proposals.
        </p>

        <div style={{
          marginBottom: '3rem',
          borderRadius: '20px',
          border: '1px solid #E2E3E8'
        }}>
          <Row>
            <Col lg={9} style={{
                borderRight: '1px solid #E2E3E8',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                paddingLeft: '2rem',
                paddingRight: '2rem'
              }}>
                <Row className={classes.headerRow}>
                  <span>Treasury</span>
                </Row>
                <Row>
                    <Col className={classes.headerRow} lg={4} style={{
                      borderRight: '1px solid #E2E3E8',
                      display: 'flex'
                    }}>
                      <h1 style={{fontFamily: 'PT Root UI', marginRight: '.5rem'}}>Ξ</h1><h1>{treasuryBalance && Number(Number(utils.formatEther(treasuryBalance)).toFixed(0)).toLocaleString('en-US')}</h1>
                    </Col>
                    <Col>
                      <h1 style={{
                        color: 'var(--brand-gray-light-text)',
                        fontFamily: 'Londrina Solid'
                      }}>$ {treasuryBalanceUSD && Number(treasuryBalanceUSD.toFixed(0)).toLocaleString('en-US')}</h1>
                    </Col>
                </Row>
            </Col>
            <Col style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              fontFamily: 'PT Root UI'
            }}>
              This treasury exists for <span className={classes.boldText}>NounsDAO</span> participants to allocate resources
              for the long-term growth and
              prosperity of the Nouns project.
            </Col>
          </Row>
        </div>

        <Proposals proposals={proposals} />
      </Col>
    </Section>
  );
};
export default GovernancePage;
