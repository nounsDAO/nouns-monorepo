import classes from './Link.module.css';

const Link: React.FC<{ text: string; url: string; leavesPage: boolean }> = props => {
  const { text, url, leavesPage } = props;
  return (
    <a
      className={classes.link}
      href={url}
      target={leavesPage ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {text}
    </a>
  );
};

export const LinkedComponent: React.FC<{
  child: React.ReactNode;
  url: string;
  leavesPage: boolean;
}> = props => {
  const { child, url, leavesPage } = props;
  return (
    <a
      className={classes.link}
      href={url}
      target={leavesPage ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {child}
    </a>
  );
};

export default Link;
