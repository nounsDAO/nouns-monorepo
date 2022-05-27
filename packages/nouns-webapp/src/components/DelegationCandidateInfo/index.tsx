import { useQuery } from '@apollo/client';
import Avatar from '@davatar/react';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import ShortAddress from '../ShortAddress';
import { union } from 'lodash';
import { useAccountVotes } from '../../wrappers/nounToken';

interface DelegationCandidateInfoProps {
  address: string;
  currentBlockNumber: number;
}

const DelegationCandidateInfoProps: React.FC<DelegationCandidateInfoProps> = props => {
  const { address } = props;

  const shortAddress = useShortAddress(address);

  const votes = useAccountVotes(address);
  const countDelegatedNouns = votes ?? 0;
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
          backgroundColor: 'red',
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
        <div>
          {countDelegatedNouns > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div>
                <Trans>Already has</Trans>
              </div>
              <div>
                <Trans>{countDelegatedNouns} Votes</Trans>
              </div>
            </div>
          ) : (
            <div>
              <Trans>No Nouns Delegates</Trans>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DelegationCandidateInfoProps;
