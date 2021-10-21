import classes from './VoteStatusPill.module.css';

interface VoteStatusPillProps {
  status: string;
}

const VoteStatusPill: React.FC<VoteStatusPillProps> = props => {
  const { status } = props;
  switch (status) {
    case 'success':
      return (
        <div className={`${classes.pass} ${classes.nounButton}`}>
          {' '}
          <div className={classes.nounButtonContents}>Passed</div>
        </div>
      );
    case 'failure':
      return (
        <div className={`${classes.fail} ${classes.nounButton}`}>
          <div className={classes.nounButtonContents}>Failed</div>
        </div>
      );
    default:
      return (
        <div className={`${classes.pending} ${classes.nounButton}`}>
          <div className={classes.nounButtonContents}>Pending</div>
        </div>
      );
  }
};

export default VoteStatusPill;
