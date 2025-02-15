import classes from './NounsIntroSection.module.css';
import Section from '../../layout/Section';
import { Col, Image, Row } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import bluntImg1 from '../../assets/blunts-1.jpg';
import bluntImg2 from '../../assets/blunts-2.jpg';
import bluntImg4 from '../../assets/blunts-4.jpg';

import Noun from '../Noun';

const NounsIntroSection = () => {
  return (
    <>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>The treasury for your local sesh</Trans>
            </h1>
            <p>
              <Trans>
                For 2+ years we have been doing BluntsDAO (also JointsDAO & SpliffDAO) for free. Now
                in year 3: we are on the path to scale: unlimited sesh. A replenishing treasury for
                holders to vote on global requests for sesh.
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={6} className={`order-lg-1 order-2`}>
          <Image src={bluntImg2} alt="Blunt" className={classes.imageClass} />
        </Col>
      </Section>
      <Section fullWidth={false} className={classes.videoSection}>
        <Col lg={6} className={`order-lg-1 order-2`}>
          <Image src={bluntImg1} alt="Blunt" className={classes.imageClass} />
        </Col>

        <Col lg={6} className={`order-lg-2 order-1`}>
          <div className={`${classes.textWrapper} ${classes.youtubeSectionText}`}>
            <h1>
              <Trans>Background</Trans>
            </h1>
            <p>
              <Trans>
                Originally started on Solana, we went all around the world to onboard the next
                million users 1 blunt at a time. We have sold nothing. We were too high to
                coordinate. Core team struggled with sobriety and then spurts of passion. We were so
                IRL. You must be validated in person by another validator. We were only allowing
                blunts. We vowed to do 420 on every chain. We did Solana. We did NEAR. At Breakpoint
                we launched SpliffDAO, allowing spliffs due to the scarcity of Blunts and us coming
                out of the hood and understanding the power of localization. We did Eth a year ago
                and allowed any smoke stick. Recently we built an abstracted process using telegram.
                Still friction. We got a SQDS, AstroDAO, and Snapshot, but without direct incentives
                and a treasury governance is hard, especially when everybody is high.
              </Trans>
            </p>
          </div>
        </Col>
      </Section>

      <Section fullWidth={false} className={classes.iosSection}>
        <Col lg={6}>
          <div className={classes.textWrapper}>
            <h1>
              <Trans>Mission </Trans>
            </h1>
            <h3>
              <Trans>
                Our mission is to onboard the next million users to Web3 1 blunt a a time.
              </Trans>
            </h3>
            <p>
              <Trans>
                But ultimately trying to get people to do on-chain stuff while they’re high,
                although it forces us to create innovative onboarding mechanisms, shouldnt be the
                point. Or joint? The “joint” should be to use proof of sesh, to raise awareness, and
                drive incentivies for expanding the sesh..
              </Trans>
            </p>
          </div>
        </Col>
        <Col lg={6} className={classes.iosImgContainer}>
          <img src={bluntImg4} className={classes.iosImg} alt="nouns ios" />
        </Col>
      </Section>
    </>
  );
};

export default NounsIntroSection;
