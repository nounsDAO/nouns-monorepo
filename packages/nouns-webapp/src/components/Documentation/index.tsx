import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';
import { externalURL, ExternalURL } from '../../utils/externalURL';

const Documentation = () => {
  const docsLink = (
    <Link
      text="Docs"
      url={externalURL(ExternalURL.docs)}
      leavesPage={true}
    />
  );
  externalURL(ExternalURL.docs);
  const nounsDaoLink = (
    <Link
      text="Nouns"
      url="https://nouns.wtf"
      leavesPage={true}
    />
  );
  const playgroundLink = (
    <Link text="Playground" url="/playground" leavesPage={false} />
  );
  const publicDomainLink = (
    <Link
      text="public domain"
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link
      text="Compound Governance"
      url="https://compound.finance/governance"
      leavesPage={true}
    />
  );
  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            WTF is Public Nouns?
          </h1>
          <h3 className={classes.aboutText}>Public Nouns is an experimental new way to support public goods.</h3>
          <p className={classes.aboutText}>
              {nounsDaoLink} has proven to be a strong mechanism for continuous funding alongside a simple, yet effective governance framework. Public Goods are necessary, often detached from value capture out of necessity, and notoriously difficult to fund. Thus, we have forked Nouns and replaced all heads with memetic representations of public goods, as an experiment in continuous public goods funding. All ETH from Public Noun auctions goes direct to Public Nouns DAO, where one Public Noun equals one vote. Public Nouns DAO members curate and fund public goods projects. 
          </p>
          <p>The mission of Public Nouns DAO is to support public goods by:</p>
          <p>
          <ol>
            <li>experimenting with new methods of public goods funding, starting with Public Nouns itself.</li>
            <li>spreading awareness of public goods</li>
            <li>funding public goods, creators, and public goods mechanisms</li>
          </ol>
          </p>
          <p>Grab a Public Noun during an auction to get voice in Public Nouns DAO.</p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
              Play around making Public Nouns off-chain using the {playgroundLink}.
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Summary
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  Public Nouns artwork is in the {publicDomainLink}.
                </li>
                <li>
                  One Public Noun is trustlessly auctioned every 12 hours, forever.
                </li>
                <li>
                  100% of Public Noun auction proceeds are trustlessly sent to the Public Nouns DAO treasury.
                </li>
                <li>
                  Settlement of one auction kicks off the next.
                </li>
                <li>
                  All Public Nouns are members of Public Nouns DAO.
                </li>
                <li>
                  One Public Noun is equal to one vote.
                </li>
                <li>
                  The treasury is controlled exclusively by Public Nouns via governance.
                </li>
                <li>
                  Artwork is generative and stored directly on-chain (not IPFS).
                </li>
                <li>
                  
                    No explicit rules exist for attribute scarcity; all Public Nouns are equally rare.
                  
                </li>
                      <li>pNounders, Public Nouns DAO, and Nouns DAO receive rewards in the form of Public Nouns (10% of supply for first year).</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Two Auctions Daily</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <Trans>
                  The Public Nouns Auction Contract will act as a self-sufficient Public Noun generation and
                  distribution mechanism, auctioning one Public Noun every 12 hours, forever. 100% of auction proceeds (ETH) are automatically deposited in the Public Nouns DAO treasury,
                  where they are governed by Public Noun owners.
                  </Trans>
              </p>
              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new Public Noun to be minted and a new 12 hour auction to begin.{' '}
                </Trans>
              </p>
              <p>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction Public Nouns as long as
                  Ethereum is operational and there are interested bidders.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Public Nouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
               Public Nouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
               Public Nouns ecosystem. The Public Nouns DAO treasury receives 100% of ETH proceeds from daily
               Public Noun auctions. Each Public Noun is an irrevocable member of Public Nouns DAO and entitled to one
                vote in all governance matters. Public Noun votes are non-transferable (if you sell your
                pNoun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your Public Noun.
              </p>
              <p>
                Visit {docsLink} to get involved with the DAO.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Governance ‘Slow Start’
            </Accordion.Header>
            <Accordion.Body>
              <p>
                  The proposal veto right was initially envisioned as a temporary solution to the
                  problem of ‘51% attacks’ on the Nouns DAO treasury. While pNounders initially
                  believed that a healthy distribution of Nouns would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the pNounders and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
              </p>
              <p>
                  Consequently, the pNounders anticipates being the steward of the veto power
                  until Public Nouns DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
              </p>
              <p>
                  The pNounders considers the veto an emergency power that should not be
                  exercised in the normal course of business. The pNounders will veto
                  proposals that introduce non-trivial legal or existential risks to the Public Nouns DAO
                  or the pNounders, including (but not necessarily limited to) proposals
                  that:
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
                  There are unfortunately no algorithmic solutions for making these determinations
                  in advance (if there were, the veto would not be required), and proposals must be
                  considered on a case by case basis.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Public Noun Traits
            </Accordion.Header>
            <Accordion.Body>
              <p>
                  Public Nouns are generated randomly based Ethereum block hashes. There are no 'if'
                  statements or other rules governing Noun trait scarcity, which makes all Public Nouns
                  equally rare. As of this writing, Public Nouns are made up of:
              </p>
              <ul>
                <li>
                  <Trans>backgrounds (2) </Trans>
                </li>
                <li>
                  <Trans>bodies (31)</Trans>
                </li>
                <li>
                  <Trans>accessories (139) </Trans>
                </li>
                <li>
                  heads (21) 
                </li>
                <li>
                  <Trans>glasses (24)</Trans>
                </li>
              </ul>
                You can experiment with off-chain Public Noun generation at the {playgroundLink}.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              On-Chain Artwork
            </Accordion.Header>
            <Accordion.Body>
              <p>
                  Public Nouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Public Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression. 
              </p>
              <p>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Public Noun Seeder Contract
            </Accordion.Header>
            <Accordion.Body>
              <p>
                  The Public Noun Seeder contract is used to determine Noun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any
                  future updates. Currently, Noun traits are determined using pseudo-random number
                  generation:
              </p>
              <code>keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))</code>
              <br />
              <br />
              <p>
                  Trait generation is not truly random. Traits can be predicted when minting a Noun
                  on the pending block.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Public Noun Rewards
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  'pNounders' is the coalition of public good enjoyers from the following orgs that formed to launch Public Nouns together, and help steward early governance.
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
                </Trans>
              </p>
              <p>
                <Trans>Every 30th Public Noun for the first year of the project (Public Noun ids #0, #30, #60, and so on) will be automatically sent to the pNounder's multisig to be vested and shared among the coalition to help steward early governance.</Trans>
              </p>
              <p>
                <Trans>
                  Every 30th Public Noun for the first year of the project (Public Noun ids #10, #40, #70, and so on) will be automatically sent to the
                  NounsDAO, for building such an amazing foundation that we could fork.
                </Trans>
              </p>
              <p>
                <Trans>
                  Every 30th Public Noun for the first year of the project (Public Noun ids #20, #50, #80, and so on) will be automatically sent to the
                  Public Nouns DAO, for rewards.
                </Trans>
              </p>
              <p>
                <Trans>
                  These distributions don't interfere with the cadence of the 12 hour auctions. Public Nouns
                  are sent directly to the pNounder's Multisig, and auctions continue on schedule
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
