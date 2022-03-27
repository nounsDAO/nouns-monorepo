import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Feats.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Links from 'D:/GitHub/nouns-monorepo/packages/nouns-webapp/src/components/Links';
import { faCircleInfo } from '/node_modules/@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FeatsPage = () => {
  const AnbeShivam = (
    <Links buttonIcon={<FontAwesomeIcon icon={faCircleInfo} />} url="https://anbe-shivam.vercel.app/" leavesPage={true} />
  );
  const Contractlist = (
    <Links buttonIcon={<FontAwesomeIcon icon={faCircleInfo} />} url="https://contractlist.vercel.app/" leavesPage={true} />
  );
  const GnuSwap = (
    <Links buttonIcon={<FontAwesomeIcon icon={faCircleInfo} />} url="https://gnuswap-chiliagons.vercel.app/" leavesPage={true} />
  );
  const Zoduid = (
    <Links buttonIcon={<FontAwesomeIcon icon={faCircleInfo} />} url="https://github.com/chiliagons/0-chiliagon-dao" leavesPage={true} />
  );
  const SkyfireDAO = (
    <Links buttonIcon={<FontAwesomeIcon icon={faCircleInfo} />} url="https://github.com/skyfire-dao/unicode" leavesPage={true} />
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
            <Accordion.Header className={classes.accordionHeader}>GnuSwap&nbsp;{GnuSwap}
            </Accordion.Header>
            <Accordion.Body>
              Connext Network sponsor prize at ETHGlobal Scaling Ethereum Hackathon. 
            </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Zoduid&nbsp;{Zoduid}</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>3rd Place Enzyme Finance sponsor prize</li>
                <li> Superfluid pool prize at ETHOnline 2021 Hackathon.</li>
                
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Skyfire DAO&nbsp;{SkyfireDAO}
            </Accordion.Header>
            <Accordion.Body>
              Finalist prize at ETHGlobal Unicode Hackathon.
              
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              AnbeShivam&nbsp;{AnbeShivam}
            </Accordion.Header>
            <Accordion.Body>
               <ul>
                <li>Received grant at Polygon Grants Hackathon.</li>
                <li>3rd Place India Track at Celo Make Crypto Mobile Hackathon.</li>
                
              </ul> 
            </Accordion.Body>
          </Accordion.Item>
           <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Contractlist&nbsp;{Contractlist}
            </Accordion.Header>
            <Accordion.Body>
               Polygon pool prize at ETHGlobal Road to Web3 Hackathon.
               
            </Accordion.Body>
          </Accordion.Item>
           <div className={classes.headerWrapper}>
           <h2>Grants</h2>
           <br />
           </div>
          <Accordion.Item eventKey="5" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>
              Connext
            </Accordion.Header>
            <Accordion.Body>
              Connext Network Grant ($5k)
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Section>
  );
};
export default FeatsPage;




