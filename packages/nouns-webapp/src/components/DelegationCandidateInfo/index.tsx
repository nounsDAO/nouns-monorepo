import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { blo } from 'blo';

import { useShortAddress } from '@/utils/addressAndENSDisplayUtils';
import { usePickByState } from '@/utils/pickByState';
import { useAccountVotes } from '@/wrappers/nounToken';
import BrandSpinner from '@/components/BrandSpinner';
import { ChangeDelegateState } from '@/components/ChangeDelegatePannel';
import DelegationCandidateVoteCountInfo from '@/components/DelegationCandidateVoteCountInfo';
import ShortAddress from '@/components/ShortAddress';

import classes from './DelegationCandidateInfo.module.css';
import { Address } from '@/utils/types';

interface DelegationCandidateInfoProps {
  address: string;
  changeModalState: ChangeDelegateState;
  votesToAdd: number;
}

const DelegationCandidateInfo: React.FC<DelegationCandidateInfoProps> = props => {
  const { address, changeModalState, votesToAdd } = props;

  const [willHaveVoteCount, setWillHaveVoteCount] = useState(0);

  const shortAddress = useShortAddress(address);

  const votes = useAccountVotes(address);

  const countDelegatedNouns = votes ?? 0;

  // Do this so that in the lag between the delegation happening on chain and the UI updating
  // we don't show that we've added the delegated votes twice
  useEffect(() => {
    if (
      changeModalState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
      willHaveVoteCount !== 0
    ) {
      setWillHaveVoteCount(0);
      return;
    }

    if (willHaveVoteCount > 0) {
      return;
    }
    if (
      changeModalState !== ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
      willHaveVoteCount !== countDelegatedNouns + votesToAdd
    ) {
      setWillHaveVoteCount(countDelegatedNouns + votesToAdd);
    }
  }, [willHaveVoteCount, countDelegatedNouns, votesToAdd, changeModalState]);

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
