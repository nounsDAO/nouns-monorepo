import { Trans } from '@lingui/react/macro';

import _404img from '@/assets/404noun.png';
import Section from '@/components/section';

import classes from './not-found.module.css';

const NotFoundPage = () => {
  return (
    <Section fullWidth={false}>
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <img
            src={typeof _404img === 'string' ? _404img : (_404img as { src: string }).src}
            alt="404 Noun"
            className="h-auto max-w-full"
          />
        </div>
        <div className="lg:col-span-8">
          <h1 className={classes.heading}>
            <Trans>404: This is not the person, place, or thing you&apos;re looking for...</Trans>
          </h1>
        </div>
      </div>
    </Section>
  );
};
export default NotFoundPage;
