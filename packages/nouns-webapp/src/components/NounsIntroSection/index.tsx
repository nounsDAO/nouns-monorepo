import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Button, Col, Nav } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import nounsIosGif from '../../assets/nouns-ios.gif';
import dlFromAppStoreImg from '../../assets/download-on-app-store.svg';
import tiktokImg from '../../assets/tiktok.png';
import snapchatImg from '../../assets/snapchat.png';
import instagramImg from '../../assets/instagram.png';
import facebookImg from '../../assets/facebook.png';
import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';

const CarouselImages = [
  <img src={nounsIosGif} className={classes.iosImg} alt="nouns ios" />,
  <div className={classes.lensesVideoContainer}>
    <video autoPlay loop muted className={classes.lensesVideo}>
      <source
        src="https://community-lens.storage.googleapis.com/preview-media/final/de17e9c7-cbef-47bb-b4cf-76a7dd70d2bc.mp4"
        type="video/mp4"
      />
    </video>
  </div>,
];
const NounsIntroSection = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
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
              <br />
              <Trans>Like this video?</Trans>
              <a href="https://www.thisisnouns.wtf/" target="_blank" rel="noreferrer">
                <Button className={classes.collectVideoBtn}>
                  <Trans>Collect it</Trans>
                </Button>
              </a>
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
      <Section fullWidth={false}>
        <Col lg={6}>{CarouselImages[carouselIndex]}</Col>
        <Carousel
          as={Col}
          lg={6}
          style={{ paddingLeft: '2rem', height: '35rem' }}
          interval={5500}
          variant="dark"
          controls={false}
          onSlide={index => setCarouselIndex(index)}
        >
          <Carousel.Item>
            <div className={classes.textWrapper}>
              <h1>
                <Trans>Download the Free iOS App</Trans>
              </h1>
              <p>
                <Trans>
                  Every new Noun pushed right to your pocket! View the current auction, remix your
                  own Noun, and explore the entire history directly from the app.
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
          </Carousel.Item>
          <Carousel.Item>
            <div className={classes.textWrapper} style={{ paddingLeft: '0rem' }}>
              <h1>
                <Trans>You, but Nounish</Trans>
              </h1>
              <p>
                <Trans>
                  Add whimsy to your videos by putting on a pair of Nouns glasses or completely
                  transform yourself into a quirky and playful Noun with AR filters. Available for
                  TikTok, Snapchat, and Instagram.
                </Trans>
                <br />
                <a
                  href="https://www.tiktok.com/sticker/Noggles-5695800"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={tiktokImg}
                    className={classes.socialPlatformLogo}
                    alt="download nouns ios app from app store"
                  />
                </a>
                <a
                  href="https://lens.snapchat.com/d1507087c8f5479f89a73464805f76cb"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={snapchatImg}
                    className={classes.socialPlatformLogo}
                    alt="download nouns ios app from app store"
                  />
                </a>
                <a
                  href="https://www.instagram.com/ar/2050002801834821/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={instagramImg}
                    className={classes.socialPlatformLogo}
                    alt="download nouns ios app from app store"
                  />
                </a>
                <a
                  href="https://www.facebook.com/fbcameraeffects/tryit/2050002801834821/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={facebookImg}
                    className={classes.socialPlatformLogo}
                    alt="download nouns ios app from app store"
                  />
                </a>
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </Section>
    </>
  );
};

export default NounsIntroSection;
