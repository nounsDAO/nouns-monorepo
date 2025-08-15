import { Trans } from '@lingui/react/macro';
import { Col, Nav } from 'react-bootstrap';

import Section from '@/components/section';
import { Link } from 'react-router';

import classes from './nouns-intro-section.module.css';

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
                positive impact by funding ideas and fostering collaboration. From collectors and
                technologists, to non-profits and brands, Nouns is for everyone.
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.youtubeEmbedContainer}>
          <iframe
            src="https://www.youtube.com/embed/lOzCA7bZG_k"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allowFullScreen
          ></iframe>

          <small className={`${classes.videoSubtitle} ${classes.youtubeVideoSubtitle} text-muted`}>
            This video was commissioned in{' '}
            <Nav.Link as={Link} to="/vote/113">
              Prop 113
            </Nav.Link>{' '}
            <span className={classes.videoMintedSubtitle}>
              and minted in{' '}
              <Nav.Link as={Link} to="/vote/190">
                Prop 190
              </Nav.Link>
            </span>
          </small>
        </Col>
      </Section>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6} className={`${classes.youtubeEmbedContainer} order-lg-1 order-2`}>
          <iframe
            src="https://www.youtube.com/embed/oa79nN4gMPs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            allowFullScreen
          ></iframe>

          <small className={`${classes.videoSubtitle} ${classes.youtubeVideoSubtitle} text-muted`}>
            This video was produced as part of{' '}
            <Nav.Link as={Link} to="/vote/143">
              Prop 143
            </Nav.Link>
          </small>
        </Col>

        <Col lg={6} className={`order-lg-2 order-1`}>
          <div className={`${classes.textWrapper} ${classes.youtubeSectionText}`}>
            <h1>
              <Trans>Build With Nouns. Get Funded.</Trans>
            </h1>
            <p>
              <Trans>
                There&apos;s a way for everyone to get involved with Nouns. From whimsical endeavors
                like naming a frog, to ambitious projects like constructing a giant float for the
                Rose Parade, or even crypto infrastructure like Prop House. Nouns funds projects of
                all sizes and domains.
              </Trans>
            </p>
          </div>
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
