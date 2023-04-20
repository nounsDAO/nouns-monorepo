import React from 'react';
import classes from './CandidateSponsors.module.css';
// import DatePicker from 'react-datepicker';

type Props = {};

function SignatureForm({}: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState(new Date());

  return (
    <div className={classes.formWrapper}>
      <h4 className={classes.formLabel}>Sponsor this proposal candidate</h4>
      <textarea />

      <h4 className={classes.formLabel}>Expiration date</h4>
      <input type="date" />
      {/* <DatePicker
        selected={expirationDate}
        onChange={expirationDate => setExpirationDate(expirationDate)}
      /> */}
    </div>
  );
}

export default SignatureForm;
