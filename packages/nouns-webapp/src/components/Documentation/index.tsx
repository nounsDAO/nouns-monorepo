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
            Introducing Meouns, a more purrtier version of Meouns.
            Meouns is an expansion DAO based on Nouns DAO and {cryptopunksLink}. Meouns DAO was created to serve as a new layer within the Meouns ecosystem; Meouns as cats. By expanding the ecosystem, Meouns DAO aims to bring in more people to Meouns.
            One Meoun is generated and auctioned every 69 minutes. 69% of the Meouns treasury will be used to buy Nouns and be held in the Meouns treasury. With the goal of democratizing access to Meoun ownership while creating a fun and meme based NFT community new Meouners can contribute to.
            All Meoun artwork is stored and rendered on-chain. See more information at [meouns.wtf](https://www.meouns.wtf/).
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Learn more below, or start creating Meouns off-chain right meow using the {playgroundLink}.
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
                  <Trans>Meouns artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One Meoun is trustlessly auctioned every 69 minutes, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of Meoun auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All Meouns are members of Meouns DAO.</Trans>
                </li>
                <li>
                  <Trans>Meouns DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One Meoun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by Meouns via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all Meouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Meounders receive rewards in the form of Meouns (10% of supply for first 5 years).
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
                The Meouns Auction Contract will act as a self-sufficient Meoun generation and
                distribution mechanism, auctioning one Meoun every 69 minutes, forever. 100% of
                auction proceeds (ETH) are automatically deposited in the Meouns DAO treasury,
                where they are used to buy NOUNS and governed by Meoun owners. Holding Meouns gives you both exposure to Nouns and the underlying Eth.
                </Trans>
              </p>

              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  Meoun to be minted and a new 24 hour auction to begin.{' '}
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction Meouns as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Meouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                Meouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                Meouns ecosystem. The Meouns DAO treasury receives 100% of ETH proceeds from daily
                Meoun auctions. Each Meoun is an irrevocable member of Meouns DAO and entitled to one
                vote in all governance matters. Meoun votes are non-transferable (if you sell your
                Meoun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your Meoun.
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
                  In addition to the precautions taken by Compound Governance, Meounders have given
                  themselves a special veto right to ensure that no malicious proposals can be
                  passed while the Meoun supply is low. This veto right will only be used if an
                  obviously harmful governance proposal has been passed, and is intended as a last
                  resort.
                </Trans>
              </p>
              <p>
                <Trans>
                  Meounders will proveably revoke this veto right when they deem it safe to do so.
                  This decision will be based on a healthy Meoun distribution and a community that is
                  engaged in the governance process.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Meoun Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Meouns are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing Meoun trait scarcity, which makes all Meouns
                  equally rare. As of this writing, Meouns are made up of:
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
                  <Trans>heads (234) </Trans>
                </li>
                <li>
                  <Trans>glasses (21)</Trans>
                </li>
              </ul>
              <Trans>
                You can experiment with off-chain Meoun generation at the {playgroundLink}.
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
                  Meouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Meoun parts are compressed and
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
              <Trans>Meoun Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The Meoun Seeder contract is used to determine Meoun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the Meouns DAO to prevent any
                  future updates. Currently, Meoun traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), MeounId))</code>
              <br />
              <br />
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a Meoun
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Meounder's Reward</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  'Meounders' are the group of ten builders that initiated Meouns. Here are the
                  Meounders:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="@cryptoseneca"
                    url="https://twitter.com/cryptoseneca"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link
                    text="@gremplin"
                    url="https://twitter.com/gremplin"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@punk4156" url="https://twitter.com/punk4156" leavesPage={true} />
                </li>
                <li>
                  <Link text="@eboyarts" url="https://twitter.com/eBoyArts" leavesPage={true} />
                </li>
                <li>
                  <Link text="@punk4464" url="https://twitter.com/punk4464" leavesPage={true} />
                </li>
                <li>solimander</li>
                <li>
                  <Link text="@dhof" url="https://twitter.com/dhof" leavesPage={true} />
                </li>
                <li>
                  <Link text="@devcarrot" url="https://twitter.com/carrot_init" leavesPage={true} />
                </li>
                <li>
                  <Link text="@TimpersHD" url="https://twitter.com/TimpersHD" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@lastpunk9999"
                    url="https://twitter.com/lastpunk9999"
                    leavesPage={true}
                  />
                </li>
              </ul>
              <p>
                <Trans>
                  Because 100% of Meoun auction proceeds are sent to Meouns DAO, Meounders have chosen
                  to compensate themselves with Meouns. Every 10th Meoun for the first 5 years of the
                  project (Meoun ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  Meounder's multisig to be vested and shared among the founding members of the
                  project.
                </Trans>
              </p>
              <p>
                <Trans>
                  Meounder distributions don't interfere with the cadence of 24 hour auctions. Meouns
                  are sent directly to the Meounder's Multisig, and auctions continue on schedule
                  with the next available Meoun ID.
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
