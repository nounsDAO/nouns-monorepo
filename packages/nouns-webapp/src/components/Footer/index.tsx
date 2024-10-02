import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';

interface FooterProps {
  currentPath: string;
}

const Footer: React.FC<FooterProps> = ({ currentPath }) => {

  const isHomePage = currentPath === '/' || currentPath.startsWith('/boun/');

  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={`${classes.footerSignature} ${isHomePage ? classes.homePage : ''}`}>
          Bootstrapped by&nbsp;<a href="https://firstset.xyz">Firstset</a>
        </footer>
      </Container>
    </div>
  );
};

export default Footer;
