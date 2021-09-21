import classes from './Footer.module.css';
import Section from '../../layout/Section';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import config from '../../config';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const etherscanURL = buildEtherscanAddressLink(config.tokenAddress);

  const location = useLocation();
  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);
  const bgColor =
    location.pathname === '/' || location.pathname.startsWith('/noun/')
      ? 'white'
      : useGreyBg
      ? '#d5d7e1'
      : '#e1d7d5';

  return (
    <Section bgColor={bgColor} fullWidth={false} className={classes.alignBottom}>
      <footer className={classes.footerSignature}>
        <a href={twitterURL} target="_blank" rel="noreferrer">
          twitter
        </a>
        <a href={etherscanURL} target="_blank" rel="noreferrer">
          etherscan
        </a>
        <a href={discordURL} target="_blank" rel="noreferrer">
          discord
        </a>
      </footer>
    </Section>
  );
};
export default Footer;
