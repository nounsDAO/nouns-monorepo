import React from 'react';
import { useEffect } from 'react';
import classes from './Vote.module.css';
import clsx from 'clsx';
import { useBlockNumber } from '@usedapp/core';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';

type Props = {
  isActive: boolean;
  setActiveVersion: Function;
  id: string; // slug for candidate
  createdAt: number;
  versionNumber: number;
  updateMessage: string;
  isCandidate?: boolean;
};

const VersionTab = (props: Props) => {
  const [updatedTimestamp, setUpdatedTimestamp] = React.useState<Date | null>(null);
  const currentBlock = useBlockNumber();

  useEffect(() => {
    if (currentBlock) {
      const date = new Date(+props.createdAt * 1000);
      setUpdatedTimestamp(date);
    }
  }, [currentBlock, props.createdAt]);

  const versionLink = props.isCandidate
    ? `/candidates/${props.id}/history/${props.versionNumber}`
    : `/vote/${props.id}/history/${props.versionNumber}`;

  return (
    <>
      <Link
        className={clsx(classes.version, props.isActive && classes.activeVersion)}
        to={versionLink}
      >
        <h4>
          <Trans>Version</Trans> {props.versionNumber}
        </h4>
        <span>{updatedTimestamp && dayjs(updatedTimestamp).fromNow()}</span>
        {props.updateMessage && props.isActive && (
          <div className={classes.message}>
            <h5>Commit message</h5>
            <p>{props.updateMessage}</p>
          </div>
        )}
      </Link>
    </>
  );
};

export default VersionTab;
