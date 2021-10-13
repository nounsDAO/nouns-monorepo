import classes from './Footer.module.css';
import Section from '../../layout/Section';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import Link from '../Link';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.tokenAddress);
  const discourseURL = externalURL(ExternalURL.discourse);

  return (
    <Section fullWidth={false} className={classes.alignBottom}>
      <footer className={classes.footerSignature}>
        <Link text="discord" url={discordURL} leavesPage={true} />
        <Link text="twitter" url={twitterURL} leavesPage={true} />
        <Link text="etherscan" url={etherscanURL} leavesPage={true} />
        <Link text="discourse" url={discourseURL} leavesPage={false} />
      </footer>
    </Section>
  );
};
export default Footer;
