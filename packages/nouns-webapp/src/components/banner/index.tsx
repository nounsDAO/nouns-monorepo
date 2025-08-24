import { Trans } from '@lingui/react/macro';
import { Col } from 'react-bootstrap';

import calendar_noun from '@/assets/calendar_noun.png';
import LegacyNoun from '@/components/legacy-noun';
import Section from '@/components/section';

const Banner = () => {
  return (
    <Section fullWidth={false}>
      <Col lg={6}>
        <div className="max-lg:p-8">
          <h1 className="font-londrina text-[3.75rem] lg:ml-8 lg:text-[6rem]">
            <Trans>ONE NOUN,</Trans>
            <br />
            <Trans>EVERY DAY,</Trans>
            <br />
            <Trans>FOREVER.</Trans>
          </h1>
        </div>
      </Col>
      <Col lg={6}>
        <div style={{ padding: '2rem' }}>
          <LegacyNoun imgPath={calendar_noun} alt="noun" />
        </div>
      </Col>
    </Section>
  );
};

export default Banner;
