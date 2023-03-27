import classes from './HackathonBanner.module.css';

const HackathonBanner: React.FC<{}> = () => {
  return (
    <div className={classes.banner}>
      <a href="https://twitter.com/nounsprophouse/status/1640352924848078849" target="_blank" rel="noreferrer">
        Hack Week is here! Nouns is giving 99 ETH in prizes to builders and creators of all
        backgrounds. <b>Make something Nounish this week →</b>
      </a>
    </div>
  );
};

export default HackathonBanner;
