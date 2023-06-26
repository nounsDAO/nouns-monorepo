import { useQuery } from '@apollo/client';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { currentlyDelegatedTokens } from '../../wrappers/subgraph';
import HorizontalStackedTokens from '../HorizontalStackedTokens';
import ShortAddress from '../ShortAddress';
import classes from './ByLineHoverCard.module.css';
import { ScaleIcon } from '@heroicons/react/solid';

interface ByLineHoverCardProps {
  proposerAddress: string;
}

const MAX_NOUN_IDS_SHOWN = 12;

const ByLineHoverCard: React.FC<ByLineHoverCardProps> = props => {
  const { proposerAddress } = props;

  const { data, loading, error } = useQuery(currentlyDelegatedTokens(proposerAddress));

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

  const sortedTokenIds = data.delegates[0].nRepresented
    .map((noun: { id: string }) => {
      return parseInt(noun.id);
    })
    .sort((a: number, b: number) => {
      return a - b;
    });

  return (
    <div className={classes.wrapper}>
      <div className={classes.stackedNounWrapper}>
        <HorizontalStackedTokens
          tokenIds={data.delegates[0].nRepresented.map((token: { id: string }) => token.id)}
        />
      </div>

      <div className={classes.address}>
        <ShortAddress address={data ? data.delegates[0].id : ''} />
      </div>

      <div className={classes.nRepresented}>
        <div>
          <ScaleIcon height={15} width={15} className={classes.icon} />
          {sortedTokenIds.length === 1 ? (
            <Trans>
              <span>Delegated Punk: </span>
            </Trans>
          ) : (
            <Trans>
              <span>Delegated Punks: </span>
            </Trans>
          )}

          {sortedTokenIds.slice(0, MAX_NOUN_IDS_SHOWN).map((tokenId: number, i: number) => {
            return (
              <span className={classes.bold} key={tokenId.toString()}>
                {tokenId}
                {i !== Math.min(MAX_NOUN_IDS_SHOWN, sortedTokenIds.length) - 1 && ', '}{' '}
              </span>
            );
          })}
          {sortedTokenIds.length > MAX_NOUN_IDS_SHOWN && (
            <span>
              <Trans>... and {sortedTokenIds.length - MAX_NOUN_IDS_SHOWN} more</Trans>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ByLineHoverCard;
