import React from 'react';
import classes from './Hackathon.module.css';
import Section from '../../layout/Section';
import { Button, Col, Container, Row } from 'react-bootstrap';
import nounsHackathonGif from '../../assets/images/hackathon/hackathon.gif';
import awardsGraphic from '../../assets/images/hackathon/hackaprize.png';
import artGraphic from '../../assets/images/hackathon/art.png';
import onChainGraphic from '../../assets/images/hackathon/onchain.png';
import offChainGraphic from '../../assets/images/hackathon/offchain.png';
import communityGraphic from '../../assets/images/hackathon/community.png';

const HackathonPage = () => {
  return (
    <Section bgColor="transparent" fullWidth={true} className={classes.hackathonPage}>
      <div className={classes.hackathonBanner}>
        <img
          src={nounsHackathonGif}
          alt="Nounish things typing on a shared keyboard that says 'Hackathon'"
        />
      </div>
      <Col lg={{ span: 6, offset: 3 }}>
        <h1 id="nouns-hackathon">Nouns Hackathon</h1>
        <p>
          <em>draft</em>
        </p>
        <p>
          The Nouns invite you to the first ever Nouns hackathon! This 48 hour online event will
          bring together artists, builders, and Noun enthusiasts to work on Nouns related projects
          to learn new things and compete for prizes. Meet new friends from the Nouns community and
          learn new skills in this sprint to build on our protocol.
        </p>
        <p>When? (Date to be finalized)</p>
        <h2 id="what-is-the-nouns-hackathon">What is the Nouns Hackathon?</h2>
        <p>
          The Nouns Hackathon will be a 48 hour competition where teams of people will work on
          projects to compete for prizes. Projects can span a wide range of Nouns-related topics and
          are presented at the end of the hackathon to a panel of judges and are awarded overall
          prizes, prizes per category, and prizes awarded by the community.
        </p>
        <p>
          Projects may not be fully polished within the 48 hours but the goal of the event is to
          experiment, learn new things, and build community with other Noun enthusiasts.
        </p>
        <h2 id="why-participate-in-the-nouns-hackathon">Why Participate in the Nouns Hackathon?</h2>
        <p>
          The Nouns project is still very new and is performing several new experiments at once. An
          ecosystem full of new things has a huge amount of potential but can be daunting to start
          working with or to commit to. Instead, a hackathon allows participants to jump into the
          deep end for a short amount of time without the obligation of a long project but with the
          opportunity to win prizes for learning and experimenting.
        </p>
        <p>
          Mentors will be circulating during the event to help guide you through the ecosystem and
          your teammates will be able to teach you new things.
        </p>
        <p>
          The Nouns Hackathon can include hacking on the entire Nouns ecosystem from the on-chain
          artwork, to the governance smart contracts, to frontend web applications, or an entirely
          new thing of your own creation.
        </p>
        <p>
          If you’re new to the scene, joining the hackathon is a great way to learn from teammates
          and other projects as you go along. Learning a new skill or different way of thinking may
          be the <em>real</em> prize - although winning with your team may be nice too.
        </p>
        <p>
          For those familiar with the Ethereum ecosystem and a grasp on Nouns this hackathon will be
          a great opportunity to connect with other Nouns community members and try something new.
        </p>
        <p>
          Most importantly, the hackathon is a great way to have fun and try to build something new
          in a short amount of time. Projects can also then be submitted to the NounsDAO for the
          opportunity to be granted further funding!
        </p>

        <h2 id="project-categories">Project Categories</h2>
        <Section fullWidth={true} bgColor="transparent">
          <h3 id="art">Art</h3>
          <p>
            Art projects could take the form of new components for the Nouns protocol (heads,
            bodies, etc.), physical artwork, and Nouns in new mediums.
          </p>
          <Col className={classes.artBlock} md={{ span: 4 }}>
            <img src={artGraphic} alt="Art Graphic" />
          </Col>
          <Col lg={{ span: 6 }}>
            <p>Example projects could include:</p>
            <ul>
              <li>New parts for Nouns</li>
              <li>Nouns made available in new mediums</li>
              <li>Physical Artwork</li>
            </ul>
          </Col>
        </Section>
        <Section fullWidth={true} bgColor="transparent">
          <h3 id="on-chain">On-Chain</h3>
          <p>
            The On-Chain category is for projects that push the Nouns ecosystem forward using
            on-chain smart contracts, building encoders/decoders for on-chain artwork, or work on
            Noun fractionalization.
          </p>
          <Col className={classes.artBlock} md={{ span: 4 }}>
            <img src={onChainGraphic} alt="On-Chain Graphic" />
          </Col>
          <Col lg={{ span: 6 }}>
            <p>Examples projects could include:</p>
            <ul>
              <li>Libraries for encoding and decoding ManderHof (The Nouns encoding) images</li>
              <li>Frameworks and contracts for fractionalizing Nouns</li>
              <li>
                Contracts for coordinating and performing governance actions (voting, treasury
                management, grant management)
              </li>
            </ul>
          </Col>
        </Section>
        <Section fullWidth={true} bgColor="transparent">
          <h3 id="off-chain">Off-Chain</h3>
          <p>
            The Off-Chain category includes apps, infrastructure, integrations, and tooling
            surrounding the Nouns ecosystem.
          </p>
          <Col className={classes.artBlock} md={{ span: 4 }}>
            <img src={offChainGraphic} alt="Off-Chain Graphic" />
          </Col>
          <Col lg={{ span: 6 }}>
            <p>Example projects could include:</p>
            <ul>
              <li>
                Apps surrounding the Nouns ecosystem (Noun’o’Clock, Noun directories, Noun profiles,
                Noun viewers)
              </li>
              <li>Infrastructure for interacting with the Nouns ecosystem</li>
              <li>Tooling and libraries for interacting with Nouns’ on-chain data</li>
            </ul>
          </Col>
        </Section>
        <Section fullWidth={true} bgColor="transparent">
          <h3 id="community-and-sustainability">Community and Sustainability</h3>
          <p>
            Community and Sustainability projects are focused around enabling communities to form
            easier, work better, and coordinate faster around Nouns and DAOs. As the NounsDAO
            becomes a DAO-of-DAOs being able to coordinate within DAOs will become more and more
            important.
          </p>
          <Col className={classes.artBlock} md={{ span: 4 }}>
            <img src={communityGraphic} alt="Community Graphic" />
          </Col>
          <Col lg={{ span: 6 }}>
            <p>Example projects could include:</p>
            <ul>
              <li>Tools and playbooks for governance</li>
              <li>Platforms or venues for coordination</li>
              <li>Proposal workflows for Nouns SubDAOs and the Nouns DAO</li>
            </ul>
          </Col>
        </Section>

        <h2 id="how-are-projects-judged">How are Projects Judged?</h2>
        <p>(Prize sum at 53 ETH, could be adjusted)</p>
        <p>
          Projects will be judged by a panel of fellow Nouns builders, artists, owners, and guests.
          From this judging, overall 1st, 2nd, 3rd, 4th, and 5th place prizes will be awarded.
          Winners of the overall judging will be awarded:
        </p>
        <ul>
          <li>1st place: 10 ETH</li>
          <li>2nd place: 7 ETH</li>
          <li>3rd place: 5 ETH</li>
          <li>4th place: 3 ETH</li>
          <li>5th place 2 ETH</li>
        </ul>
        <p>
          Additionally, for each project category two projects will be selected by judges as “best
          of” and win prizes of 5 ETH each.
        </p>
        <p>
          Community members will also vote for their two favorite projects and those projects will
          receive a prize of 3 ETH.
        </p>
        <p>
          Meaning your project could win up to 18 ETH! (1st place + best of category + community
          favorite)
        </p>
        <Container>
          <Row className="justify-content-md-center">
            <img
              src={awardsGraphic}
              alt="Illustration showing a podium and awards for the four categories"
            />
          </Row>
        </Container>
        <h2 id="rules">Rules</h2>
        <ol type="1">
          <li>
            All projects must be copyleft or open source. Openness is a key component of the Nouns
            ecosystem so we are open by default.
          </li>
          <li>Projects should be Nouns related.</li>
          <li>
            Teams must present their project at the end of the hackathon. Presentations may be live
            or prerecorded but teams should be available for Q&amp;A.
          </li>
          <li>Teams of 3-5 people are recommended but not required</li>
          <li>(Normal hackathon code of conduct here)</li>
        </ol>
        <Container>
          <Row className="justify-content-md-center">
            <a href="https://nouns.wtf/discord">
              <Button className={classes.ctaButton}>Join us in #hackathon</Button>
            </a>
          </Row>
        </Container>
      </Col>
    </Section>
  );
};

export default HackathonPage;
