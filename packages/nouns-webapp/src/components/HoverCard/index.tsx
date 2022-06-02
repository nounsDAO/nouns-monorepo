import React from 'react';
import ReactTooltip from 'react-tooltip';
import classes from './HoverCard.module.css';

interface HoverCardProps {
  hoverCardContent: (dataTip: string) => React.ReactNode;
  tip: string;
}

const HoverCard: React.FC<HoverCardProps> = props => {
  const { hoverCardContent, tip } = props;

  return (
    <>
      <ReactTooltip
        id="hover-card"
        arrowColor={'rgba(0,0,0,0)'}
        className={classes.hover}
        getContent={dataTip => {
          return hoverCardContent(dataTip);
        }}
      />
      <div data-tip={tip} data-for="hover-card">
        {props.children}
      </div>
    </>
  );
};

export default HoverCard;
