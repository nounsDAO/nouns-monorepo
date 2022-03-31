import classes from './VoteStatusPill.module.css';

interface VoteStatusPillProps {
  status: string;
  localizedText: React.ReactNode;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status, localizedText } = props;
  switch (status) {
    case 'success':
      return <div className={`${classes.pass} ${classes.nounButton}`}>{localizedText}</div>;
    case 'failure':
      return <div className={`${classes.fail} ${classes.nounButton}`}>{localizedText}</div>;
    default:
      return <div className={`${classes.pending} ${classes.nounButton}`}>{localizedText}</div>;
  }
};

export default VoteStatusPill;
