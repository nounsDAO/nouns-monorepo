import React from 'react';

import ReactTooltip from 'react-tooltip';

import classes from './Tooltip.module.css';

interface TooltipProps {
  tooltipContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, id, tip, tooltipContent }) => {
  return (
    <>
      <ReactTooltip
        id={id}
        className={classes.hover}
        getContent={(dataTip): React.ReactNode => {
          return tooltipContent(dataTip);
        }}
      />
      <div data-tip={tip} data-for={id}>
        {children}
      </div>
    </>
  );
};

export default Tooltip;
