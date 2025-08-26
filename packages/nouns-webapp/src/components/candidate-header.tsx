import React from 'react';

import { Trans } from '@lingui/react/macro';
import { useBlockNumber } from 'wagmi';

import ByLineHoverCard from '@/components/by-line-hover-card';
import HoverCard from '@/components/hover-card';
import { transactionIconLink } from '@/components/proposal-content';
import ShortAddress from '@/components/short-address';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { Locales } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { isMobileScreen } from '@/utils/is-mobile';
import { relativeTimestamp } from '@/utils/time-utils';
import { useUserVotesAsOfBlock } from '@/wrappers/noun-token';
import { Link } from 'react-router';

interface CandidateHeaderProps {
  title: string;
  id: string;
  proposer: string;
  versionsCount: number;
  createdTransactionHash: string;
  lastUpdatedTimestamp: number;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  isCandidate?: boolean;
  isUpdateToProposal?: boolean;
  submitButtonClickHandler: () => void;
}

const CandidateHeader: React.FC<CandidateHeaderProps> = props => {
  const {
    title,
    id,
    proposer,
    versionsCount,
    createdTransactionHash,
    lastUpdatedTimestamp,
    isActiveForVoting,
    isWalletConnected,
    isUpdateToProposal,
  } = props;
  const isMobile = isMobileScreen();
  const { data: currentBlock } = useBlockNumber();
  const availableVotes = useUserVotesAsOfBlock(Number(currentBlock)) ?? 0;
  const activeLocale = useActiveLocale();

  const voteButton = (
    <>
      {isWalletConnected ? (
        <>
          {!availableVotes && (
            <div
              className={
                'font-pt mb-[1.15rem] min-w-[9.5rem] text-[16px] font-medium text-[var(--brand-gray-light-text)]'
              }
            >
              <Trans>You have no votes.</Trans>
            </div>
          )}
        </>
      ) : (
        <div
          className={
            'font-pt mb-[1.15rem] min-w-48 text-[16px] font-medium text-[var(--brand-gray-light-text)]'
          }
        >
          <Trans>Connect a wallet to vote.</Trans>
        </div>
      )}
    </>
  );

  const proposerLink = (
    <a
      href={buildEtherscanAddressLink(proposer || '')}
      target="_blank"
      rel="noreferrer"
      className={'mr-1'}
    >
      <ShortAddress address={(proposer as `0x${string}`) || '0x'} avatar={false} />
    </a>
  );

  const subHead = (
    <>{isUpdateToProposal === true ? <strong>Update</strong> : ''} Proposal Candidate</>
  );
  const transactionLink = transactionIconLink(createdTransactionHash);
  return (
    <>
      <div className={'relative'}>
        <Link to={props.isCandidate === true ? '/vote#candidates' : '/vote'}>
          <button
            type="button"
            className={cn(
              'absolute -left-12 mr-4 mt-[0.1rem] inline-block size-8 appearance-none rounded-full p-0 font-bold',
              'border border-black/10 bg-white text-[rgb(95,95,95)] hover:bg-[#e2e3e8] hover:text-black',
              'max-[1040px]:relative max-[1040px]:left-0 max-[414px]:hidden',
            )}
          >
            ←
          </button>
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <div>
            <span className="font-londrina text-[24px] text-[#8c8d92]">
              <div className="d-flex">
                <div>{subHead}</div>
              </div>
            </span>
            <div className={'flex pr-8'}>
              <div className={'mr-2'}>
                <h1 className="font-londrina text-[42px] text-[#14161b]">{title} </h1>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex justify-content-end align-items-end">
            {isActiveForVoting === true && voteButton}
          </div>
        )}
      </div>

      <div className={'flex flex-row'}>
        {activeLocale === Locales.ja_JP ? (
          <HoverCard
            hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
            tip={proposer || ''}
            id="byLineHoverCard"
          >
            <div className={'ml-10 font-medium'}>
              <Trans>
                <span className={'text-[var(--brand-gray-light-text)]'}>Proposed by: </span>
                <span>{proposerLink}</span>
                {transactionLink}
              </Trans>
            </div>
          </HoverCard>
        ) : (
          <>
            <h3 className={'font-londrina text-[18px] text-[var(--brand-gray-light-text)]'}>
              Proposed by
            </h3>

            <div className={'ml-0 flex flex-row'}>
              <HoverCard
                hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
                tip={proposer || ''}
                id="byLineHoverCard"
              >
                <h3 className={'font-londrina text-[18px] text-[var(--brand-gray-light-text)]'}>
                  {proposerLink}
                  {transactionLink}
                </h3>
              </HoverCard>
            </div>
          </>
        )}
      </div>

      <p className={'inline-block text-[12px]'}>
        {versionsCount > 1 ? (
          <Link to={`/candidates/${id}/history/`}>
            <strong className={'mr-[5px] rounded-[6px] border border-[#e6e6e6] px-[10px] py-[6px]'}>
              Version {versionsCount}
            </strong>{' '}
            <span className={'opacity-70'}>
              {versionsCount === 1 ? 'created' : 'updated'}{' '}
              {relativeTimestamp(lastUpdatedTimestamp)}
            </span>
          </Link>
        ) : (
          <>
            <strong className={'mr-[5px] rounded-[6px] border border-[#e6e6e6] px-[10px] py-[6px]'}>
              Version {versionsCount}
            </strong>{' '}
            <span className={'opacity-70'}>
              {versionsCount === 1 ? 'created' : 'updated'}{' '}
              {relativeTimestamp(lastUpdatedTimestamp)}
            </span>
          </>
        )}
      </p>

      {isMobile && <div className={'px-12'}>{isActiveForVoting === true && voteButton}</div>}
    </>
  );
};

export default CandidateHeader;
