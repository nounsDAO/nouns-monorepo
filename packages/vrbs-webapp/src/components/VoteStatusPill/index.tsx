import classes from './VoteStatusPill.module.css';

interface VoteStatusPillProps {
  status: string;
  text: React.ReactNode;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status, text } = props;
  switch (status) {
    case 'success':
      return <div className={`${classes.pass} ${classes.vrbButton}`}>{text}</div>;
    case 'failure':
      return <div className={`${classes.fail} ${classes.vrbButton}`}>{text}</div>;
    default:
      return <div className={`${classes.pending} ${classes.vrbButton}`}>{text}</div>;
  }
};

export default VoteStatusPill;
