import React from 'react';

import ReactTooltip from 'react-tooltip';

interface HoverCardProps {
  hoverCardContent: (dataTip: string) => React.ReactNode;
  tip: string;
  id: string;
  children: React.ReactNode;
}

const HoverCard: React.FC<HoverCardProps> = props => {
  const { hoverCardContent, tip, id } = props;

  return (
    <>
      <ReactTooltip
        id={id}
        arrowColor={'rgba(0,0,0,0)'}
        className="!box-border !h-fit !w-max !min-w-[217px] !rounded-xl !border !border-gray-200 !bg-white !text-black !shadow-sm"
        effect={'solid'}
        getContent={hoverCardContent}
      />
      <div data-tip={tip} data-for={id}>
        {props.children}
      </div>
    </>
  );
};

export default HoverCard;
