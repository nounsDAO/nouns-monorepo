import Avatar from '@davatar/react';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import ShortAddress from '../ShortAddress';
import { useAccountVotes } from '../../wrappers/nToken';
import { ChangeDelegateState } from '../ChangeDelegatePannel';
import { usePickByState } from '../../utils/pickByState';
import DelegationCandidateVoteCountInfo from '../DelegationCandidateVoteCountInfo';
import BrandSpinner from '../BrandSpinner';
import classes from './DelegationCandidateInfo.module.css';
import { useActiveLocale } from '../../hooks/useActivateLocale';

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

  const locale = useActiveLocale();

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
        text={countDelegatedNouns > 0 ? <Trans>Already has</Trans> : <Trans>Has</Trans>}
        voteCount={countDelegatedNouns}
        isLoading={false}
      />,
      <DelegationCandidateVoteCountInfo
        text={<Trans>Will have</Trans>}
        voteCount={willHaveVoteCount}
        isLoading={true}
      />,
      <DelegationCandidateVoteCountInfo
        text={<Trans>Now has</Trans>}
        voteCount={countDelegatedNouns}
        isLoading={false}
      />,
    ],
  );

  if (votes === null) {
    return (
      <div className={classes.spinner}>
        <BrandSpinner/>
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.delegateCandidateInfoWrapper}>
        <div className={classes.avatarWrapper}>
          {address ? <Avatar address={address} size={45}/> :
            <div className={classes.avatar}/>}
        </div>
        <div>
          <div className={classes.ensText}>
            {address ? <ShortAddress address={address}/> : <span>Enter address above</span>}
          </div>
          <div
            className={classes.shortAddress}>{address ? shortAddress : locale === 'en-US' ? '0x... or ...eth' : '0x... / ...eth'}</div>
        </div>
      </div>

      {changeDelegateInfo}
    </div>
  );
};

export default DelegationCandidateInfo;
