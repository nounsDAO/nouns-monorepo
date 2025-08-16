/* eslint-disable react/prop-types */
import classes from './vote-status-pill.module.css';

interface VoteStatusPillProps {
  status: string;
  text: React.ReactNode;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status, text } = props;
  switch (status) {
    case 'success':
      return <div className={`${classes.pass} ${classes.nounButton}`}>{text}</div>;
    case 'failure':
      return <div className={`${classes.fail} ${classes.nounButton}`}>{text}</div>;
    default:
      return <div className={`${classes.pending} ${classes.nounButton}`}>{text}</div>;
  }
};

export default VoteStatusPill;
