import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import Link from '../Link';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const discourseURL = externalURL(ExternalURL.discourse);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link text="discord" url={discordURL} leavesPage={true} />
          <Link text="twitter" url={twitterURL} leavesPage={true} />
          <Link text="etherscan" url={etherscanURL} leavesPage={true} />
          <Link text="discourse" url={discourseURL} leavesPage={false} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
