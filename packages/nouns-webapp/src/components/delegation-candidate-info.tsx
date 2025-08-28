import React from 'react';

import { Trans } from '@lingui/react/macro';
import { blo } from 'blo';

import BrandSpinner from '@/components/brand-spinner';
import { ChangeDelegateState } from '@/components/change-delegate-panel';
import DelegationCandidateVoteCountInfo from '@/components/delegation-candidate-vote-count-info';
import ShortAddress from '@/components/short-address';
import { formatShortAddress } from '@/utils/address-and-ens-display-utils';
import { usePickByState } from '@/utils/pick-by-state';
import { Address } from '@/utils/types';
import { useAccountVotes } from '@/wrappers/noun-token';

interface DelegationCandidateInfoProps {
  address: Address;
  changeModalState: ChangeDelegateState;
  votesToAdd: number;
}

const DelegationCandidateInfo: React.FC<DelegationCandidateInfoProps> = props => {
  const { address, changeModalState, votesToAdd } = props;

  const shortAddress = formatShortAddress(address);

  const votes = useAccountVotes(address);

  const countDelegatedNouns = votes ?? 0;

  // Derived value for the target vote count after delegation
  const willHaveVoteCount =
    changeModalState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS
      ? 0
      : countDelegatedNouns + votesToAdd;

  const changeDelegateInfo = usePickByState(
    changeModalState,
    [
      ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
      ChangeDelegateState.CHANGING,
      ChangeDelegateState.CHANGE_SUCCESS,
    ],
    [
      <DelegationCandidateVoteCountInfo
        key="enter-delegate"
        text={countDelegatedNouns > 0 ? <Trans>Already has</Trans> : <Trans>Has</Trans>}
        voteCount={countDelegatedNouns}
        isLoading={false}
      />,
      <DelegationCandidateVoteCountInfo
        key="changing"
        text={<Trans>Will have</Trans>}
        voteCount={willHaveVoteCount}
        isLoading={true}
      />,
      <DelegationCandidateVoteCountInfo
        key="success"
        text={<Trans>Now has</Trans>}
        voteCount={countDelegatedNouns}
        isLoading={false}
      />,
    ],
  );

  if (votes == null) {
    return (
      <div className="flex justify-center">
        <BrandSpinner />
      </div>
    );
  }

  return (
    <div className="mt-3 flex justify-between px-2">
      <div className="flex">
        <div className="mr-4">
          <img
            alt={address}
            src={blo(address as Address)}
            width={45}
            height={45}
            style={{ borderRadius: '50%' }}
          />
        </div>
        <div>
          <div className="text-22 text-brand-cool-dark-text font-bold">
            <ShortAddress address={address} />
          </div>
          <div className="text-13 text-brand-cool-light-text font-medium">{shortAddress}</div>
        </div>
      </div>

      {changeDelegateInfo}
    </div>
  );
};

export default DelegationCandidateInfo;
