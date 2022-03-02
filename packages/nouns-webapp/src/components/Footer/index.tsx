import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';
import { LinkedComponent } from '../Link';
import { Trans } from '@lingui/macro';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.addresses.nounsToken);
  const discourseURL = externalURL(ExternalURL.discourse);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <LinkedComponent child={<Trans>Discord</Trans>} url={discordURL} leavesPage={true} />
          <LinkedComponent child={<Trans>Twitter</Trans>} url={twitterURL} leavesPage={true} />
          <LinkedComponent child={<Trans>Etherscan</Trans>} url={etherscanURL} leavesPage={true} />
          <LinkedComponent child={<Trans>Discourse</Trans>} url={discourseURL} leavesPage={false} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
