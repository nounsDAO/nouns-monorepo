import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedNouns } from '../../wrappers/subgraph';
import HorizontalStackedNouns from '../HorizontalStackedNouns';
import NounderNounContent from '../NounderNounContent';
import ShortAddress from '../ShortAddress';

interface PropByLineHoverCardProps {
  delegateAddress: string;
}

const PropByLineHoverCard: React.FC<PropByLineHoverCardProps> = props => {
  const { delegateAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedNouns(delegateAddress));

  if (loading || (data && data.delegates.length === 0)) {
    return <Spinner animation="border" />;
  }
  if (error) {
    return <>Error fetching Vote info</>;
  }

  const sortedNounIds = data.delegates[0].nounsRepresented
    .map((noun: { id: string }) => {
      return parseInt(noun.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'red',
          display: 'flex',
        }}
      >
        <HorizontalStackedNouns
          nounIds={data.delegates[0].nounsRepresented.map((noun: { id: string }) => noun.id)}
        />
      </div>

      <div
        style={{
          fontFamily: 'Londrina Solid',
          fontSize: '24px',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div
        style={{
          color: 'var(--brand-gray-dark-text)',
          display: 'flex',
          //   backgroundColor: 'red',
          marginTop: '0.25rem',
        }}
      >
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            height: '20px',
            width: '20px',
            marginRight: '0.25rem',
            marginLeft: '-0.1rem',
            marginTop: '0.1rem',
          }}
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg> */}

        <div
          style={{
            fontWeight: '500',
            fontSize: '15px',
          }}
        >
          <Trans>
            <span style={{ fontWeight: 'bold' }}>Nouns Currently Reprsented:</span>
          </Trans>{' '}
          {sortedNounIds.map((nounId: number, i: number) => {
            return (
              <span>
                {nounId}
                {i !== sortedNounIds.length - 1 && ', '}{' '}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropByLineHoverCard;
