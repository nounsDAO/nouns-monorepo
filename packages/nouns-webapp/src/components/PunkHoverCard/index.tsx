import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { nQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { StandaloneTokenCircular } from '../StandaloneToken';
import classes from './NounHoverCard.module.css';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { isNounderNoun } from '../../utils/nounderNoun';
import { useAppSelector } from '../../hooks';
import { i18n } from '@lingui/core';
import { getNounBirthday } from '../PunkInfoRowBirthday';
import clsx from 'clsx';

interface NounHoverCardProps {
  tokenId: string;
}

const NounHoverCard: React.FC<NounHoverCardProps> = props => {
  const { tokenId } = props;

  const { loading, error, data } = useQuery(nQuery(tokenId), {
    skip: tokenId === null,
  });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !tokenId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  const numericTokenId = parseInt(tokenId);
  const tokenIdForQuery = isNounderNoun(BigNumber.from(tokenId)) ? numericTokenId + 1 : numericTokenId;
  const startTime = getNounBirthday(tokenIdForQuery, pastAuctions);

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.nounWrapper}>
          <StandaloneTokenCircular tokenId={BigNumber.from(tokenId)} />
        </div>
        <div>
          <h1>Noun {tokenId}</h1>
        </div>
      </div>

      {/* Noun birthday */}
      <div className={classes.nounInfoWrapper}>
        <CakeIcon height={20} width={20} className={classes.icon} />
        <Trans>Born</Trans> <span className={classes.bold}>{i18n.date(birthday)}</span>
      </div>

      {/* Current holder */}
      <div className={clsx(classes.nounInfoWrapper, classes.currentHolder)}>
        <HeartIcon height={20} width={20} className={classes.icon} />
        <span>
          <Trans>Held by</Trans>
        </span>
        <span className={classes.bold}>
          <ShortAddress address={data.punk.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default NounHoverCard;
