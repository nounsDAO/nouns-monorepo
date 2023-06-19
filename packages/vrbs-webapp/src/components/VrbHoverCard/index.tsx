import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { vrbQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { StandaloneVrbCircular } from '../StandaloneVrb';
import classes from './VrbHoverCard.module.css';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { isFounderVrb } from '../../utils/founderVrb';
import { useAppSelector } from '../../hooks';
import { i18n } from '@lingui/core';
import { getVrbBirthday } from '../InfoRowBirthday';
import clsx from 'clsx';

interface VrbHoverCardProps {
  vrbId: string;
}

const VrbHoverCard: React.FC<VrbHoverCardProps> = props => {
  const { vrbId } = props;

  const { loading, error, data } = useQuery(vrbQuery(vrbId), {
    skip: vrbId === null,
  });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !vrbId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  const numericVrbId = parseInt(vrbId);
  const vrbIdForQuery = isFounderVrb(BigNumber.from(vrbId))
    ? numericVrbId + 1
    : numericVrbId;
  const startTime = getVrbBirthday(vrbIdForQuery, pastAuctions);

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.vrbWrapper}>
          <StandaloneVrbCircular vrbId={BigNumber.from(vrbId)} />
        </div>
        <div>
          <h1>Vrb {vrbId}</h1>
        </div>
      </div>

      {/* Vrb birthday */}
      <div className={classes.vrbInfoWrapper}>
        <CakeIcon height={20} width={20} className={classes.icon} />
        <Trans>Born</Trans> <span className={classes.bold}>{i18n.date(birthday)}</span>
      </div>

      {/* Current holder */}
      <div className={clsx(classes.vrbInfoWrapper, classes.currentHolder)}>
        <HeartIcon height={20} width={20} className={classes.icon} />
        <span>
          <Trans>Held by</Trans>
        </span>
        <span className={classes.bold}>
          <ShortAddress address={data.vrb.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default VrbHoverCard;
