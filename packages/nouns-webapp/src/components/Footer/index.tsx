import classes from './Footer.module.css';
import Section from '../../layout/Section';
import heartNoun from '../../assets/heart-noun.png';

const Footer = () => {
  const twitterURL = 'https://twitter.com/nounsdao';

  return (
    <Section bgColor="white" fullWidth={false}>
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
