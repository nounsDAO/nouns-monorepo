import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { nounbrQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { StandaloneNounBRCircular } from '../StandaloneNounBR';
import classes from './NounBRHoverCard.module.css';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { isNounderBRNounBR } from '../../utils/nounderbrNounBR';
import { useAppSelector } from '../../hooks';
import { i18n } from '@lingui/core';
import { getNounBRBirthday } from '../NounBRInfoRowBirthday';
import clsx from 'clsx';

interface NounBRHoverCardProps {
  nounbrId: string;
}

const NounBRHoverCard: React.FC<NounBRHoverCardProps> = props => {
  const { nounbrId } = props;

  const { loading, error, data } = useQuery(nounbrQuery(nounbrId), {
    skip: nounbrId === null,
  });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !nounbrId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }
  const numericNounBRId = parseInt(nounbrId);
  const nounbrIdForQuery = isNounderBRNounBR(BigNumber.from(nounbrId)) ? numericNounBRId + 1 : numericNounBRId;
  const startTime = getNounBRBirthday(nounbrIdForQuery, pastAuctions);

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime._hex) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.nounbrWrapper}>
          <StandaloneNounBRCircular nounbrId={BigNumber.from(nounbrId)} />
        </div>
        <div>
          <h1>NounBR {nounbrId}</h1>
        </div>
      </div>

      {/* NounBR birthday */}
      <div className={classes.nounbrInfoWrapper}>
        <CakeIcon height={20} width={20} className={classes.icon} />
        <Trans>Born</Trans> <span className={classes.bold}>{i18n.date(birthday)}</span>
      </div>

      {/* Current holder */}
      <div className={clsx(classes.nounbrInfoWrapper, classes.currentHolder)}>
        <HeartIcon height={20} width={20} className={classes.icon} />
        <span>
          <Trans>Held by</Trans>
        </span>
        <span className={classes.bold}>
          <ShortAddress address={data.nounbr.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default NounBRHoverCard;
