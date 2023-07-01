import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col, Nav } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import nounsIosGif from '../../assets/nouns-ios.gif';
import dlFromAppStoreImg from '../../assets/download-on-app-store.svg';

const NounsIntroSection = () => {
  const prophouseLink = (
    <a
      href="https://prop.house/"
      target="_blank"
      rel="noreferrer"
      className={classes.nounsIntroLinks}
    >
      <Trans>Prop House</Trans>
    </a>
  );

  return (
    <>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              Welcome to <br />
              the DAO!
            </h1>
            <p>
                Here you can find all the tools and info you need to get involved in our events, projects, and governance.
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.youtubeEmbedContainer}>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23F4511E&ctz=America%2FChicago&mode=WEEK&showNav=0&showPrint=0&showCalendars=0&showTabs=0&showTz=0&showTitle=0&showDate=0&src=Y19rNGgyMWg1aGoxMjd1c3ZuZjRsZ3Zia3ZkOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23D81B60"
            title="Google Calendar"
            frameBorder="1"
          ></iframe>

          <small className={`${classes.videoSubtitle} ${classes.youtubeVideoSubtitle} text-muted`}>
            This is the official ATX DAO events calendar - click the plus button to add it!
          </small>
        </Col>
      </Section>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6} className={`${classes.youtubeEmbedContainer} order-lg-1 order-2`}>


          <small className={`${classes.videoSubtitle} ${classes.youtubeVideoSubtitle} text-muted`}>

          </small>
        </Col>

        <Col lg={6} className={`order-lg-2 order-1`}>
          <div className={`${classes.textWrapper} ${classes.youtubeSectionText}`}>
            <h1>
              Get Involved
            </h1>
            <p>
              Check out the Guild Pages to see ongoing projects!
            </p>
            <p>
              <b>Ecosystem Guild</b><br/>
              Empower local artists and businesses to participate in web3
            </p>
            <p>
              <b>Community Guild</b><br/>
              Connect and unite Austin's crypto communities
            </p>
            <p>
              <b>Policy Guild</b><br/>
              Advise our government on better crypto policy
            </p>
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
              Every month we host a <b>giving circle</b> where we distribute <b>$1000 USDC</b> to reward DAO members for contributing!
            </p>
            <p>
              This event is an opportunity to showcase contributions that members have submitted from the past month.
              DAO members can recognize and reward each other’s contributions by distributing points to these contributions.
            </p>
            <p>
              At the end of the giving circle members will receive a percentage of the compensation pool,
              based on how many points their contributions received over the total number of distributed points.
            </p>
            <p>
              Fill out the <a href="https://forms.gle/jWiv7k8HoRzs6KQb6">Contributor Setup Request</a> form to submit contributions to our next giving circle!
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.iosImgContainer}>

        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
