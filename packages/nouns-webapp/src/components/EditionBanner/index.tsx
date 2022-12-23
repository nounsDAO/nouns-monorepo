import classes from './EditionBanner.module.css';
import Section from '../../layout/Section';
import nounsEditionGif from '../../assets/nouns-edition-gif.gif';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { Trans } from '@lingui/macro';

const EditionBanner = () => {
  return (
    <Section fullWidth={false}>
      <div className={classes.bannerSectionOuter}>
        <div className={classes.bannerSection}>
          <a href="https://www.thisisnouns.wtf/">
            <div className={classes.wrapper}>
              <p>The First Edition</p>
              <h1>
                <Trans>This is Nouns</Trans>
              </h1>
              <NavBarButton
                buttonText={<Trans>Now minting</Trans>}
                buttonIcon={<></>}
                buttonStyle={NavBarButtonStyle.WHITE_ACTIVE}
                className={classes.button}
              />
            </div>
          </a>
          <img src={nounsEditionGif} alt="Nouns Edition animated gif" />
        </div>
      </div>
    </Section>
  );
};

export default EditionBanner;
