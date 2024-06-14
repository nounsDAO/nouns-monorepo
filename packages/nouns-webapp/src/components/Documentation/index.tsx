import Section from '../../layout/Section';
import { Col, Row } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';
import { Trans } from '@lingui/macro';

interface DocumentationProps {
  backgroundColor?: string;
}

const AccordionFormat = () => {
  return (
    <Accordion flush>
      <Accordion.Item eventKey="0" className={classes.accordionItem}>
        <Accordion.Header className={classes.accordionHeader}>
          <Trans>Progress</Trans>
        </Accordion.Header>
        <Accordion.Body>
          <p>
            <Trans>We are proud to announce in the 2 years we have made</Trans>
          </p>
          <ul>
            <li>
              <Trans>0 revenue.</Trans>
            </li>
            <li>
              <Trans>Forgot to give ~ 2000 people NFTs</Trans>
            </li>
            <li>
              <Trans>Spent alot of money blunts.</Trans>
            </li>
            <li>
              <Trans>Went alot of places and smoked and did activations in most continents.</Trans>
            </li>
            <li>
              <Trans>Met alot of people and OGs in the space.</Trans>
            </li>
            <li>
              <Trans>Tried to solve onboarding.</Trans>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>

      <Accordion.Item eventKey="1" className={classes.accordionItem}>
        <Accordion.Header className={classes.accordionHeader}>
          <Trans>Objectives</Trans>
        </Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>
              <Trans>
                Create a self sustaining treasury for unlimited joints, blunts, other stick based
                items based on NFT ownership
              </Trans>
            </li>
            <li>
              <Trans>Give incentives for people to buy and join</Trans>
            </li>
            <li>
              <Trans>Build brand, gain revenue with other partnerships</Trans>
            </li>
            <li>
              <Trans>Bleed into culture everyday culture</Trans>
            </li>
            <li>
              <Trans>Create something iconic like goggles and proliferate that brand</Trans>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2" className={classes.accordionItem}>
        <Accordion.Header className={classes.accordionHeader}>
          <Trans>Goals</Trans>
        </Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>
              <Trans>100 seshes in 100 cities in first year</Trans>
            </li>
            <li>
              <Trans>100 unique members</Trans>
            </li>
            <li>
              <Trans>Next 4.20/2025</Trans>
            </li>
            <li>
              <Trans>Be present in every major Web3 event</Trans>
            </li>
            <li>
              <Trans>
                Keep treasury consistent and transition to revenue through brand partnerships
              </Trans>
            </li>
            <li>
              <Trans>Proof of Sesh with over 5000 people around the world</Trans>
            </li>{' '}
            <li>
              <Trans>2025 be present in every major Web2 cultural event</Trans>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3" className={classes.accordionItem}>
        <Accordion.Header className={classes.accordionHeader}>
          <Trans>When are the next auctions determined? (Dynamically Nounsgarthmic Auction) </Trans>
        </Accordion.Header>
        <Accordion.Body>
          <ul>
            <li>
              <Trans>Our regular auction interval is 24 hours</Trans>
            </li>
            <li>
              <Trans>
                Our target price for each auction is 0.042 ETH about the price of 1 ounce of bud
              </Trans>
            </li>
            <li>
              <Trans>
                Based on what the price of the last auction has ended, that auction interval is
                changed inversely. Example, if we surpass the price of 0.042 ETH (0.084 ETH) by 2x
                then the next auction is ½ of the regular auction interval (in the next 12 hours).
                On the other hand if the last auction ends at 0.021 ETH, half the target price),
                then the next auction end 2x longer than the regular auction interval, in 48 hours
              </Trans>
            </li>
            <li>
              <Trans>
                This allows more supply and less supply based on market demands. If more sesh money,
                than more NFTs are minted.
              </Trans>
            </li>
          </ul>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4" className={classes.accordionItem}>
        <Accordion.Header className={classes.accordionHeader}>
          <Trans>Who can use the art?</Trans>
        </Accordion.Header>
        <Accordion.Body>
          <p>
            <Trans>
              In the spirit of nouns.wtf, all our assets and tooling is open source and our traits
              are under{' '}
              <Link
                leavesPage={true}
                text="CCO"
                url="https://creativecommons.org/public-domain/cc0/"
              />{' '}
              BluntsDAO, JointsDAO, SpliffDAO in public domain for people to proliferate brand,
              (hoggles)
            </Trans>
          </p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

const LineFormat = () => {
  return (
    <>
      <Row className={classes.singleRow}>
        <h1>
          <Trans>Progress</Trans>
        </h1>
        <p>
          <Trans>We are proud to announce in the 2 years we have made</Trans>
        </p>
        <ul>
          <li>
            <Trans>0 revenue.</Trans>
          </li>
          <li>
            <Trans>Forgot to give ~ 2000 people NFTs</Trans>
          </li>
          <li>
            <Trans>Spent alot of money blunts.</Trans>
          </li>
          <li>
            <Trans>Went alot of places and smoked and did activations in most continents.</Trans>
          </li>
          <li>
            <Trans>Met alot of people and OGs in the space.</Trans>
          </li>
          <li>
            <Trans>Tried to solve onboarding.</Trans>
          </li>
        </ul>
      </Row>
      <hr className={classes.rule} />
      <Row className={classes.singleRow}>
        <h1>
          <Trans>Objectives</Trans>
        </h1>
        <ul>
          <li>
            <Trans>
              Create a self sustaining treasury for unlimited joints, blunts, other stick based
              items based on NFT ownership
            </Trans>
          </li>
          <li>
            <Trans>Give incentives for people to buy and join</Trans>
          </li>
          <li>
            <Trans>Build brand, gain revenue with other partnerships</Trans>
          </li>
          <li>
            <Trans>Bleed into culture everyday culture</Trans>
          </li>
          <li>
            <Trans>Create something iconic like goggles and proliferate that brand</Trans>
          </li>
        </ul>
        <hr className={classes.rule} />
        <h1>
          <Trans>Goals</Trans>
        </h1>
        <ul>
          <li>
            <Trans>100 seshes in 100 cities in first year</Trans>
          </li>
          <li>
            <Trans>100 unique members</Trans>
          </li>
          <li>
            <Trans>Next 4.20/2025</Trans>
          </li>
          <li>
            <Trans>Be present in every major Web3 event</Trans>
          </li>
          <li>
            <Trans>
              Keep treasury consistent and transition to revenue through brand partnerships
            </Trans>
          </li>
          <li>
            <Trans>Proof of Sesh with over 5000 people around the world</Trans>
          </li>{' '}
          <li>
            <Trans>2025 be present in every major Web2 cultural event</Trans>
          </li>
        </ul>
      </Row>
      <hr className={classes.rule} />
      <Row className={classes.singleRow}>
        <h1>
          <Trans>When are the next auctions determined? (Dynamically Nounsgarthmic Auction) </Trans>
        </h1>
        <ul>
          <li>
            <Trans>Our regular auction interval is 24 hours</Trans>
          </li>
          <li>
            <Trans>
              Our target price for each auction is 0.042 ETH about the price of 1 ounce of bud
            </Trans>
          </li>
          <li>
            <Trans>
              Based on what the price of the last auction has ended, that auction interval is
              changed inversely. Example, if we surpass the price of 0.042 ETH (0.084 ETH) by 2x
              then the next auction is ½ of the regular auction interval (in the next 12 hours). On
              the other hand if the last auction ends at 0.021 ETH, half the target price), then the
              next auction end 2x longer than the regular auction interval, in 48 hours
            </Trans>
          </li>
          <li>
            <Trans>
              This allows more supply and less supply based on market demands. If more sesh money,
              than more NFTs are minted.
            </Trans>
          </li>
        </ul>
      </Row>
      <hr className={classes.rule} />
      <Row className={classes.singleRow}>
        <h1>
          <Trans>Who can use the art?</Trans>
        </h1>
        <p>
          <Trans>
            In the spirit of nouns.wtf, all our assets and tooling is open source and our traits are
            under{' '}
            <Link
              leavesPage={true}
              text="CCO"
              url="https://creativecommons.org/public-domain/cc0/"
            />{' '}
            BluntsDAO, JointsDAO, SpliffDAO in public domain for people to proliferate brand,
            (hoggles)
          </Trans>
        </p>
      </Row>
      {/* <hr className={classes.rule} />
      <hr className={classes.rule} /> */}
    </>
  );
};

const Documentation = (props: DocumentationProps = { backgroundColor: '#FFF' }) => {
  return (
    <Section
      fullWidth={false}
      className={classes.documentationSection}
      style={{ background: props.backgroundColor }}
    >
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>What We Are Doing</Trans>
          </h1>
          <p className={classes.aboutText}>
            <Trans>
              This is why we are building the unlimited sesh fund. A regular auction where the mint
              depends on it hitting our “ounce” price of 0.042 ETH on base. All the money goes to
              treasury, and NFT holders of the “OUNCES” NFT vote on incoming proposals (that come
              from anyone) to fund their future sesh.
            </Trans>
          </p>
          <p className={classes.aboutText} style={{ paddingBottom: '4rem' }}>
            <Trans>Why?</Trans>
            <ul>
              <li>Forever reup our treasury with ounce for sesh</li>
              <li>Ownership gets you to decide the future of expansion in future seshes</li>
            </ul>
          </p>
        </div>
        {/* <hr className={classes.rule} /> */}
        {/* <AccordionFormat /> */}
        <LineFormat />
      </Col>
    </Section>
  );
};
export default Documentation;
