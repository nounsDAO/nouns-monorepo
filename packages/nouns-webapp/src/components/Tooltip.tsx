import React from 'react';

import ReactTooltip from 'react-tooltip';

interface TooltipProps {
  tooltipContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, id, tip, tooltipContent }) => {
  return (
    <>
      <ReactTooltip id={id} className="!rounded-lg" getContent={tooltipContent} />
      <div data-tip={tip} data-for={id}>
        {children}
      </div>
    </>
  );
};

export default Tooltip;
