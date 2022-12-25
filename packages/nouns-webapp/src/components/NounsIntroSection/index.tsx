import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Button, Col, Nav } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

const NounsIntroSection = () => {
  return (
    <Section fullWidth={false} style={{ padding: '4rem 0' }}>
      <Col lg={6}>
        <div className={classes.textWrapper}>
          <h1>
            <Trans>One Noun, Every Day, Forever.</Trans>
          </h1>
          <p>
            <Trans>
            Behold, an infinite work of art! From collectors, technologists and builders, to non-profits and brands, Nouns has something for everyone. Watch the video to learn more.
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
          This video was commissioned in <Nav.Link as={Link} to="/vote/113">Prop 113</Nav.Link> and minted in <Nav.Link as={Link} to="/vote/190">Prop 190</Nav.Link>.
        </small>
      </Col>
    </Section>
  );
};

export default NounsIntroSection;
