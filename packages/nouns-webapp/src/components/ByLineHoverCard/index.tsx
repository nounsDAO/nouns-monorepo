import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedNounsBR } from '../../wrappers/subgraph';
import HorizontalStackedNounsBR from '../HorizontalStackedNounsBR';
import ShortAddress from '../ShortAddress';
import classes from './ByLineHoverCard.module.css';
import { ScaleIcon } from '@heroicons/react/solid';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUNBR_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedNounsBR(proposerAddress));

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

  const sortedNounBRIds = data.delegates[0].nounsbrRepresented
    .map((nounbr: { id: string }) => {
      return parseInt(nounbr.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

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

      <div className={classes.nounsbrRepresented}>
        <div>
          <ScaleIcon height={15} width={15} className={classes.icon} />
          {sortedNounBRIds.length === 1 ? (
            <Trans>
              <span>Delegated NounBR: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated NounsBR: </span>
            </Trans>
          )}

          {sortedNounBRIds.slice(0, MAX_NOUNBR_IDS_SHOWN).map((nounbrId: number, i: number) => {
            return (
              <span className={classes.bold} key={nounbrId.toString()}>
                {nounbrId}
                {i !== Math.min(MAX_NOUNBR_IDS_SHOWN, sortedNounBRIds.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {sortedNounBRIds.length > MAX_NOUNBR_IDS_SHOWN && (
            <span>
              <Trans>... and {sortedNounBRIds.length - MAX_NOUNBR_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
