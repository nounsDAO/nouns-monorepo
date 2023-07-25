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
  const cryptopunksLink = (
    <Link text={<Trans>CryptoPunks</Trans>} url="https://cryptopunks.app/" leavesPage={true} />
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
  const blueprintLink = (
    <Link
      text={<Trans>ATX DAO Blueprint</Trans>}
      url="https://snapshot.org/#/atxdao.eth/proposal/0x8cfd82908b44e88c5715f16124faa1040f64b8d55161524148e7d1cd5b9d5b58"
      leavesPage={true}
    />
  );
  const dao2Link = (
    <Link
      text={<Trans>ATX DAO 2.0</Trans>}
      url="https://snapshot.org/#/atxdao.eth/proposal/0x42f1f945ddf51b5afb85bfa53f851769dd252c8c7b09121b9e0fb0dfbac85435"
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
        <div className={classes.headerWrapper} style={{ paddingBottom: '2rem' }}>
          <h1>
            <Trans>More About Us...</Trans>
          </h1>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Who we are</Trans>
            </Accordion.Header>
            <Accordion.Body>
            <p>ATX DAO is an organization of members passionate about the future of technology, creativity,
               and governance united by a shared love for the city of Austin. We are founders, artists, traders,
               thought leaders, professionals, engineers, and investors working together to make Austin a leading city
               in the crypto industry and a better city as a whole. We are a group of friends and collaborators with a shared
               treasury and ideas about how to use it.</p>

            {/* <a href="https://www.youtube.com/watch?v=ZvC-WN10E5o" target="#">A New Austin Institution</a>. */}
            <br/>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/ZvC-WN10E5o" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            <br/>
            <br/>
            <p>ATX DAO was founded in October 2021 as a social organization and has grown into a new Austin institution.
              Due to the combined efforts of the membership base, ATX DAO has established itself as a leading City DAO,
              responsible for accomplishing tasks many would have deemed impossible from a group of people operating in an organic,
              decentralized, and grassroots manner.</p>

            {/* <a href="https://www.youtube.com/watch?v=NUh8UGEXjJ4" target="#">Introducing ATX DAO</a>. */}
            <br/>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/NUh8UGEXjJ4" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            <br/>
            <br/>
<p>As a DAO, each member is able to <a href="https://snapshot.org/#/atxdao.eth" target="#">create a proposal and vote on the future of our organization</a>.
    Membership is signified by an NFT and 1 NFT = 1 vote. Anyone with an NFT can create a proposal
    about what the organization should do and what the treasury should be spent on.
    This makes ATX DAO the most democratic institution in the city, and our bottom-up, self-governing system is an
    innovative structure that puts us in a position to have an impact in ways never before seen in Austin.
   </p>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Legal Structure</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <Trans>
                ATX DAO is registered with the Secretary of State as ATX DAO Public Relations LLC. This entity is used to interact with vendors and sponsors, handle legal agreements, and protect members from liability related to events and public-facing activities. Funds from the Gnosis Safe are released to this LLC as needed. In order to see the full net worth of the treasury, review the <a href="https://app.charmverse.io/atx-dao/page-1665440576207129" target="#">financial statements</a>. We are currently working with a lawyer to wrap the full membership body into a UNA (unincorporated nonprofit association).
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>



          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Expectations</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
              ATX DAO members are not required to contribute. The simple act of being a part of the network and minting an NFT brings immense value to the DAO. However, it is encouraged that you take advantage of the events we organize to build relationships and enjoy yourselves. If you are interested in being a leader or a contributor, please do not hesitate to vocalize that desire to a fellow member, DAO Operator (Mason Lynaugh or Megan Murray), or a Guild Guide.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Cadence</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
              <b>Subscribe to the <a href="https://calendar.google.com/calendar/u/0/r?cid=c_k4h21h5hj127usvnf4lgvbkvd8@group.calendar.google.com" target="#">events calendar</a> to stay informed about ATX DAO events.</b>
              <br/>
              <b>- Weekly</b> <br/>Every Monday at 5:30 PM we have an open floor conversation in Discord Voice. Every Wednesday at 8:00 PM is the weekly Engineering meeting in Discord Voice.
              <br/>
              <b>- Monthly</b> <br/> On the second Tuesday of every month, we meet at Keiretsu from 6-8 PM to socialize, strategize, and reward contributions via the giving circle. Pizza and beverages are provided. On the final Thursday of the month, we host a public hacker meetup. 
              <br/>
              <b>- Yearly</b> <br/> ATX DAO hosts an annual gala toward the end of the year for DAO members, plus ones, sponsors / strategic partners as needed. The dress code is formal. Tickets are sold to the general public at a high price point. ATX DAO also hosts an annual Web3 Pitch Competition.
              <br/>
              <b>- Flagship</b> <br/> ATX DAO organizes large events associated with conferences such as SXSW, Consensus, and Permissionless. Over time, the organization will explore new creative event ideas.              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              <Trans>Leadership Opportunities</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className={classes.aboutText}>
                <Trans>
                We are looking for ambitious new DAO members to assume responsibility and grow into leaders within ATX DAO. Reach out to a Guild Guide or DAO Operator if interested.                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;
