import React from 'react';

import { Trans } from '@lingui/react/macro';
import ReactTooltip from 'react-tooltip';

import ShortAddress from '@/components/ShortAddress';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import { Proposal, ProposalState, Vote } from '@/wrappers/nounsDao';

import classes from './ProposalVoteHeadline.module.css';

interface ProposalVoteHeadlineProps {
  proposal: Proposal;
  supportDetailed: Vote | undefined;
  voter: Address | undefined;
}

const ProposalVoteHeadline: React.FC<ProposalVoteHeadlineProps> = ({
  proposal,
  supportDetailed,
  voter,
}) => {
  if (supportDetailed === undefined) {
    if (proposal.status === ProposalState.PENDING || proposal.status === ProposalState.ACTIVE) {
      return <Trans>Waiting for</Trans>;
    }
    return <Trans>Absent for</Trans>;
  }

  const voterComponent = (
    <>
      <ReactTooltip
        id={'view-on-etherscan-tooltip'}
        effect={'solid'}
        className={classes.delegateHover}
        getContent={dataTip => {
          return <div>{dataTip}</div>;
        }}
      />
      <span
        className={classes.voterLink}
        data-tip={`View on Etherscan`}
        data-for="view-on-etherscan-tooltip"
        onClick={e => {
          // This is so that we don't navigate to the prop page on click the address
          e.stopPropagation();
          window.open(buildEtherscanAddressLink(voter ?? ''), '_blank');
        }}
      >
        <ShortAddress address={voter ?? '0x'} />
      </span>
    </>
  );

  switch (supportDetailed) {
    case Vote.FOR:
      return <Trans>{voterComponent} voted for</Trans>;
    case Vote.ABSTAIN:
      return <Trans>{voterComponent} abstained on</Trans>;
    default:
      return <Trans>{voterComponent} voted against</Trans>;
  }
};

export default ProposalVoteHeadline;
