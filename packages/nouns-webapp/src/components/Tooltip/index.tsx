import React from 'react';
import ReactTooltip from 'react-tooltip';
import classes from './Tooltip.module.css';

interface TooltipProps {
  tooltipContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
}

const Tooltip: React.FC<TooltipProps> = props => {
  const { tooltipContent, tip, id } = props;

  return (
    <>
      <ReactTooltip
        id={id}
        className={classes.hover}
        getContent={dataTip => {
          return tooltipContent(dataTip);
        }}
      />
      <div data-tip={tip} data-for={id}>
        {props.children}
      </div>
    </>
  );
};

export default Tooltip;
