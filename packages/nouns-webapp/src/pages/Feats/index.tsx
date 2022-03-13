import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Feats.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from 'D:/GitHub/nouns-monorepo/packages/nouns-webapp/src/components/Link';

const Documentation = () => {
  // const cryptopunksLink = (
  //   <Link text="CryptoPunks" url="https://www.larvalabs.com/cryptopunks" leavesPage={true} />
  // );
  // const playgroundLink = <Link text="Playground" url="/playground" leavesPage={false} />;
  // const publicDomainLink = (
  //   <Link
  //     text="public domain"
  //     url="https://creativecommons.org/publicdomain/zero/1.0/"
  //     leavesPage={true}
  //   />
  // );
  const compoundGovLink = (
    <Link text="Compound Governance" url="https://compound.finance/governance" leavesPage={true} />
  );
  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
           <h2>Hackathons</h2>
           <br />
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>GnuSwap</Accordion.Header>
            <Accordion.Body>
              Connext Network sponsor prize at ETHGlobal ScalingEthereum Hackathon, Connext Network Grant ($5k)
            </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Zoduid</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Teacher/Instructor/Mentor</li>
               {/* Create proposals to conduct sessions which cover a preplanned set of topics in a specified duration. 
               Preferably 10 x 2 hour sessions with a predefined Course Amount (CA).Teachers receive 5% of the CA (5% of the CA will be awarded  in terms of CDT tokens).
               */}
                <li>Student/Pupil/Novice</li>
                {/* 1. Attend sessions conducted by teachers and receive POAP tokens.
                2. Complete reading tasks and assignments to be rewarded with 0.01% of the CA in terms of CDT.
                3. Complete mini project and capstone project - 0.5%  of the CA in terms of CDT */}
                <li>Grant Project Contributors</li>
                {/* Accomplish specific milestones in the grant project
                Contributors receive 90% of the grant amount
                10% goes to the DAO and contributors receive returns in CDT */}
                <li>Hackathon Participants</li>
                {/* Complete specific milestones in the hackathon project and make a successful submission - get 85% of bounty, if won
                10% goes to the DAO and contributors receive returns in CDT */}
                <li>Donations</li>
                {/* Every donation to the DAO is eligible for a 5% return in CDT Tokens */}
                <li>Business</li>
                {/* Responsible for bringing new project proposals and grant opportunities to the community.
                Each new grant that is created upon creation is eligible for 100 CDT
                Upon grant getting passed 5% of grant value can be claimed by Business lead */}
                <li>Legal Team</li>
               {/* Provide legal advice and help the DAO understand regulations and regulatory changes
               Contributors receive 85% of the grant amount for a legal support that we provide to other DAO's
               10% goes to the DAO and contributors receive returns in CDT
               Ensure compliance in the DAO operations */}
                <li>Marketing Team</li>
                {/* Develop and implement strategies to promote awareness about the DAO and its activities
                Contributors receive 85% of the grant amount for marketing support that we provide to other DAO's
                10% goes to the DAO and contributors receive returns in CDT
                Manage social media outreach. */}
              </ul>
              <h5>*CDT token distribution is based on dollar value calculated at the time of disbursal</h5>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Skyfire DAO 
            </Accordion.Header>
            <Accordion.Body>
              <p>
                In addition to the precautions taken by Compound Governance, Chiliagons have given
                themselves a special veto right to ensure that no malicious proposals can be passed
                while the Chili supply is low. This veto right will only be used if an obviously
                harmful governance proposal has been passed, and is intended as a last resort.
                <br /><br />
                Chiliagons will proveably revoke this veto right when they deem it safe to do so. This
                decision will be based on a healthy Noun distribution and a community that is
                engaged in the governance process.
              </p>
            </Accordion.Body>
          </Accordion.Item>
           <div className={classes.headerWrapper}>
           <h2>Grants</h2>
           <br />
           
           </div>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Connext
            </Accordion.Header>
            <Accordion.Body>
              <p>
                Chilis are stored directly on Ethereum and do not utilize pointers to other networks
                such as IPFS. This is possible because Chilis parts are compressed and stored on-chain
                using a custom run-length encoding (RLE), which is a form of lossless compression.
                <br /><br />
                The compressed parts are efficiently converted into a single base64 encoded SVG
                image on-chain. To accomplish this, each part is decoded into an intermediate format
                before being converted into a series of SVG rects using batched, on-chain string
                concatenation. Once the entire SVG has been generated, it is base64 encoded.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default Documentation;




