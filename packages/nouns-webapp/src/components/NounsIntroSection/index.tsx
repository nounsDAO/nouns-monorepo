import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col, Nav } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import nounsIosGif from '../../assets/nouns-ios.gif';
import dlFromAppStoreImg from '../../assets/download-on-app-store.svg';

const NounsIntroSection = () => {
  return (
    <>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>One Noun, Every Day, Forever.</Trans>
            </h1>
            <p>
              <Trans>
                Behold, an infinite work of art! Nouns is a community-owned brand that makes a
                positive impact by funding ideas and fostering collaboration. From collectors
                and technologists, to non-profits and brands, Nouns is for everyone.
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.embedContainer}>
          <iframe
            title="This is Nouns"
            src="https://player.vimeo.com/video/781320182?h=db24612c0a&color=eaeae5&title=0&byline=0&portrait=0"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <small className={`${classes.videoSubtitle} text-muted`}>
            This video was commissioned in{' '}
            <Nav.Link as={Link} to="/vote/113">
              Prop 113
            </Nav.Link>{' '}
            and minted in{' '}
            <Nav.Link as={Link} to="/vote/190">
              Prop 190
            </Nav.Link>
            .
          </small>
        </Col>
      </Section>
      <Section fullWidth={false} className={classes.iosSection}>
        <Col lg={6} className={classes.iosImgContainer}>
          <img src={nounsIosGif} className={classes.iosImg} alt="nouns ios" />
        </Col>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>Download the Free iOS App</Trans>
            </h1>
            <p>
              <Trans>
                Every new Noun pushed right to your pocket! View the current auction, remix your own
                Noun, and explore the entire history directly from the app.
              </Trans>
              <br />
              <a
                href="https://apps.apple.com/us/app/nouns-explore-create-play/id1592583925"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={dlFromAppStoreImg}
                  className={classes.dlFromAppStoreImg}
                  alt="download nouns ios app from app store"
                />
              </a>
            </p>
          </div>
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
