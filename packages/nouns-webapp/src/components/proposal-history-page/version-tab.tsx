import React, { useEffect } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { Link } from 'react-router';

import classes from './vote.module.css';

type Props = {
  isActive: boolean;
  setActiveVersion: (version: number) => void;
  id: string; // slug for candidate
  createdAt: number;
  versionNumber: number;
  updateMessage: string;
  isCandidate?: boolean;
};

const VersionTab = (props: Props) => {
  const [updatedTimestamp, setUpdatedTimestamp] = React.useState<Date | null>(null);

  useEffect(() => {
    // Compute once from props; no dependency on wagmi hooks to avoid SSR provider issues
    const date = new Date(+props.createdAt * 1000);
    setUpdatedTimestamp(date);
  }, [props.createdAt]);

  const versionLink =
    props.isCandidate === true
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
        <span>{updatedTimestamp !== null ? dayjs(updatedTimestamp).fromNow() : null}</span>
        {props.updateMessage !== '' && props.isActive === true && (
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
