import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedVrbs } from '../../wrappers/subgraph';
import HorizontalStackedVrbs from '../HorizontalStackedVrbs';
import ShortAddress from '../ShortAddress';
import classes from './ByLineHoverCard.module.css';
import { ScaleIcon } from '@heroicons/react/solid';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUN_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedVrbs(proposerAddress));

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

  const sortedVrbIds = data.delegates[0].vrbsRepresented
    .map((vrb: { id: string }) => {
      return parseInt(vrb.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedVrbWrapper}>
        <HorizontalStackedVrbs
          vrbIds={data.delegates[0].vrbsRepresented.map((vrb: { id: string }) => vrb.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.vrbsRepresented}>
        <div>
          <ScaleIcon height={15} width={15} className={classes.icon} />
          {sortedVrbIds.length === 1 ? (
            <Trans>
              <span>Delegated Vrb: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated Vrbs: </span>
            </Trans>
          )}

          {sortedVrbIds.slice(0, MAX_NOUN_IDS_SHOWN).map((vrbId: number, i: number) => {
            return (
              <span className={classes.bold} key={vrbId.toString()}>
                {vrbId}
                {i !== Math.min(MAX_NOUN_IDS_SHOWN, sortedVrbIds.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {sortedVrbIds.length > MAX_NOUN_IDS_SHOWN && (
            <span>
              <Trans>... and {sortedVrbIds.length - MAX_NOUN_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
