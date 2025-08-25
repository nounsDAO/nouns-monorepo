import { Trans } from '@lingui/react/macro';

import calendar_noun from '@/assets/calendar_noun.png';
import LegacyNoun from '@/components/legacy-noun';
import Section from '@/components/section';

const Banner = () => {
  return (
    <Section fullWidth={false}>
      <div className="w-full lg:w-1/2">
        <div className="max-lg:p-8">
          <h1 className="font-londrina text-[3.75rem] lg:ml-8 lg:text-[6rem]">
            <Trans>ONE NOUN,</Trans>
            <br />
            <Trans>EVERY DAY,</Trans>
            <br />
            <Trans>FOREVER.</Trans>
          </h1>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="p-8">
          <LegacyNoun imgPath={calendar_noun} alt="noun" />
        </div>
      </div>
    </Section>
  );
};

export default Banner;
