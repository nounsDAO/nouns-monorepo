import { useQuery } from '@apollo/client';
import { ScaleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { delegateNounsBRAtBlockQuery } from '../../wrappers/subgraph';
import HorizontalStackedNounsBR from '../HorizontalStackedNounsBR';
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
    delegateNounsBRAtBlockQuery([unwrappedDelegateId], proposalCreationBlock),
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

  const numVotesForProp = data.delegates[0].nounsbrRepresented.length;

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedNounBRWrapper}>
        <HorizontalStackedNounsBR
          nounbrIds={data.delegates[0].nounsbrRepresented.map((nounbr: { id: string }) => nounbr.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.nounbrInfoWrapper}>
        <ScaleIcon height={20} width={20} className={classes.icon} />
        {numVotesForProp === 1 ? (
          <Trans>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>NounBR
          </Trans>
        ) : (
          <Trans>
            Voted with<span className={classes.bold}>{numVotesForProp}</span>NounsBR
          </Trans>
        )}
      </div>
    </div>
  );
};

export default DelegateHoverCard;
