import classes from './VoteStatusPill.module.css';

interface VoteStatusPillProps {
  status: string;
  text: React.ReactNode;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status, text } = props;
  switch (status) {
    case 'success':
      return <div className={`${classes.pass} ${classes.n00unButton}`}>{text}</div>;
    case 'failure':
      return <div className={`${classes.fail} ${classes.n00unButton}`}>{text}</div>;
    default:
      return <div className={`${classes.pending} ${classes.n00unButton}`}>{text}</div>;
  }
};

export default VoteStatusPill;
