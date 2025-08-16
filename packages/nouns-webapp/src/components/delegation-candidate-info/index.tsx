import React from 'react';

import { Trans } from '@lingui/react/macro';
import { blo } from 'blo';

import BrandSpinner from '@/components/brand-spinner';
import DelegationCandidateVoteCountInfo from '@/components/delegation-candidate-vote-count-info';
import ShortAddress from '@/components/short-address';
import { formatShortAddress } from '@/utils/address-and-ens-display-utils';
import { usePickByState } from '@/utils/pick-by-state';
import { Address } from '@/utils/types';
import { useAccountVotes } from '@/wrappers/noun-token';

import { ChangeDelegateState } from '../change-delegate-panel';

import classes from './delegation-candidate-info.module.css';

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
      <div className={classes.spinner}>
        <BrandSpinner />
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.delegateCandidateInfoWrapper}>
        <div className={classes.avatarWrapper}>
          <img
            alt={address}
            src={blo(address as Address)}
            width={45}
            height={45}
            style={{ borderRadius: '50%' }}
          />
        </div>
        <div>
          <div className={classes.ensText}>
            <ShortAddress address={address} />
          </div>
          <div className={classes.shortAddress}>{shortAddress}</div>
        </div>
      </div>

      {changeDelegateInfo}
    </div>
  );
};

export default DelegationCandidateInfo;
