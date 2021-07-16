import Section from '../Section';
import { Col, Card } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';

const Documentation = () => {
  return (
    <Section bgColor="white" fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>What is this?</h1>
          <p>
            Nouns are an experimental attempt to improve the formation of on-chain avatar
            communities. While projects such as <a href="https://www.larvalabs.com/cryptopunks">Cryptopunks</a> have attempted to bootstrap digital
            community and identity, Nouns attempt to bootstrap identity, community, governance and a
            treasury that can be used by the community for the creation of long-term value.
            Additionally, Nouns attempt to significantly slow community formation to ensure
            continuous community growth over time and to incentivize long-term thinking.
          </p>
        </div>
        <Accordion>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="0" className={classes.cardHeader}>
              Summary <i className={classes.arrowRight}></i>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <ul>
                  <li>1 noun trustlessly auctioned every 24 hours, forever</li>
                  <li>settlement of one auction kicks off the next</li>
                  <li>all nouns are members of Nouns DAO</li>
                  <li>Nouns DAO uses a fork of <a href="https://compound.finance/governance"> Compound Governance</a></li>
                  <li>1 noun = 1 vote</li>
                  <li>100% of noun auction proceeds are trustlessly sent to Nouns DAO treasury</li>
                  <li>treasury is controlled by nouns via governance</li>
                  <li>artwork is generative and stored directly on-chain (not IPFS)</li>
                  <li>no explicit rules for attribute scarcity, all nouns are equally rare</li>
                  <li>nouns artwork is <a href="https://creativecommons.org/publicdomain/zero/1.0/">public domain</a></li>
                  <li>
                    project creators (‘Nounders’) receive rewards in the form of nouns (10% of
                    supply for first 5 years)
                  </li>
                </ul>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="1" className={classes.cardHeader}>
              Daily Auctions
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                The nouns auction contract will act as a self-sufficient noun generation and
                distribution mechanism, auctioning one noun every 24 hours forever. 100% of the
                proceeds for each auction are automatically deposited in the Nouns DAO treasury,
                where they are governed by noun owners. Each time an auction is settled, the
                settlement transaction will result in the minting and auction of a new noun by the
                contract. While settlement is most heavily incentivized for the winning bidder, it
                can be triggered by anyone, allowing the system to trustlessly auction nouns as long
                as Ethereum is operational and there are interested participants. Noun auctions
                utilize a fork of Zora's auction house. You can see the contracts here: [url]
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="2" className={classes.cardHeader}>
              Nouns DAO
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                Nouns DAO utilizes a fork of Compound Governance and is the main governing body of
                the nouns ecosystem. The Nouns DAO treasury receives 100% of ETH proceeds from daily
                noun auctions. Each noun is an irrevocable member of Nouns DAO and entitled to 1
                vote in all governance matters. Noun votes are non-transferable (if you sell your
                Noun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your noun. Nouns governance contracts are available
                here: [url]
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="3" className={classes.cardHeader}>
              Nounders Reward
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                "Nounders" are the group of ten artists and software developers that created Nouns.
                After the mainnet launch of the project, they will cede control of the project to
                Nouns DAO. As compensation for developing Nouns, Nounders have awarded themselves
                every 10th noun for the first 5 years of the project (183 of the first 1830 Nouns).
                Noun ids #0, #10, #20, #30 and so on, will be automatically sent to the Nounder's
                multisig to be vested and shared among the 10 founding members of the project.
                Nounder distributions don't interfere with the cadence of 24 hour auctions. Nouns
                are sent directly to the Nounder's Multisig, and auctions continue on schedule with
                the next available noun ID.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="4" className={classes.cardHeader}>
              Governance ‘Slow Start’
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4">
              <Card.Body>
                An additional governance veto right has been added by the Nounders to ensure that no
                malicious proposals can be passed early in the project's history. The veto allows
                Nounders to prevent any governance proposal from being implemented, and is intended
                to be used only in a scenario where an obviously malicious proposal has been passed.
                The Nounders will revoke the veto right on-chain as soon as they deem it safe to do
                so. This decision will be based on fair distribution of early nouns and an active
                community of noun owners that demonstrate goodwill towards the project.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="5" className={classes.cardHeader}>
              Noun Traits and Randomness
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="5">
              <Card.Body>
                Nouns are generated randomly based Ethereum block hashes and a set of encoded
                on-chain assets per layer of artwork. There are no 'if' statements or other rules
                governing noun trait scarcity, which makes all nouns equally rare. As of this
                writing, nouns are made up of:
                <ul>
                  <li>Layer 1: backgrounds (1/2) </li>
                  <li>Layer 2: shirts (1/X)</li>
                  <li>Layer 3: accessories: (1/X) </li>
                  <li>Layer 4: heads (1/X) </li>
                  <li>Layer 5: glasses (1/X)</li>
                </ul>
                You can use the same algorithm to generate off-chain Nouns by visiting
                nouns.wtf/generator
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="6" className={classes.cardHeader}>
              On-Chain Artwork
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="6">
              <Card.Body>
                <p>Nouns are stored directly on Ethereum and do not utilize pointers to other networks such as IPFS. This is possible because noun parts are compressed and stored on-chain using a custom run-length encoding (RLE), which is a form of lossless compression.</p>

                <p>The compressed parts are efficiently converted into a single base64 encoded SVG image on-chain and each part is decoded into an intermediate format before being converted into a series of SVG rects using batched, on-chain string concatenation. Once the entire SVG has been generated, it is base64 encoded.</p>

              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card className={classes.card}>
            <Accordion.Toggle as={Card.Header} eventKey="7" className={classes.cardHeader}>
              Noun Seeder Contract
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="7">
              <Card.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
