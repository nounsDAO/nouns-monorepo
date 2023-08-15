import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
// import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import Link from '../Link';
import { Trans } from '@lingui/macro';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const instagramURL = externalURL(ExternalURL.instagram);
  const linkedinURL = externalURL(ExternalURL.linkedin);
  const jobPortalURL = externalURL(ExternalURL.jobPortal);
  const discordURL = externalURL(ExternalURL.discord);
  const githubURL = externalURL(ExternalURL.github);
  const telegramURL = externalURL(ExternalURL.telegram);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link text={<Trans>Discord</Trans>} url={discordURL} leavesPage={true} />
          <Link text={<Trans>Twitter</Trans>} url={twitterURL} leavesPage={true} />
          <Link text={<Trans>LinkedIn</Trans>} url={linkedinURL} leavesPage={true} />
          <Link text={<Trans>Instagram</Trans>} url={instagramURL} leavesPage={true} />
          <Link text={<Trans>Job Portal</Trans>} url={jobPortalURL} leavesPage={true} />
          <Link text={<Trans>Github</Trans>} url={githubURL} leavesPage={true} />
          <Link text={<Trans>Telegram</Trans>} url={telegramURL} leavesPage={true} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
