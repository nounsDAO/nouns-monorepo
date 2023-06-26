import { useQuery } from '@apollo/client';
import { ScaleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { delegateTokensAtBlockQuery } from '../../wrappers/subgraph';
import HorizontalStackedTokens from '../HorizontalStackedTokens';
import ShortAddress from '../ShortAddress';
import classes from './DelegateHoverCard.module.css';

interface DelegateHoverCardProps {
  delegateId: string;
  proposalCreationBlock: number;
}

const DelegateHoverCard: React.FC<DelegateHoverCardProps> = props => {
  const { delegateId, proposalCreationBlock } = props;

  const unwrappedDelegateId = delegateId ? delegateId.replace('delegate-', '') : '';

  const { data, loading, error } = useQuery(
    delegateTokensAtBlockQuery([unwrappedDelegateId], proposalCreationBlock),
  );

  if (loading || !data || data === undefined || data.delegates.length === 0) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  if (error) {
    return <>Error fetching Vote info</>;
  }

  const numVotesForProp = data.delegates[0].nRepresented.length;

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedNounWrapper}>
        <HorizontalStackedTokens
          tokenIds={data.delegates[0].nRepresented.map((noun: { id: string }) => noun.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.nounInfoWrapper}>
        <ScaleIcon height={20} width={20} className={classes.icon} />
        {numVotesForProp === 1 ? (
          <Trans>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>Punk
          </Trans>
        ) : (
          <Trans>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>Punks
          </Trans>
        )}
      </div>
    </div>
  );
};

export default DelegateHoverCard;
