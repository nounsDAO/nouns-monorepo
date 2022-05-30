import Avatar from '@davatar/react';
import { Trans } from '@lingui/macro';
import React from 'react';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import ShortAddress from '../ShortAddress';
import { useAccountVotes } from '../../wrappers/nounToken';
import { useEthers } from '@usedapp/core/dist/cjs/src';
import { ChangeDelegateState } from '../ChangeDelegatePannel';
import { usePickByState } from '../../utils/pickByState';
import DelegationCandidateVoteCountInfo from '../DelegationCandidateVoteCountInfo';
import BrandSpinner from '../BrandSpinner';
import classes from './DelegationCandidateInfo.module.css';

interface DelegationCandidateInfoProps {
  address: string;
  changeModalState: ChangeDelegateState;
}

const DelegationCandidateInfo: React.FC<DelegationCandidateInfoProps> = props => {
  const { address, changeModalState } = props;

  const shortAddress = useShortAddress(address);
  const { account } = useEthers();

  const votes = useAccountVotes(address);
  const votesToAdd = useAccountVotes(account) || 0;

  const countDelegatedNouns = votes ?? 0;

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
        voteCount={countDelegatedNouns + votesToAdd}
        isLoading={true}
      />,
      <DelegationCandidateVoteCountInfo
        text={<Trans>Now has</Trans>}
        // TODO confirm this is correct
        voteCount={countDelegatedNouns + votesToAdd}
        isLoading={false}
      />,
    ],
  );

  if (votes === null) {
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
          <Avatar address={address} size={45} />
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
