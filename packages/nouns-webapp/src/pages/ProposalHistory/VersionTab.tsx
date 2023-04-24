import React from 'react';
import { useEffect } from 'react';
import classes from './Vote.module.css';
import clsx from 'clsx';
import { useBlockNumber } from '@usedapp/core';
import { AVERAGE_BLOCK_TIME_IN_SECS } from '../../utils/constants';
import dayjs from 'dayjs';
import { timestampFromBlockNumber } from '../../utils/timeUtils';

type Props = {
  versionNumber: number;
  isActive: boolean;
  setActiveVersion: Function;
  version: {
    updatedBlock: number;
    updateMessage: string;
  };
};

const VersionTab = (props: Props) => {
  const [updatedTimestamp, setUpdatedTimestamp] = React.useState<Date | null>(null);
  const currentBlock = useBlockNumber();
  useEffect(() => {
    if (currentBlock) {
      const timestamp = timestampFromBlockNumber(props.version.updatedBlock, currentBlock);
      setUpdatedTimestamp(timestamp.toDate());
    }
  }, [currentBlock]);

  return (
    <button
      className={clsx(classes.version, props.isActive && classes.activeVersion)}
      onClick={() => {
        props.setActiveVersion(props.versionNumber);
      }}
    >
      <h4>Version {props.versionNumber}</h4>
      <span>{updatedTimestamp && dayjs(updatedTimestamp).fromNow()}</span>

      {props.version.updateMessage && props.isActive && (
        <div className={classes.message}>
          <h5>Commit message</h5>
          <p>{props.version.updateMessage}</p>
        </div>
      )}
    </button>
  );
};

export default VersionTab;
