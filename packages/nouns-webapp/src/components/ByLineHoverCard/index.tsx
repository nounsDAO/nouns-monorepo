import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedNouns } from '../../wrappers/subgraph';
import HorizontalStackedNouns from '../HorizontalStackedNouns';
import ShortAddress from '../ShortAddress';
import classes from './ByLineHoverCard.module.css';
import { ScaleIcon } from '@heroicons/react/solid';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUN_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedNouns(proposerAddress));

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

  const sortedNounIds = data.delegates[0].nounsRepresented
    .map((noun: { id: string }) => {
      return parseInt(noun.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedNounWrapper}>
        <HorizontalStackedNouns
          nounIds={data.delegates[0].nounsRepresented.map((noun: { id: string }) => noun.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.nounsRepresented}>
        <div>
          <ScaleIcon height={15} width={15} className={classes.icon} />
          {sortedNounIds.length === 1 ? (
            <Trans>
              <span>Delegated Noun: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated Nouns: </span>
            </Trans>
          )}

          {sortedNounIds.slice(0, MAX_NOUN_IDS_SHOWN).map((nounId: number, i: number) => {
            return (
              <span className={classes.bold} key={nounId.toString()}>
                {nounId}
                {i !== Math.min(MAX_NOUN_IDS_SHOWN, sortedNounIds.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {sortedNounIds.length > MAX_NOUN_IDS_SHOWN && (
            <span>
              <Trans>... and {sortedNounIds.length - MAX_NOUN_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
