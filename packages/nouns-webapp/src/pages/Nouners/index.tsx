import React from 'react';
import classes from './NounBRersPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Button } from 'react-bootstrap';
import { Trans } from '@lingui/macro';

const NounBRersPage = () => {
  return (
    <Section fullWidth={true} className={classes.nounbrersPage}>
      <Col lg={{ span: 6, offset: 3 }}>

        {/******************************************************/}
        <Row className={classes.headerRow}>
          <span><Trans>NounBRers</Trans></span>
          <h1><Trans>Welcome, NounBRer!</Trans></h1>
        </Row>
             
        <br />
        <br />
                
        <Row className={classes.pictureCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span><Trans>Next steps</Trans></span>
            </Row>
            <Row>
              <Col>
              <Trans>So you just won a NounBR.... Cool! Be sure to go over how everything works and head over to our discord server to verify your NounBR!</Trans>
              </Col>
            </Row>
          </Col>

          <Col className={classes.treasuryInfoText}>
            <div className={classes.verifyButtonWrapper}>
              <a href={`https://discord.gg/?????`}>
            <Button className={classes.generateBtn}><Trans>Join</Trans></Button>
          </a>
            </div>
          </Col>
        </Row>

        {/******************************************************/}
        <h2><Trans>Discord Channels</Trans></h2>
          <br />

          {/*--------------------------------------------------*/}
          <h3><Trans>Welcome</Trans></h3>
            <Col style={{ textAlign: 'justify' }}>
            <Trans>Basic information, major announbrcements, and user verification. If you just bought a
              NounBR, you will need to verify your ownership in the #authentication channel to get added to the
              "NounBRer" role of the server.</Trans>
            </Col>
            <br />

          {/*--------------------------------------------------*/}
          <h3><Trans>NounsBR DAO</Trans></h3>
            <Col style={{ textAlign: 'justify' }}>
            <Trans>These are channels where only NounsBR DAO members can post. In the spirit of having an open
              and collaborative environment, all of these channels (except for #nounbrer-private) are
              viewable by the public.</Trans>
            </Col>
            <br />
            
            <a
              href={`https://discord.com/channels/?????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              <Trans>#nounsbr-chat</Trans>
            </a>
            <Col style={{ textAlign: 'justify' }}>
            <Trans>This is where most communication between members occurs. Anything that doesn't fit in
              the other NounBRers channels likely goes here.</Trans>
            </Col>
            <br />

            <a
              href={`https://discord.com/channels/??????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              <Trans>#proposals</Trans>
            </a>
            <Col style={{ textAlign: 'justify' }}>
            <Trans>Discussion and questions about proposals.</Trans>
            </Col>
            <br />

            <a
              href={`https://discord.com/channels/??????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              <Trans>#nounbrer-private</Trans>
            </a>
            <Col style={{ textAlign: 'justify' }}>
            <Trans>While we generally prefer to keep everything out in the open, sometimes there are
              sensitive matters where information is only kept to members.</Trans>
            </Col>
            <br />

          {/*--------------------------------------------------*/}
          <h3><Trans>General</Trans></h3>
          <Col style={{ textAlign: 'justify' }}>
          <Trans>These are channels where anyone can post.</Trans>
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/??????`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            <Trans>#general-chat</Trans>
          </a>
          <Col style={{ textAlign: 'justify' }}>
          <Trans>The most active channel, and the other are topic specific. Non-members often post in
            these channels asking for guidance on proposal ideas, or to share things they have made.</Trans>
          </Col>
          <br />

          {/*--------------------------------------------------*/}
          <h3><Trans>Projects</Trans></h3>
          <Col style={{ textAlign: 'justify' }}>
          <Trans>When a project passes an on-chain vote, the creator of that proposal will often be given
            their own channel in this section to answer questions and share updates on the status of
            their work. This is a constantly expanding list - for more information on each of these,
            check out the DAO section of the NounsBR website.</Trans>
          </Col>
          <br />
          
      </Col>
    </Section>
  );
};

export default NounBRersPage;
