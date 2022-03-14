import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';
import { externalURL, ExternalURL } from '../../utils/externalURL';
import Link from '../Link';

const Footer = () => {
  const twitterURL = externalURL(ExternalURL.twitter);
  const discordURL = externalURL(ExternalURL.discord);
  const githubURL = externalURL(ExternalURL.github);
  const documentationURL = externalURL(ExternalURL.documentation);
  const mediumURL = externalURL(ExternalURL.medium);
  const mirrorURL = externalURL(ExternalURL.mirror);

  return (
    <div className={classes.wrapper}>
      <Container fluid={'xxl'} className={classes.container}>
        <div className={classes.topBar}>
          <div className={classes.logo}>CC:0</div>
          <div className={classes.description}>
            This DAO exists to accelerate the entire creative world to the long overdue, very near
            future when control over creative works no longer ruin so many lives.
          </div>
        </div>
        <footer className={classes.footerSignature}>
          <Link text="Twitter" url={twitterURL} leavesPage={true} />
          <Link text="Discord" url={discordURL} leavesPage={true} />
          <Link text="Github" url={githubURL} leavesPage={true} />
          <Link text="Documentation" url={documentationURL} leavesPage={true} />
          <Link text="Medium" url={mediumURL} leavesPage={true} />
          <Link text="Mirror" url={mirrorURL} leavesPage={false} />
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
