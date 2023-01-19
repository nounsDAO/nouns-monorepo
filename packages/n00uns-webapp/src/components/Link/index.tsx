import { ReactNode } from 'react';
import classes from './Link.module.css';

const Link: React.FC<{ text: ReactNode; url: string; leavesPage: boolean }> = props => {
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
export default Link;
