import React from 'react';
import classes from './RepPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useAppSelector } from '../../hooks';
import { RepTokens, useRepCall } from '../../wrappers/repTokens';
import useFetch from './useFetch';

const RepPage = () => {

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const soulboundBalance = useRepCall('balanceOf', [activeAccount, 0]);
  const transferableBalance = useRepCall('balanceOf', [activeAccount, 1]);
  console.log("trying call");
  const soulboundTokenURI = useRepCall('uri', [0]);
  const soulboundJson = useFetch(soulboundTokenURI);

  const redeemableTokenURI = useRepCall('uri', [1]);
  const redeemableJson = useFetch(redeemableTokenURI);

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>
            <Trans>Reputation</Trans>
          </span>
          <h1>
            <Trans>ATX REP</Trans>
          </h1>
          <span>
            <Trans>Your Tokens:</Trans>
          </span>
          <span>
            <Trans>Lifetime: {soulboundBalance}</Trans>
          </span>
          <span>
            <Trans>Redeemable: {transferableBalance}</Trans>
          </span>
          <span>
            { 
              soulboundJson.data === undefined ?
              <div></div> : 
              <img src={soulboundJson.data?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/> 
            }
            <p>{soulboundJson.data?.name}</p>
            <p>{soulboundJson.data?.description}</p>
          </span>
          <span>
          { 
              redeemableJson.data === undefined ?
              <div></div> : 
              <img src={redeemableJson.data?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/> 
            }
            <p>{redeemableJson.data?.name}</p>
            <p>{redeemableJson.data?.description}</p>
          </span>
        </Row>
        <p style={{ textAlign: 'justify' }}>
          A on-chain reputation system for tracking and rewarding contributions. REP consists of an ERC1155 smart contract with two tokens on the Polygon Network. An equal amount of both tokens will be awarded to community members when distributed.
        </p>
        <Row>
          <Col>
            <p style={{ textAlign: 'center' }}>
            <b>On-Chain Activity</b><br />
            </p>
            <p>
            REP will enable us to reward our most active community members and incentivize engagement with our events, initiatives and projects.
            </p>
          </Col>
          <Col>
            <p style={{ textAlign: 'center' }}>
            <b>Lasting Recognition</b><br />
            </p>
            <p>
            As we further decentralize, REP will help visualize and track both the contributions that have brought us to where we are now and where the beating heart of the DAO is today.
            </p>
          </Col>
          <Col>
            <p style={{ textAlign: 'center' }}>
            <b>Holistic Admission</b><br />
            </p>
            <p>
            Through REP, non-members can build concretely towards a full membership through their engagement and contributions.
            </p>
          </Col>
        </Row>
      </Col>
    </Section>
  );
};

export default RepPage;
