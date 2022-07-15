import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

const Documentation = () => {
  const nounsLink = (
    <Link
      text={<Trans>Nouns DAO</Trans>}
      url="https://www.nouns.wtf"
      leavesPage={true}
    />
  );
  const playgroundLink = (
    <Link text={<Trans>Playground</Trans>} url="/playground" leavesPage={false} />
  );
  const publicDomainLink = (
    <Link
      text={<Trans>public domain</Trans>}
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link
      text={<Trans>Compound Governance</Trans>}
      url="https://compound.finance/governance"
      leavesPage={true}
    />
  );
  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>WTF?</Trans>
          </h1>
          <p className={classes.aboutText}>
            <Trans>
             Nouns for the Public Good. {nounsLink} has proven to be a strong mechanism for continuous funding alongside simple, yet effective governance. Public Nouns is a fork with a focus on funding public goods.
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Learn more below, or start creating Nouns off-chain using the {playgroundLink}.
            </Trans>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Summary</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <Trans>℗NOUNS artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One ℗NOUN is trustlessly auctioned every 12 hours, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of ℗NOUN auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All ℗NOUN are members of Public Nouns DAO.</Trans>
                </li>
                <li>
                  <Trans>Public Nouns DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One Public Noun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by ℗NOUNs via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all Nouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Pounders receive rewards in the form of ℗NOUNs (10% of supply for first 5 years).
                  </Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Daily Auctions</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <Trans>
                  The Nouns Auction Contract will act as a self-sufficient Noun generation and
                  distribution mechanism, auctioning one ℗Noun every 12 hours, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the Public Nouns DAO treasury,
                  where they are governed by ℗NOUN owners.
                </Trans>
              </p>

              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  Noun to be minted and a new 12 hour auction to begin.{' '}
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction ℗NOUNs as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Public Nouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                Public Nouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                ℗NOUNs ecosystem. The Public Nouns DAO treasury receives 100% of ETH proceeds from daily
                ℗NOUNs auctions. Each Noun is an irrevocable member of Public Nouns DAO and entitled to one
                vote in all governance matters. ℗NOUN votes are non-transferable (if you sell your ℗NOUN the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your Noun.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Governance ‘Slow Start’</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  In addition to the precautions taken by Compound Governance, Pounders have given
                  themselves a special veto right to ensure that no malicious proposals can be
                  passed while the ℗NOUNs supply is low. This veto right will only be used if an
                  obviously harmful governance proposal has been passed, and is intended as a last
                  resort.
                </Trans>
              </p>
              <p>
                <Trans>
                  Pounders will proveably revoke this veto right when they deem it safe to do so.
                  This decision will be based on a healthy Noun distribution and a community that is
                  engaged in the governance process.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>℗Noun Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  ℗Nouns are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing Noun trait scarcity, which makes all Nouns
                  equally rare. As of this writing, Nouns are made up of:
                </Trans>
              </p>
              <ul>
                <li>
                  <Trans>backgrounds (2) </Trans>
                </li>
                <li>
                  <Trans>bodies (30)</Trans>
                </li>
                <li>
                  <Trans>accessories (137) </Trans>
                </li>
                <li>
                  <Trans>heads (50) </Trans>
                </li>
                <li>
                  <Trans>glasses (21)</Trans>
                </li>
              </ul>
              <Trans>
                You can experiment with off-chain Noun generation at the {playgroundLink}.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>On-Chain Artwork</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Nouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </Trans>
              </p>

              <p>
                <Trans>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Noun Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The Noun Seeder contract is used to determine Noun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any
                  future updates. Currently, Noun traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a Noun
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Public Noun Rewards</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  'Pounders' are the group of communities that initiated Public Nouns. Here are the
                  Pounders:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="MetaCartel"
                    url="https://metacartel.org"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="gitcoin"
                    url="https://gitcoin.co"
                    leavesPage={true}
                  />
                </li>
              </ul>
              <p>
                <Trans>
                  Because 100% of ℗NOUN auction proceeds are sent to Public Nouns DAO, Pounders have chosen
                  to compensate themselves with ℗NOUNs. Every 30th ℗NOUN for the first 5 years of the
                  project (℗NOUN ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  Pounders, Nouns DAO, and Public Nouns DAO.
                </Trans>
                <ul>
                  <li>Pounders receive the first iteration to help bootstrap governance.
                  (℗NOUN ids #0, #30, #60, and so on)
                  </li>
                  <li>NounsDAO will receive the second iteration to kick back for supporting our fork.
                  (℗NOUN ids #10, #40, #70, and so on)
                  </li>
                  <li>Public Nouns DAO will receive the final iteration to use however they wish.
                  (℗NOUN ids #20, #50, #80, and so on)
                  </li>
                </ul>
              </p>
              <p>
                <Trans>
                  Pounder distributions don't interfere with the cadence of 24 hour auctions. ℗Nouns
                  are sent directly to the Pounder's Multisig, and auctions continue on schedule
                  with the next available ℗Noun ID.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
