import classes from './VoteProgressBar.module.css';

export enum ProgressBarVariant {
  FOR,
  AGINST,
  ABSTAIN,
}

const VoteProgresBar: React.FC<{
  variant: ProgressBarVariant;
  percentage: number;
}> = props => {
  const { variant, percentage } = props;

  let progressBarColor;
  let backgroundColor;
  switch (variant) {
    case ProgressBarVariant.FOR:
      progressBarColor = 'var(--brand-color-green)';
      backgroundColor = 'var(--brand-color-green-translucent)';
      break;
    case ProgressBarVariant.AGINST:
      progressBarColor = 'var(--brand-color-red)';
      backgroundColor = 'var(--brand-color-red-translucent)';
      break;
    default:
      progressBarColor = 'var(--brand-gray-light-text)';
      backgroundColor = 'var(--brand-gray-light-text-translucent)';
      break;
  }

  return (
    <div className={classes.wrapper} style={{ backgroundColor: backgroundColor }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: progressBarColor,
        }}
        className={classes.progressBar}
      ></div>
    </div>
  );
};

export default VoteProgresBar;
