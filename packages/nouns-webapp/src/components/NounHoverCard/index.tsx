import React from 'react';

import { useQuery } from '@apollo/client';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

import { getNounBirthday } from '@/components/NounInfoRowBirthday';
import ShortAddress from '@/components/ShortAddress';
import { StandaloneNounCircular } from '@/components/StandaloneNoun';
import { useAppSelector } from '@/hooks';
import { isNounderNoun } from '@/utils/nounderNoun';
import { nounQuery } from '@/wrappers/subgraph';

import classes from './NounHoverCard.module.css';

interface NounHoverCardProps {
  nounId: string;
}

const NounHoverCard: React.FC<NounHoverCardProps> = props => {
  const { nounId } = props;

  const { loading, error, data } = useQuery(nounQuery(nounId), {
    skip: nounId == null,
  });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !nounId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  const numericNounId = Number(nounId);
  const nounIdForQuery = isNounderNoun(BigInt(nounId)) ? numericNounId + 1 : numericNounId;
  const startTime = getNounBirthday(BigInt(nounIdForQuery), pastAuctions);

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.nounWrapper}>
          <StandaloneNounCircular nounId={BigInt(nounId)} />
        </div>
        <div>
          <h1>Noun {nounId}</h1>
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
          <ShortAddress address={data.noun.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default NounHoverCard;
