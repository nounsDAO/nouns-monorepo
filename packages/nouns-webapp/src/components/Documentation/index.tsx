import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

const Documentation = () => {
  const cryptopunksLink = (
    <Link
      text={<Trans>Cryptopunks</Trans>}
      url="https://www.larvalabs.com/cryptopunks"
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
              NounsBR are an experimental attempt to improve the formation of on-chain avatar
              communities. While projects such as {cryptopunksLink} have attempted to bootstrap
              digital community and identity, NounsBR attempt to bootstrap identity, community,
              governance, and a treasury that can be used by the community.
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Learn more below, or start creating NounsBR off-chain using the {playgroundLink}.
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
                  <Trans>NounsBR artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One NounBR is trustlessly auctioned every 15 minutes, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of NounBR auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All NounsBR are members of NounsBR DAO.</Trans>
                </li>
                <li>
                  <Trans>NounsBR DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One NounBR is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by NounsBR via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all NounsBR are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    NoundersBR receive rewards in the form of NounsBR (10% of supply for first 5 years).
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
                  The NounsBR Auction Contract will act as a self-sufficient NounBR generation and
                  distribution mechanism, auctioning one NounBR every 15 minutes, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the NounsBR DAO treasury,
                  where they are governed by NounBR owners.
                </Trans>
              </p>

              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  NounBR to be minted and a new 15 minutes auction to begin.{' '}
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction NounsBR as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>NounsBR DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                NounsBR DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                NounsBR ecosystem. The NounsBR DAO treasury receives 100% of ETH proceeds from daily
                NounBR auctions. Each NounBR is an irrevocable member of NounsBR DAO and entitled to one
                vote in all governance matters. NounBR votes are non-transferable (if you sell your
                NounBR the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your NounBR.
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
                  The proposal veto right was initially envisioned as a temporary solution to the
                  problem of ‘51% attacks’ on the NounsBR DAO treasury. While NoundersBR initially
                  believed that a healthy distribution of NounsBR would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the Nounders, the NounsBR Foundation, and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
                </Trans>
              </p>
              <p>
                <Trans>
                  The NounsBR community has undertaken a preliminary exploration of proposal veto
                  alternatives (‘rage quit’ etc.), but it is now clear that this is a difficult
                  problem that will require significantly more research, development and testing
                  before a satisfactory solution can be implemented.
                </Trans>
              </p>
              <p>
                <Trans>
                  Consequently, the NounsBR Foundation anticipates being the steward of the veto power
                  until NounsBR DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
                </Trans>
              </p>
              <p>
                <Trans>
                  The NounsBR Foundation considers the veto an emergency power that should not be
                  exercised in the normal course of business. The NounsBR Foundation will veto
                  proposals that introduce non-trivial legal or existential risks to the NounsBR DAO
                  or the NounsBR Foundation, including (but not necessarily limited to) proposals
                  that:
                </Trans>
              </p>
              <ul>
                <li><Trans>unequally withdraw the treasury for personal gain</Trans></li>
                <li><Trans>bribe voters to facilitate withdraws of the treasury for personal gain</Trans></li>
                <li>
                <Trans>attempt to alter NounBR auction cadence for the purpose of maintaining or acquiring
                  a voting majority</Trans>
                </li>
                <li><Trans>make upgrades to critical smart contracts without undergoing an audit</Trans></li>
              </ul>
              <p>
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
              <Trans>NounBR Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  NounsBR are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing NounBR trait scarcity, which makes all NounsBR
                  equally rare. As of this writing, NounsBR are made up of:
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
                  <Trans>accessories (140) </Trans>
                </li>
                <li>
                  <Trans>heads (242) </Trans>
                </li>
                <li>
                  <Trans>glasses (23)</Trans>
                </li>
              </ul>
              <Trans>
                You can experiment with off-chain NounBR generation at the {playgroundLink}.
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
                  NounsBR are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because NounBR parts are compressed and
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
              <Trans>NounBR Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The NounBR Seeder contract is used to determine NounBR traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the NounsBR DAO to prevent any
                  future updates. Currently, NounBR traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a NounBR
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>NounderBR's Reward</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  'Nounders' are the group of ten builders that initiated NounsBR. Here are the
                  NoundersBR:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="@beautyandpunk"
                    url="https://twitter.com/beautyandpunk"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@komesciart" url="https://twitter.com/komesciart" leavesPage={true} />
                </li>
                <li>
                  <Link text="@QuijoteHorizon" url="https://twitter.com/QuijoteHorizon" leavesPage={true} />
                </li>
              </ul>
              <p>
                <Trans>
                  Because 100% of NounBR auction proceeds are sent to NounsBR DAO, NoundersBR have chosen
                  to compensate themselves with NounsBR. Every 10th NounBR for the first 5 years of the
                  project (NounBR ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  NounderBR's multisig to be vested and shared among the founding members of the
                  project.
                </Trans>
              </p>
              <p>
                <Trans>
                  NounderBR distributions don't interfere with the cadence of 15 minutes auctions. NounsBR
                  are sent directly to the NounderBR's Multisig, and auctions continue on schedule
                  with the next available NounBR ID.
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
