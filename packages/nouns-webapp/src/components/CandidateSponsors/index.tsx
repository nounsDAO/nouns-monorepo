import React from 'react';
import classes from './CandidateSponsors.module.css';

interface CandidateSponsorsProps {
  slug: string;
}

const CandidateSponsors: React.FC<CandidateSponsorsProps> = props => {
  const { slug } = props;
  return (
    <div className={classes.wrapper}>
      <header>
        <h4>
          <strong>0/5 Sponsored Votes</strong>
        </h4>
        <p>Proposal candidates must meet the required Nouns vote threshold.</p>
      </header>
      <ul className={classes.sponsorsList}>
        <li className={classes.sponsor}>
          <div className={classes.details}>
            <div className={classes.sponsorInfo}>
              {/* TODO: truncase long names */}
              <p className={classes.sponsorName}>0x123</p>
              <p className={classes.expiration}>expires in 30 days</p>
            </div>
            <p className={classes.voteCount}>2 votes</p>
          </div>
        </li>
        <li className={classes.placeholder}> </li>
        {/* TODO: conditional button show based on nouns holder  */}
        <button className={classes.button}>Sponsor</button>
      </ul>
    </div>
  );
};

export default CandidateSponsors;
