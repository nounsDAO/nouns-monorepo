import React from 'react';
import ReactTooltip from 'react-tooltip';
import classes from './HoverCard.module.css';

interface HoverCardProps {
  hoverCardContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
}

const HoverCard: React.FC<HoverCardProps> = props => {
  const { hoverCardContent, tip, id } = props;

  return (
    <>
      <ReactTooltip
        id={id}
        arrowColor={'rgba(0,0,0,0)'}
        className={classes.hover}
        effect={'solid'}
        getContent={dataTip => {
          return hoverCardContent(dataTip);
        }}
      />
      <div data-tip={tip} data-for={id}>
        {props.children}
      </div>
    </>
  );
};

export default HoverCard;
