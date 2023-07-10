import React from 'react';
import classes from './RepPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useAppSelector } from '../../hooks';
import { RepTokens, useRepCall } from '../../wrappers/repTokens';
import useFetch from './useFetch';
import useCallJake from './useCallJake';

const RepPage = () => {

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  // const testBalance = useCallJake('balanceOf', [activeAccount, 0]);
  // const testBalance2 = useCallJake('balanceOf', [activeAccount, 1]);
  // console.log(testBalance);
  // console.log(testBalance2);

  // const soulboundBalance = useCallJake('balanceOf', [activeAccount, 0]);
  // const transferableBalance = useCallJake('balanceOf', [activeAccount, 1]);
  // console.log("trying call");
  // const soulboundTokenURI = useCallJake('uri', [0]);
  // const soulboundJson = useFetch(soulboundTokenURI);

  // const redeemableTokenURI = useCallJake('uri', [1]);
  // const redeemableJson = useFetch(redeemableTokenURI);

  return (
    <Section fullWidth={false} className={classes.section}>
      <Row className={classes.headerRow}>
        <span>
          <Trans>Reputation</Trans>
        </span>
        <h1>
          <Trans>ATX REP</Trans>
        </h1>
      </Row>
      <Col sm={12} md={6} className={classes.wrapper}>
        <p>
          A on-chain reputation system for tracking and rewarding contributions. REP consists of an ERC1155 smart contract with two tokens on the Polygon Network. An equal amount of both tokens will be awarded to community members when distributed.
        </p>
        <Row>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>On-Chain Activity</b><br />
            </p>
            <p>
            REP will enable us to reward our most active community members and incentivize engagement with our events, initiatives and projects.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Lasting Recognition</b><br />
            </p>
            <p>
            As we further decentralize, REP will help visualize and track both the contributions that have brought us to where we are now and where the beating heart of the DAO is today.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Holistic Admission</b><br />
            </p>
            <p>
            Through REP, non-members can build concretely towards a full membership through their engagement and contributions.
            </p>
          </Col>
        </Row>
      </Col>
      <Col sm={12} md={6}>
        <Card className={classes.card}>
          <Row>
            <h3 style={{marginBottom:'2rem', marginTop:'1rem'}}>Your REP Tokens</h3>
            <Col sm={12} md={6}>
              <div className={classes.container}>
                {/* {
                  redeemableJson.data === undefined ?
                  <div></div> :
                  <img src={redeemableJson.data?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/>
                } */}
                <div className={classes.overlay}></div>
                <h3 className={classes.centered }>
                  {/* {Number(transferableBalance)} */}
                  </h3>
              </div>
              <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                {/* {redeemableJson.data?.name} */}
              </h4>
              <p style={{textAlign: 'center'}}>
                {/* {redeemableJson.data?.description} */}
                </p>
            </Col>
            <Col sm={12} md={6}>
              <div className={classes.container}>
                {/* {
                soulboundJson.data === undefined ?
                <div></div> :
                <img src={soulboundJson.data?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/>
                } */}
                <div className={classes.overlay}></div>
                <h3 className={classes.centered }>
                  {/* {Number(soulboundBalance)} */}
                </h3>
              </div>
              <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                {/* {soulboundJson.data?.name} */}
                </h4>
              <p  style={{textAlign: 'center'}}>
                {/* {soulboundJson.data?.description} */}
                </p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Section>
  );
};

export default RepPage;
