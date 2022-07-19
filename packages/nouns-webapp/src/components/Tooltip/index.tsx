import React from 'react';
import ReactTooltip from 'react-tooltip';
import classes from './Tooltip.module.css';

interface TooltipProps {
  hoverCardContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
}

const Tooltip: React.FC<TooltipProps> = props => {
  const { hoverCardContent, tip, id } = props;

  return (
    <>
      <ReactTooltip
        id={id}
        className={classes.hover}
        // effect={'solid'}
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

export default Tooltip;
