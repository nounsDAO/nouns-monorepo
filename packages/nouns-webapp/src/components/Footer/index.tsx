import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import Link from '../Link';
import { Trans } from '@lingui/macro';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const discourseURL = externalURL(ExternalURL.discourse);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link text={<Trans>Twitter</Trans>} url={twitterURL} leavesPage={true} />
          <Link text={<Trans>Etherscan</Trans>} url={etherscanURL} leavesPage={true} />
          <Link text={<Trans>Forums</Trans>} url={discourseURL} leavesPage={true} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
