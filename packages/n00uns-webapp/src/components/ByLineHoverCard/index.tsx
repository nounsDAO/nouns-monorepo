import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedN00uns } from '../../wrappers/subgraph';
import HorizontalStackedN00uns from '../HorizontalStackedN00uns';
import ShortAddress from '../ShortAddress';
import classes from './ByLineHoverCard.module.css';
import { ScaleIcon } from '@heroicons/react/solid';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUN_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedN00uns(proposerAddress));

  if (loading || (data && data.delegates.length === 0)) {
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

  const sortedN00unIds = data.delegates[0].n00unsRepresented
    .map((n00un: { id: string }) => {
      return parseInt(n00un.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedN00unWrapper}>
        <HorizontalStackedN00uns
          n00unIds={data.delegates[0].n00unsRepresented.map((n00un: { id: string }) => n00un.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.n00unsRepresented}>
        <div>
          <ScaleIcon height={15} width={15} className={classes.icon} />
          {sortedN00unIds.length === 1 ? (
            <Trans>
              <span>Delegated N00un: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated N00uns: </span>
            </Trans>
          )}

          {sortedN00unIds.slice(0, MAX_NOUN_IDS_SHOWN).map((n00unId: number, i: number) => {
            return (
              <span className={classes.bold} key={n00unId.toString()}>
                {n00unId}
                {i !== Math.min(MAX_NOUN_IDS_SHOWN, sortedN00unIds.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {sortedN00unIds.length > MAX_NOUN_IDS_SHOWN && (
            <span>
              <Trans>... and {sortedN00unIds.length - MAX_NOUN_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
