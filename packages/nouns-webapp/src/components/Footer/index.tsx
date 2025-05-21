import { Trans } from '@lingui/react/macro';
import { Container } from 'react-bootstrap';

import Link from '@/components/Link';
import { nounsTokenAddress } from '@/contracts';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { externalURL, ExternalURL } from '@/utils/externalURL';
import { defaultChain } from '@/wagmi';

import classes from './Footer.module.css';

const Footer = () => {
  const chainId = defaultChain.id;

  const twitterURL = externalURL(ExternalURL.twitter);
  const etherscanURL = buildEtherscanAddressLink(nounsTokenAddress[chainId]);
  const farcasterURL = externalURL(ExternalURL.farcaster);

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature}>
          <Link text={<Trans>Twitter</Trans>} url={twitterURL} leavesPage={true} />
          <Link text={<Trans>Etherscan</Trans>} url={etherscanURL} leavesPage={true} />
          <Link text={<Trans>Farcaster</Trans>} url={farcasterURL} leavesPage={true} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
