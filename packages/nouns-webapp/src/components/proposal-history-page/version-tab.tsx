import React, { useEffect } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import Link from 'next/link';

import { cn } from '@/lib/utils';

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
        className={cn(
          'rounded-[12px] border border-transparent bg-[#f2f2f5] p-[15px] text-left no-underline hover:border hover:border-[rgba(0,0,0,0.2)] hover:bg-[#e6e6eb]',
          props.isActive &&
            'border border-[rgba(0,0,0,0.4)] bg-white [&_h4]:text-[var(--brand-gray-dark-text)]',
        )}
        href={versionLink}
      >
        <h4>
          <Trans>Version</Trans> {props.versionNumber}
        </h4>
        <span>{updatedTimestamp !== null ? dayjs(updatedTimestamp).fromNow() : null}</span>
        {props.updateMessage !== '' && props.isActive === true && (
          <div className={'mt-[10px] border-t border-[#e6e6e6] pt-[10px]'}>
            <h5>Commit message</h5>
            <p className="font-pt m-0 p-0 text-[14px] font-normal text-[var(--brand-gray-light-text)]">
              {props.updateMessage}
            </p>
          </div>
        )}
      </Link>
    </>
  );
};

export default VersionTab;
