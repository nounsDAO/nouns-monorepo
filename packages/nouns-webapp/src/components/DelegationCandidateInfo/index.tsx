import Avatar from '@davatar/react';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import ShortAddress from '../ShortAddress';
import { useAccountVotes } from '../../wrappers/nounToken';
import { useEthers } from '@usedapp/core/dist/cjs/src';
import { ChangeDelegateState } from '../ChangeDelegatePannel';
import { usePickByState } from '../../utils/pickByState';
import DelegationCandidateVoteCountInfo from '../DelegationCandidateVoteCountInfo';

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
      ChangeDelegateState.ENTRY_DELEGEE,
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      {/* ENS + AVATAR */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '0.75rem',
          justifyContent: 'space-between',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ marginRight: '1rem' }}>
            <Avatar address={address} size={45} />
          </div>
          <div>
            <div
              style={{
                color: 'var(--brand-cool-dark-text)',
                fontWeight: 'bold',
                fontSize: '22px',
              }}
            >
              <ShortAddress address={address} />
            </div>
            <div
              style={{
                fontWeight: '500',
                fontSize: '13px',
                color: 'var(--brand-cool-light-text)',
              }}
            >
              {shortAddress}
            </div>
          </div>
        </div>

        {/* Current Delegation Info */}
        {changeDelegateInfo}
      </div>
    </>
  );
};

export default DelegationCandidateInfo;
