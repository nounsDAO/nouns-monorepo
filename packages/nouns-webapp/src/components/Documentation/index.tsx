import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

const Documentation = () => {
  const nounsDaoLink = (
    <Link
      text={<Trans>Nouns</Trans>}
      url="https://nouns.wtf"
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
              {nounsDaoLink} has proven to be a strong mechanism for continuous funding alongside a simple yet effective governance framework. Public Goods are necessary, and often detached from value capture. Public Nouns is an experiment at bending the incentive toward continuous public goods funding. 
          </p>
          <p>
            All heads have been replaced with 'mascots' of public goods, making each Public Noun a memetic representation of a public good.
            Grab a Public Noun during an auction to get voice in Public Nouns DAO.
          </p>
          <p>The mission of Public Nouns DAO is threefold:
          <ol>
            <li>spread awareness of public goods</li>
            <li>fund public goods, and public goods mechanisms</li>
            <li>experiment with new methods of public goods funding, starting with Public Nouns itself.</li>
          </ol>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>
              Play around making Public Nouns off-chain using the {playgroundLink}.
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
                  <Trans>Public Nouns artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One Public Noun is trustlessly auctioned every 12 hours, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of Public Noun auction proceeds are trustlessly sent to the Public Nouns DAO treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All Public Nouns are members of Public Nouns DAO.</Trans>
                </li>
                <li>
                  <Trans>One Public Noun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by Public Nouns via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all Public Nouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    <ul>
                      <li>pNounders, Public Nouns DAO, and Nouns DAO receive rewards in the form of Public Nouns (10% of supply for first year).</li>
                    </ul>
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
                  The Public Nouns Auction Contract will act as a self-sufficient Noun generation and
                  distribution mechanism, auctioning one Noun every 12 hours, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the Public Nouns DAO treasury,
                  where they are governed by Public Noun owners.
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
                  triggered by anyone, allowing the system to trustlessly auction Public Nouns as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Nouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
               Public Nouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
               Public Nouns ecosystem. The Public Nouns DAO treasury receives 100% of ETH proceeds from daily
               Public Noun auctions. Each Public Noun is an irrevocable member of Public Nouns DAO and entitled to one
                vote in all governance matters. Public Noun votes are non-transferable (if you sell your
                pNoun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your Public Noun.
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
                  problem of ‘51% attacks’ on the Nouns DAO treasury. While pNounders initially
                  believed that a healthy distribution of Nouns would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the pNounders and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
                </Trans>
              </p>
              <p>
                <Trans>
                  Consequently, the pNounders anticipates being the steward of the veto power
                  until Public Nouns DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
                </Trans>
              </p>
              <p>
                <Trans>
                  The pNounders considers the veto an emergency power that should not be
                  exercised in the normal course of business. The pNounders will veto
                  proposals that introduce non-trivial legal or existential risks to the Public Nouns DAO
                  or the pNounders, including (but not necessarily limited to) proposals
                  that:
                </Trans>
              </p>
              <ul>
                <li>unequally withdraw the treasury for personal gain</li>
                <li>bribe voters to facilitate withdraws of the treasury for personal gain</li>
                <li>
                  attempt to alter Public Noun auction cadence for the purpose of maintaining or acquiring
                  a voting majority
                </li>
                <li>make upgrades to critical smart contracts without undergoing an audit</li>
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
              <Trans>Public Noun Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Public Nouns are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing Noun trait scarcity, which makes all Public Nouns
                  equally rare. As of this writing, Public Nouns are made up of:
                </Trans>
              </p>
              <ul>
                <li>
                  <Trans>backgrounds (4) </Trans>
                </li>
                <li>
                  <Trans>bodies (30)</Trans>
                </li>
                <li>
                  <Trans>accessories (140) </Trans>
                </li>
                <li>
                  <Trans>heads (21) </Trans>
                </li>
                <li>
                  <Trans>glasses (23)</Trans>
                </li>
              </ul>
              <Trans>
                You can experiment with off-chain Public Noun generation at the {playgroundLink}.
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
                  Public Nouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Public Noun parts are compressed and
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
              <Trans>Public Noun Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The Public Noun Seeder contract is used to determine Noun traits during the minting
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
                  'pNounders' is the coalition of public goods that formed to launch Public Nouns together, and help steward early governance. Here are the
                  pNounders:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="MetaCartel"
                    url="https://twitter.com/meta_cartel"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="Panvala" url="https://twitter.com/panvalahq" leavesPage={true} />
                </li>
                <li>
                  <Link text="Radicle" url="https://twitter.com/radicle" leavesPage={true} />
                </li>
                <li>
                  <Link text="Optimism" url="https://twitter.com/optimismFND" leavesPage={true} />
                </li>
                <li>
                  <Link text="Clr.fund" url="https://twitter.com/clrfund" leavesPage={true} />
                </li>
                <li>
                  <Link text="Gitcoin" url="https://twitter.com/gitcoin" leavesPage={true} />
                </li>
                <li>
                  <Link text="Moloch" url="https://twitter.com/molochDAO" leavesPage={true} />
                </li>
              </ul>
              <p>
                <Trans>
                  Rewards: 
                  Every 30th Public Noun for the first year of the project (Public Noun ids #0, #30, #60, and so on) will be automatically sent to the pNounder's multisig to be vested and shared among the coalition.
                  Every 30th Public Noun for the first year of the project (Public Noun ids #10, #40, #70, and so on) will be automatically sent to the
                  NounsDAO, for building such an amazing base that we could fork.
                  Every 30th Public Noun for the first year of the project (Public Noun ids #20, #50, #80, and so on) will be automatically sent to the
                  PublicNounsDAO, for rewards.
                </Trans>
              </p>
              <p>
                <Trans>
                  These distributions don't interfere with the cadence of 12 hour auctions. Public Nouns
                  are sent directly to the Pnounder's Multisig, and auctions continue on schedule
                  with the next available Public Noun ID.
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
