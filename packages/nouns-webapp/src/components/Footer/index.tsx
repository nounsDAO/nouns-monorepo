import classes from './Footer.module.css';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <div className={classes.wrapper}>
      <Container className={classes.container}>
        <footer className={classes.footerSignature} style={{ color: 'var(--brand-warm-light-text) !important' }}>
          Powered by<a href="https://firstset.xyz" style={{ color: 'var(--brand-warm-light-text)' }}>Firstset</a>
        </footer>
      </Container>
    </div>
  );
};
export default Footer;
