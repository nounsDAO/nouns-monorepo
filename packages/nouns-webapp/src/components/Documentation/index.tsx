import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

interface DocumentationProps {
  backgroundColor?: string;
}

const Documentation = (props: DocumentationProps = { backgroundColor: '#FFF' }) => {
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
  const nounsLink = (
    <Link
      text={<Trans>nounish</Trans>}
      url="https://nouns.wtf"
      leavesPage={true}
    />
  );
  const polLink = (
    <Link
      text={<Trans>Proof of Liquidity</Trans>}
      url="https://docs.berachain.com/learn/what-is-proof-of-liquidity"
      leavesPage={true}
    />
  );
  const firstsetLink = (
    <Link
      text={<Trans>Firstset</Trans>}
      url="https://firstset.xyz"
      leavesPage={true}
    />
  );

  return (
    <Section
      fullWidth={false}
      className={classes.documentationSection}
      style={{ background: props.backgroundColor }}
    >
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1 style={{ color: 'var(--brand-warm-light-text)' }}>
            <Trans>WTF?</Trans>
          </h1>
          <p className={classes.aboutText} style={{ color: 'var(--brand-warm-light-text)' }}>
            <Trans>
              Bouns is a {nounsLink} experiment for community-based {polLink} participation on Berachain. 
              Bouns attempt to bootstrap identity, community, governance, and a treasury that can be used to participate in Proof of Liquidity.
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem', color: 'var(--brand-warm-light-text)' }}></p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Summary</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <ul style={{ color: 'var(--brand-warm-light-text)' }}>
                <li>
                  <Trans>Bouns is a fork of Nouns on Berachain.</Trans>
                </li>
                <li>
                  <Trans>Bouns artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One Boun is trustlessly auctioned every epoch, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of Boun auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>When an auction settles for less than the average historical auction sale price, the next auction's epoch is increased by 10%.</Trans>
                </li>
                <li>
                  <Trans>All Bouns are members of Bouns DAO.</Trans>
                </li>
                <li>
                  <Trans>Bouns DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One Boun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by Bouns via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all Bouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Bounders receive rewards in the form of Bouns (10% of supply for first 5 years).
                  </Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Auction Design</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText} style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Like Nouns, the Bouns Auction Contract will act as a self-sufficient Boun generation and
                  distribution mechanism, auctioning one Boun every epoch, forever. 100% of
                  auction proceeds (BERA) are automatically deposited in the Bouns DAO treasury,
                  where they are governed by Boun owners.
                </Trans>
              </p>

              <p className={classes.aboutText} style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  Boun to be minted and a new epoch to begin.{' '}
                </Trans>
              </p>

              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Unlike Nouns, the Bouns auction mechanism consists of a dynamic duration with the goal 
                  of achieving naturally deflationary issuance over time. This is accomplished by 
                  increasing the epoch duration by 10% when an auction settles for less than the average 
                  historical auction sale price. An epoch is 24 hours at time of launch.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction Bouns as long as
                  Berachain is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Bouns DAO</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText} style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Like Nouns, Bouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                  Bouns ecosystem. The Bouns DAO treasury receives 100% of BERA proceeds from daily
                  Boun auctions. Each Boun is an irrevocable member of Bouns DAO and entitled to one
                  vote in all governance matters. Boun votes are non-transferable (if you sell your
                  Boun the vote goes with it) but delegatable, which means you can assign your vote to
                  someone else as long as you own your Boun.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Governance ‘Slow Start’</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Bouns DAO Governance is currently in a 'slow start' phase, given the history and 
                  learnings from Bouns DAO, which are explained in more detail below for context.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  The proposal veto right was initially envisioned as a temporary solution to the
                  problem of ‘51% attacks’ on the Bouns DAO treasury. While Nounders initially
                  believed that a healthy distribution of Nouns would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the Nounders, the Nouns Foundation, and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  The Nouns community has undertaken a preliminary exploration of proposal veto
                  alternatives (‘rage quit’ etc.), but it is now clear that this is a difficult
                  problem that will require significantly more research, development and testing
                  before a satisfactory solution can be implemented.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Consequently, the Nouns Foundation anticipates being the steward of the veto power
                  until Bouns DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  In the case of Bouns DAO, veto power will be stewarded by {firstsetLink}, 
                  as the founding entity of the project.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Firstset considers the veto an emergency power that should not be
                  exercised in the normal course of business. Firstset will veto
                  proposals that introduce non-trivial legal or existential risks to the Bouns DAO
                  or Firstset, including (but not necessarily limited to) proposals
                  that:
                </Trans>
              </p>
              <ul style={{ color: 'var(--brand-warm-light-text)' }}>
                <li>unequally withdraw the treasury for personal gain</li>
                <li>bribe voters to facilitate withdraws of the treasury for personal gain</li>
                <li>
                  attempt to alter Noun auction cadence for the purpose of maintaining or acquiring
                  a voting majority
                </li>
                <li>make upgrades to critical smart contracts without undergoing an audit</li>
              </ul>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  There are unfortunately no algorithmic solutions for making these determinations
                  in advance (if there were, the veto would not be required), and proposals must be
                  considered on a case by case basis.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Noun Traits</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Bouns are generated randomly based Berachain block hashes. There are no 'if'
                  statements or other rules governing Noun trait scarcity, which makes all Bouns
                  equally rare. As of this writing, Bouns are made up of:
                </Trans>
              </p>
              <ul style={{ color: 'var(--brand-warm-light-text)' }}>
                <li>
                  <Trans>bodies (30)</Trans>
                </li>
                <li>
                  <Trans>accessories (140) </Trans>
                </li>
                <li>
                  <Trans>heads (50) </Trans>
                </li>
                <li>
                  <Trans>glasses (30)</Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>On-Chain Artwork</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Bouns are stored directly on Berachain and do not utilize pointers to other
                  networks such as IPFS. This is possible because Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </Trans>
              </p>

              <p style={{ color: 'var(--brand-warm-light-text)' }}>
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
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Boun Seeder Contract</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  The Boun Seeder contract is used to determine Boun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the Bouns DAO to prevent any
                  future updates. Currently, Boun traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code style={{ backgroundColor: '#0f3806', padding: '8px', borderRadius: '4px' }}>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a Boun
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <span style={{ color: 'var(--brand-warm-light-text)' }}><Trans>Bounder's Reward</Trans></span>
            </Accordion.Header>
            <Accordion.Body>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  'Bounders' refers to the original founders of the project. In this case, it refers to {firstsetLink}, 
                  the founding entity of the project.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Because 100% of Boun auction proceeds are sent to Bouns DAO, Bounders have chosen
                  to compensate themselves with Bouns. Every 10th Boun for the first 5 years of the
                  project (Boun ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  Bounder's multisig to be vested and shared among the founding members of the
                  project.
                </Trans>
              </p>
              <p style={{ color: 'var(--brand-warm-light-text)' }}>
                <Trans>
                  Bounder distributions don't interfere with the cadence of auctions. Bouns
                  are sent directly to the Bounder's Multisig, and auctions continue on schedule
                  with the next available Boun ID.
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