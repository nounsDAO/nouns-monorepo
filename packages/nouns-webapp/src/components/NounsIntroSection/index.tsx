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
            <Trans>WTF is Nouns?</Trans>
          </h1>
          <p>
            <Trans>
              That's the question we sought to answer in this crazy video - packing in more artistic
              styles than we've ever put into a project before, and a sprinkling of humour along the
              way.
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
