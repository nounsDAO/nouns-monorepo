import React from 'react';
import classes from './NounersPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Button } from 'react-bootstrap';


const NounersPage = () => {
  return (
    <Section fullWidth={true} className={classes.nounersPage}>
      <Col lg={{ span: 6, offset: 3 }}>

        {/******************************************************/}
        <Row className={classes.headerRow}>
          <span>NounersBR</span>
          <h1>Welcome, NounerBR!</h1>
        </Row>
             
        <br />
        <br />
                
        <Row className={classes.pictureCard}>
          <Col lg={8} className={classes.treasuryAmtWrapper}>
            <Row className={classes.headerRow}>
              <span>Next steps</span>
            </Row>
            <Row>
              <Col>
                So you just won a NounBR.... Cool! Be sure to go over how everything works and head over to our discord server to verify your NounBR!
              </Col>
            </Row>
          </Col>

          <Col className={classes.treasuryInfoText}>
            <div className={classes.verifyButtonWrapper}>
              <a href={`https://discord.gg/?????`}>
            <Button className={classes.generateBtn}>Collabland Join</Button>
          </a>
            </div>
          </Col>
        </Row>

        {/******************************************************/}
        <h2>Discord Channels</h2>
          <br />

          {/*--------------------------------------------------*/}
          <h3>Welcome</h3>
            <Col style={{ textAlign: 'justify' }}>
              Basic information, major announcements, and user verification. If you just bought a
              NounBR, you will need to verify your ownership in the #authentication channel to get added to the
              "NounerBR" role of the server.
            </Col>
            <br />

          {/*--------------------------------------------------*/}
          <h3>NounsBR DAO</h3>
            <Col style={{ textAlign: 'justify' }}>
              These are channels where only NounsBR DAO members can post. In the spirit of having an open
              and collaborative environment, all of these channels (except for #nounerbr-private) are
              viewable by the public.
            </Col>
            <br />
            
            <a
              href={`https://discord.com/channels/?????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              #nounsbr-chat
            </a>
            <Col style={{ textAlign: 'justify' }}>
              This is where most communication between members occurs. Anything that doesn't fit in
              the other NounersBR channels likely goes here.
            </Col>
            <br />

            <a
              href={`https://discord.com/channels/??????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              #proposals
            </a>
            <Col style={{ textAlign: 'justify' }}>
              Discussion and questions about proposals.
            </Col>
            <br />

            <a
              href={`https://discord.com/channels/??????`}
              target="_blank"
              rel="noreferrer"
              className={classes.boldText}
            >
              #nounerbr-private
            </a>
            <Col style={{ textAlign: 'justify' }}>
              While we generally prefer to keep everything out in the open, sometimes there are
              sensitive matters where information is only kept to members.
            </Col>
            <br />

          {/*--------------------------------------------------*/}
          <h3>General</h3>
          <Col style={{ textAlign: 'justify' }}>
            These are channels where anyone can post.
          </Col>
          <br />

          <a
            href={`https://discord.com/channels/??????`}
            target="_blank"
            rel="noreferrer"
            className={classes.boldText}
          >
            #general-chat
          </a>
          <Col style={{ textAlign: 'justify' }}>
            The most active channel, and the other are topic specific. Non-members often post in
            these channels asking for guidance on proposal ideas, or to share things they have made.
          </Col>
          <br />

          {/*--------------------------------------------------*/}
          <h3>Projects</h3>
          <Col style={{ textAlign: 'justify' }}>
            When a project passes an on-chain vote, the creator of that proposal will often be given
            their own channel in this section to answer questions and share updates on the status of
            their work. This is a constantly expanding list - for more information on each of these,
            check out the DAO section of the NounsBR website.
          </Col>
          <br />
          
      </Col>
    </Section>
  );
};

export default NounersPage;
