import { Trans } from '@lingui/react/macro';
import { Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router';

import LinkComponent from '@/components/Link';
import Section from '@/layout/Section';

import classes from './NounsIntroSection.module.css';

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
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={12}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>Nouns is a global community.</Trans>
            </h1>
            <p>
              <Trans>
                From a school in Uganda to a coffee shop in LA, from a crypto hub in São Paulo to a
                deli in Melbourne, Nouns lives wherever creative people bring ideas to life. Explore
                nounish people, places, and things with{' '}
                <LinkComponent
                  text={<Trans>Nounspot</Trans>}
                  url="https://nounspot.com"
                  leavesPage={true}
                />
                .
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={12} className={classes.nounspotContainer}>
          <iframe
            src="https://nounspot.com/embed?sidebar=true&toggle=true&addspot=true&header=true&fullpage=true"
            width="100%"
            height="500px"
            allow="geolocation"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Nounspot Map"
          ></iframe>
          <small className={`${classes.videoSubtitle} text-muted`}>
            Built by{' '}
            <Nav.Link as="a" href="https://x.com/playdna_" target="_blank" rel="noreferrer">
              PlayDNA
            </Nav.Link>
          </small>
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
