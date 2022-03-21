import Section from '../../layout/Section';
import { Col, Container, Row } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';

const Documentation = () => {
  const cryptopunksLink = (
    <Link text="CryptoPunks" url="https://www.larvalabs.com/cryptopunks" leavesPage={true} />
  );
  const playgroundLink = <Link text="Playground" url="/playground" leavesPage={false} />;
  const publicDomainLink = (
    <Link
      text="public domain"
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link text="Compound Governance" url="https://compound.finance/governance" leavesPage={true} />
  );
  return (
    <Section fullWidth={false} className={classes.wrapper}>
      <Container fluid={'xxl'}>
        <div className={classes.headerWrapper}>
          <h1>What is CC0 DAO?</h1>
          <p className={classes.aboutText}>
            The Copyright Cartel: 0 (CC:0) DAO is a dedicated Web3 Creative Commons DAO, focusing on
            indie fashion, art, music and other creative derivative markets for cultivating well
            capitalised open source.
            <br />
            <br />
            This DAO exists to accelerate the entire creative world to the long overdue, very near
            future when control over creative works no longer ruins so many lives. Ultimately, this
            is due to the abuses Copyright Cartels and the fake promise that a certificate on paper
            of permission from them will mean any more than pennies for original creators.
            <br />
            <br />
            Ultimately, information wants to be free, and web3 allows for new models of monetisation
            when creative people can do whatever the hell that they want with each others ideas.
            <br />
            <br />
            Finally backing our ideals with real profit.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>What are daily CC0 DAO Auctions?</h1>
          <p className={classes.aboutText}>
            A cc0 content auction, every day, forever.
            <br />
            <br />
            Every 24 hours a new cc0 NFT goes to public auction on Ethereum with a reserve and can
            bid on to be owned by you. The cc0 NFTs placed on auction are curated by the DAO and
            represent far more than just their content display. They are also access keys into the
            DA0, representative of your voting weight within governance, curation and staking
            settings.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>What is the difference between the public and DAO only auction? </h1>
          <p className={classes.aboutText}>
            If an auction reserve is not met for the public auction on Ethereum, this NFT put for
            auction on Polygon Network in a DAO only bid setting. This means that you must be a
            member of the DAO to bid and hold $CC0 token to bid with. $CC0 token is distributed to
            members of the DAO.
            <br />
            <br />
            This dual model exists to establish and reinforce the value of CC0 content, particularly
            at a time when it is not yet wildly understood.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>Why have a reserve? </h1>
          <p className={classes.aboutText}>
            Unlike the conventional wisdom of the copyright cartel dominated old world, cc0 doesn’t
            mean no path to profit. In fact, it’s the exact opposite, but, if you’re here you
            probably know that already. The reserve component of the interval auction mechanism
            functions as a way to distinctly capture and convey a rising minimum value of high
            quality content that has been fully unleashed to drive greater amounts of source
            material, derivatives and hyper scale amplification of meaningful messages and stories
            across the metaverse.
            <br />
            <br />
            The auction reserves are determined through DAO governance.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>What is $CCO? </h1>
          <p className={classes.aboutText}>
            This is the native token for the DAO and is distributed to members through staking,
            direct contributions and other means.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>What happens every 15 days? </h1>
          <p className={classes.aboutText}>
            Every 15 days the cc0 NFT on public auction is automatically transferred to the CC0 DAO
            treasury to serve as cornerstones of the CC0 DAO vault.
          </p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>How to Join the DAO? </h1>
          <p className={classes.aboutText}>You can read all about that here.</p>
        </div>

        <div className={classes.headerWrapper}>
          <h1>Is this code cc0? </h1>
          <p className={classes.aboutText}>
            Yes. And it’s been forked directly from NounsDAO with a few custom tweaks added. You’re
            encouraged and welcomed to do the same before you pass it along.
          </p>
        </div>
      </Container>
    </Section>
  );
};
export default Documentation;
