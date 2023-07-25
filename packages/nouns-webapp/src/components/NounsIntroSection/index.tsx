import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col, Row, Nav, Card, Tab, Tabs } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import Link from '../../components/Link';
import distributionImage from '../../assets/givingCircle.jpeg';
import googleCalendarImage from '../../assets/googleCalendar.png';
import guildsImage from '../../assets/gala.jpeg';
import dlFromAppStoreImg from '../../assets/download-on-app-store.svg';

const contributorSetupLink = (
  <Link
    text="Contributor Setup Request"
    url="https://docs.google.com/forms/d/e/1FAIpQLSfJVNSXgSLZNWiQ_0I8I6dkQgcV2t22k9VbwK8k8HnUt_Upww/viewform"
    leavesPage={true}
  />
);

const contributionFormLink = (
  <Link
    text="Ongoing Contribution Form"
    url="https://docs.google.com/forms/d/e/1FAIpQLSc7cys4_uUSZqBScKidWV1udWI42lFpzh7_F8XR1BlGaE6_mA/viewform?usp=sf_link"
    leavesPage={true}
  />
);

const discordLink = (
  <Link
    text="our discord"
    url="https://discord.gg/xkAseAucRU"
    leavesPage={true}
  />
);

<a href="https://forms.gle/jWiv7k8HoRzs6KQb6">Ongoing Contribution Form</a>

const NounsIntroSection = () => {
  return (
    <>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col sm={12} lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              Welcome to <br />
              the DAO!
            </h1>
            <p>
              Here you can find all the tools and info you need to get involved in our events, projects, and governance.
            </p>
            <p>
              If you're new here, hop in our {discordLink} and type <code>/onboard-me</code> into any channel!
            </p>
          </div>
        </Col>
        <Col lg={6} style={{marginTop:'-100px'}}>
          <Row style={{textAlign:'center'}}>
            <Card
            className={classes.card}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://calendar.google.com/calendar/u/0/r?cid=c_k4h21h5hj127usvnf4lgvbkvd8@group.calendar.google.com', `_blank`);
            }}
            style={{ cursor: "pointer", padding: '0.2rem', width: '150px', marginLeft: 'auto', marginBottom:'-35px'}}>
              <a href="https://calendar.google.com/calendar/u/0/r?cid=c_k4h21h5hj127usvnf4lgvbkvd8@group.calendar.google.com">
              <img style ={{width:'100%', border:'2px solid rgb(60 135 249)'}} src={googleCalendarImage} alt="Google Calendar" /></a>
            </Card>
            <Tabs
              defaultActiveKey="featured"
            >
              <Tab eventKey="featured" title="Featured Events"  className={classes.youtubeEmbedContainer}>
                <iframe
                  src="https://lu.ma/embed/calendar/cal-yHgkMgwCAFEqbSO/events"
                  frameBorder="0"
                  style={{ border: '1px solid #bfcbda88', borderRadius: '4px', marginTop:'-20px', marginLeft:'-3%', width:'105%'}}
                ></iframe>
              </Tab>
              <Tab eventKey="full-calendar" title="Full Calendar" className={classes.youtubeEmbedContainer}>
                <iframe
                  src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23F4511E&ctz=America%2FChicago&mode=WEEK&showNav=0&showPrint=0&showCalendars=0&showTabs=0&showTz=0&showTitle=0&showDate=0&src=Y19rNGgyMWg1aGoxMjd1c3ZuZjRsZ3Zia3ZkOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D81B60"
                  title="Google Calendar"
                  frameBorder="0"
                  style={{ border: '1px solid #bfcbda88', borderRadius: '4px', marginTop:'-20px', marginLeft:'-3%', width:'105%'}}
                ></iframe>
              </Tab>
            </Tabs>
          </Row>
        </Col>
      </Section>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6}>
          <div className={classes.container}>
            <img style ={{marginLeft:'-100px', width:'130%', border:'2px solid #555'}} src={guildsImage} alt="Giving Circle Photo" />
            <div className={classes.overlay}></div>
          </div>
        </Col>

        <Col lg={6} className={`order-lg-2 order-1`}>
          <div className={`${classes.textWrapper} ${classes.youtubeSectionText}`}>
            <h1>
              Get Involved
            </h1>
            <p>
              Check out our Guild Projects!
            </p>
            <Card
            className={classes.card}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://app.charmverse.io/atx-dao/page-6656633176995772', `_blank`);
            }}  style={{ cursor: "pointer", padding: '1rem', paddingLeft: '2rem', marginBottom: '1rem'}}>
              <p>
                <b>Innovation Guild</b><br/>
                Foster web3 innovation with artists, local businesses, and entrepreneurs.
              </p>
            </Card>

            <Card
            className={classes.card}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://app.charmverse.io/atx-dao/page-11010455919205131', `_blank`);
            }}  style={{ cursor: "pointer", padding: '1rem', paddingLeft: '2rem', marginBottom: '1rem'}}>
              <p>
                <b>Community Guild</b><br/>
                Unite and give back to the Austin community and beyond.
              </p>
            </Card>

            <Card
            className={classes.card}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://app.charmverse.io/atx-dao/page-11010455919205131', `_blank`);
            }}  style={{ cursor: "pointer", padding: '1rem', paddingLeft: '2rem' }}>
              <p>
                <b>Advocacy Guild</b><br/>
                Advocate for the benefits of web3 to the government and general population.
              </p>
            </Card>
          </div>
        </Col>
      </Section>

      <Section fullWidth={false} className={classes.iosSection}>
        <Col lg={6}>
          <div className={classes.textWrapper} style={{ paddingBottom: '4rem' }}>
            <h1>
              Get Paid
            </h1>
            <p>
              During the <i>Monthly Member Meeting</i> at Keiretsu, we host a giving circle where we distribute <b>$1000 USDC</b> to reward DAO members for contributing!
            </p>
            <p>
              This event is an opportunity to showcase contributions that members have submitted from the past month. DAO members can recognize and reward each other’s
              contributions by distributing points for these contributions. At the end of the giving circle, members will receive a percentage of the compensation pool,
              based on how many points their contributions received over the total number of distributed points.
            </p>
            <p>
              To participate, first time contributors need to fill out the {contributorSetupLink} form.
              Then submit the {contributionFormLink} to feature your contributions in the next giving circle.
            </p>
            <p>
              Additionally, any ATX DAO member may create a project proposal and include a compensation structure.
            </p>
          </div>
        </Col>
        <Col lg={6}>
          <div className={classes.container}>
            <img style ={{width:'100%', border:'2px solid #555'}} src={distributionImage} alt="Giving Circle Photo" />
            <div className={classes.overlay}></div>
          </div>
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
