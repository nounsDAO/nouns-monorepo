import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import { Trans } from '@lingui/macro';

const NounsIntroSection = () => {
  return (
    <Section fullWidth={false}>
      <Col lg={6}>
        <div className={classes.wrapper}>
          <h1>
            <Trans>One Noun, Every Day, Forever.</Trans>
          </h1>
          <p>
            <Trans>
              Behold, an infinite work of art! Nouns is an experimental project that takes the best parts of web3 and tries to create a community that
              can proliferate its brand and do good at the same time. Learn more in this video (paid for by the Nouns treasury and created by its community members).
            </Trans>
          </p>
        </div>
      </Col>
      <Col lg={6} className={classes.embedContainer}>
        <iframe
          title="This is Nouns"
          src="https://player.vimeo.com/video/781320182?h=db24612c0a&color=eaeae5&title=0&byline=0&portrait=0"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </Col>
    </Section>
  );
};

export default NounsIntroSection;
