import React, { ReactNode } from 'react';

interface LinkProps {
  text: ReactNode;
  url: string;
  leavesPage: boolean;
}

const Link: React.FC<LinkProps> = ({ leavesPage, text, url }) => {
  return (
    <a
      className="text-brand-dark-red hover:underline"
      href={url}
      target={leavesPage ? '_blank' : '_self'}
      rel="noreferrer"
    >
      {text}
    </a>
  );
};
export default Link;
