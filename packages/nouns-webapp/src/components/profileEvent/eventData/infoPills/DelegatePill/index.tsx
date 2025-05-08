import type { Address } from '@/utils/types';

import React from 'react';

import { ScaleIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';

import ShortAddress from '@/components/ShortAddress';

import classes from './DelegatePill.module.css';

interface DelegatePillProps {
  address: Address;
  proposalId: string;
}

const DelegatePill: React.FC<DelegatePillProps> = props => {
  const { address, proposalId } = props;

  return (
    <div className={classes.wrapper}>
      <ReactTooltip
        id={'noun-profile-delegate'}
        effect={'solid'}
        className={classes.delegateHover}
        getContent={dataTip => {
          return <div>{dataTip}</div>;
        }}
      />
      <div
        data-tip={`Delegate for Proposal ${proposalId}`}
        data-for="noun-profile-delegate"
        className={classes.pill}
      >
        <ScaleIcon className={classes.icon} />
        <ShortAddress address={address} />
      </div>
    </div>
  );
};

export default DelegatePill;
