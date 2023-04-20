import React from 'react';
import classes from './CandidateSponsors.module.css';
import dayjs from 'dayjs';

type Props = {};

function SignatureForm({}: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState<number>();

  const handleFormSubmit = () => {
    console.log('handle form submission', expirationDate, reasonText);
  };
  return (
    <div className={classes.formWrapper}>
      <h4 className={classes.formLabel}>Sponsor this proposal candidate</h4>
      <textarea
        placeholder="Optional reason"
        value={reasonText}
        onChange={event => setReasonText(event.target.value)}
      />

      <h4 className={classes.formLabel}>Expiration date</h4>
      <input
        type="date"
        min={new Date().toISOString().split('T')[0]} // only future dates
        onChange={e => setExpirationDate(+dayjs(e.target.value))}
      />
      <button className={classes.button} onClick={() => handleFormSubmit()}>
        Sponsor
      </button>
    </div>
  );
}

export default SignatureForm;
