import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { n00unQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { StandaloneN00unCircular } from '../StandaloneN00un';
import classes from './N00unHoverCard.module.css';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { isN00underN00un } from '../../utils/n00underN00un';
import { useAppSelector } from '../../hooks';
import { i18n } from '@lingui/core';
import { getN00unBirthday } from '../N00unInfoRowBirthday';
import clsx from 'clsx';

interface N00unHoverCardProps {
  n00unId: string;
}

const N00unHoverCard: React.FC<N00unHoverCardProps> = props => {
  const { n00unId } = props;

  const { loading, error, data } = useQuery(n00unQuery(n00unId), {
    skip: n00unId === null,
  });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !n00unId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  const numericN00unId = parseInt(n00unId);
  const n00unIdForQuery = isN00underN00un(BigNumber.from(n00unId))
    ? numericN00unId + 1
    : numericN00unId;
  const startTime = getN00unBirthday(n00unIdForQuery, pastAuctions);

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.n00unWrapper}>
          <StandaloneN00unCircular n00unId={BigNumber.from(n00unId)} />
        </div>
        <div>
          <h1>N00un {n00unId}</h1>
        </div>
      </div>

      {/* N00un birthday */}
      <div className={classes.n00unInfoWrapper}>
        <CakeIcon height={20} width={20} className={classes.icon} />
        <Trans>Born</Trans> <span className={classes.bold}>{i18n.date(birthday)}</span>
      </div>

      {/* Current holder */}
      <div className={clsx(classes.n00unInfoWrapper, classes.currentHolder)}>
        <HeartIcon height={20} width={20} className={classes.icon} />
        <span>
          <Trans>Held by</Trans>
        </span>
        <span className={classes.bold}>
          <ShortAddress address={data.n00un.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default N00unHoverCard;
