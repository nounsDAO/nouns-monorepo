import classes from './Footer.module.css';
import Section from '../../layout/Section';
import heartNoun from '../../assets/heart-noun.png';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

const Footer = () => {
  const twitterURL = 'https://twitter.com/nounsdao';

  const location = useLocation();
  const useGreyBg = useAppSelector(state => state.application.useGreyBackground);
  const bgColor = location.pathname === '/' ? 'white' : useGreyBg ? '#d5d7e1' : '#e1d7d5';

  return (
    <Section bgColor={bgColor} fullWidth={false}>
      <footer className={classes.footerSignature}>
        <a href={twitterURL} target="_blank" rel="noreferrer">
          made with
          <img src={heartNoun} alt="heart noun" />
          by the nounders
        </a>
      </footer>
    </Section>
  );
};
export default Footer;
