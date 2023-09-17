import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';
import { ExternalURL, externalURL } from '../../utils/externalURL';

const Documentation = () => {
  const cryptopunksLink = (
    <Link
      text={<Trans>CryptoPunks</Trans>}
      url="https://www.larvalabs.com/cryptopunks"
      leavesPage={true}
    />
  );
  const docsLink = (
    <Link text={<Trans>here</Trans>} url={externalURL(ExternalURL.notion)} leavesPage={true} />
  );

  // const playgroundLink = (
  //   <Link text={<Trans>Playground</Trans>} url="/playground" leavesPage={false} />
  // );
  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <p className={classes.aboutText}>
            DAOpunks are an experimental attempt to improve the coordination and funding of the{' '}
            {cryptopunksLink} community. CryptoPunks are one of the largest NFT projects by market
            cap, but the community is completely cash poor. There is no treasury to encourage Punk
            innovation or to sponsor Punk community events.
            <br />
            Nouns was first inspired by CryptoPunks, and now it's the Punks' turn to be inspired by
            Nouns. This is an attempt to bootstrap the coordination, governance, and treasury of one
            of the most recognizable avatars in crypto. LFG!
          </p>
          {/*<p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>*/}
          {/*  <Trans>*/}
          {/*    Learn more below, or start creating Nouns off-chain using the {playgroundLink}.*/}
          {/*  </Trans>*/}
          {/*</p>*/}
          <br />
          <br />
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Summary</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <Trans>One new DAOpunk is trustlessly auctioned every 24 hours, forever.</Trans>
                </li>
                <li>
                  <Trans>
                    All 10,000 original CryptoPunks have been hashed so there can never be repeats.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    100% of DAOpunks auction proceeds are trustlessly sent to the treasury.
                  </Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>
                    All original CryptoPunks and new DAOpunks are members of the Punkers DAO.
                  </Trans>
                </li>
                <li>
                  <Trans>Punkers DAO uses a fork of Compound Governance.</Trans>
                </li>
                <li>
                  <Trans>One CryptoPunk is equal to one vote. One DAOpunk is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by CryptoPunks and DAOpunks via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork of DAOpunks is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    Scarcity for type, skin tone, individual attributes, and number of attributes is the same as the
                    original collection.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Punkers (founders) receive rewards in the form of DAOpunks (10% of supply for the first 5
                    years).
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
                  The DAOpunks Auction Contract will act as a self-sufficient DAOpunk generation and
                  distribution mechanism, auctioning one new DAOpunk every 24 hours, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the Punkers DAO treasury,
                  where they are governed by all CryptoPunk owners and DAOpunk owners, collectively.
                </Trans>
              </p>

              <p className={classes.aboutText}>
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  DApunk to be minted and a new 24 hour auction to begin.
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentive for the winner bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction DAOpunks as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Punkers DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                Punkers DAO utilizes a fork of Compound Governance and is the main governing body of
                the DAOpunks ecosystem. The Punkers DAO treasury receives 100% of ETH proceeds from
                daily Punks auctions. Each CryptoPunk and DAO Punk is an irrevocable member of the
                Punkers DAO and entitled to one vote in all governance matters. CryptoPunk and DAOpunk 
                vote are non-transferable (if you sell your CryptoPunk or DAOpunk the vote goes with it) but delegatable,
                which means you can assign your vote to someone else as long as you own your CryptoPunks or DAOpunk.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Governance</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Punks govern Punkers DAO. Punks can vote on proposals or delegate their vote to a
                  third party. A minimum of 2 votes (CryptoPunks and/or DAOpunks) is required to
                  submit proposals. Each CryptoPunk and DAOpunk you hold represents one vote in all
                  governance related matters.
                </Trans>
              </p>
              <p>
                For more information on how to delegate your CryptoPunk or DAOpunk, refer to our documentation{' '}
                {docsLink}.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Punks Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Punks are generated randomly based on Ethereum block hashes. Scarcity for type,
                  skin tone, individual attributes, and number of attributes is the same as the original collection.
                </Trans>
              </p>
              <ul>
                <li>
                  <Trans>Type (5)</Trans>
                </li>
                <li>
                  <Trans>Skin Tone (6)</Trans>
                </li>
                <li>
                  <Trans>Hair (41)</Trans>
                </li>
                <li>
                  <Trans>Eyes (16)</Trans>
                </li>
                <li>
                  <Trans>Beard (12)</Trans>
                </li>
                <li>
                  <Trans>Mouth (4)</Trans>
                </li>
                <li>
                  <Trans>Lips (3)</Trans>
                </li>
                <li>
                  <Trans>Neck (3)</Trans>
                </li>
                <li>
                  <Trans>Emotion (2)</Trans>
                </li>
                <li>
                  <Trans>Face (2)</Trans>
                </li>
                <li>
                  <Trans>Ears (1)</Trans>
                </li>
                <li>
                  <Trans>Nose (1)</Trans>
                </li>
                <li>
                  <Trans>Cheeks (1)</Trans>
                </li>
                <li>
                  <Trans>Teeth (1)</Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>On-Chain Artwork</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  DAOpunks are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because DAOpunk parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </Trans>
              </p>

              <p>
                <Trans>
                  The compressed parts are efficiently converted into a single base64 encoding SVG
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
              <Trans>Punk Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The DAOpunk Seeder contract is used to determine DAOpunk traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm updates. Additionally, it can be locked by the Punkers DAO to prevent any
                  future updates. Currently, DAOpunk traits are determined using a pseudo-random number
                  generation:
                </Trans>
              </p>
              <code>
                keccak256(abi.encodePacked(blockhash(blockhash(block.number - 1), punkId))
              </code>
              <br />
              <br />
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a DAOpunk
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="7" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Punker's Reward</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  ’Punkers’ are the individuals responsible for building Punkers DAO. The Punkers
                  include:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="@cbobrobison"
                    url="https://twitter.com/cbobrobison"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@FR3UD_" url="https://twitter.com/FR3UD_" leavesPage={true} />
                </li>
              </ul>
              <p>
                <Trans>
                  As compensation for standing up Punkers DAO, Punkers (founders) have elected to use the same
                  model used by Nouns DAO's ’Nounders’ for compensating themselves. Every 10th DAOpunk
                  for the first five years of the project (#10,000, #10,010, etc) will be
                  automatically minted and sent to the Punkers's multisig wallet.
                </Trans>
              </p>
              <p>
                <Trans>
                  Punker distributions don't interfere with the cadence of 24hr auctions. DAOpunks are
                  sent directly to the Punkers's multisig and auctions resume without interruption.
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
