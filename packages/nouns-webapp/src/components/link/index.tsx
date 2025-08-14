import React, { ReactNode } from 'react';

import classes from './link.module.css';

interface LinkProps {
  text: ReactNode;
  url: string;
  leavesPage: boolean;
}

const Link: React.FC<LinkProps> = ({ leavesPage, text, url }) => {
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
