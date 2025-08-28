import React, { Fragment, useEffect, useMemo } from 'react';

import { i18n } from '@lingui/core';
import { Trans } from '@lingui/react/macro';
import Link from 'next/link';
import { Alert, Button } from 'react-bootstrap';
import { isNullish } from 'remeda';
import { useBlockNumber } from 'wagmi';

import ByLineHoverCard from '@/components/by-line-hover-card';
import HoverCard from '@/components/hover-card';
import { transactionIconLink } from '@/components/proposal-content';
import ProposalStatus from '@/components/proposal-status';
import ShortAddress from '@/components/short-address';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { useBlockTimestamp } from '@/hooks/use-block-timestamp';
import { Locales } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { isMobileScreen } from '@/utils/is-mobile';
import { relativeTimestamp } from '@/utils/time-utils';
import { useUserVotesAsOfBlock } from '@/wrappers/noun-token';
import {
  Proposal,
  ProposalVersion,
  useHasVotedOnProposal,
  useIsDaoGteV3,
  useProposalVote,
} from '@/wrappers/nouns-dao';

interface ProposalHeaderProps {
  title?: string;
  proposal: Proposal;
  proposalVersions?: ProposalVersion[];
  versionNumber?: bigint;
  isActiveForVoting?: boolean;
  isWalletConnected: boolean;
  isObjectionPeriod?: boolean;
  submitButtonClickHandler: () => void;
}

const getTranslatedVoteCopyFromString = (proposalVote: string) => {
  if (proposalVote === 'For') {
    return (
      <Trans>
        You voted <strong>For</strong> this proposal
      </Trans>
    );
  }
  if (proposalVote === 'Against') {
    return (
      <Trans>
        You voted <strong>Against</strong> this proposal
      </Trans>
    );
  }
  return (
    <Trans>
      You <strong>Abstained</strong> from this proposal
    </Trans>
  );
};

const ProposalHeader: React.FC<ProposalHeaderProps> = props => {
  const { proposal, isActiveForVoting, isWalletConnected, title, submitButtonClickHandler } = props;
  const [updatedTimestamp, setUpdatedTimestamp] = React.useState<bigint | null>(null);
  const [createdTimestamp, setCreatedTimestamp] = React.useState<bigint | null>(null);
  const isMobile = isMobileScreen();
  const { data: currentBlock } = useBlockNumber();
  const currentOrSnapshotBlock = useMemo(() => {
    const blockNumber =
      !isNullish(currentBlock) && Number.isFinite(Number(currentBlock))
        ? Number(currentBlock) - 1
        : 0;
    const snapshotBlock = Number(proposal?.voteSnapshotBlock ?? 0n);
    const minVal = Math.min(snapshotBlock, blockNumber);
    if (!Number.isFinite(minVal) || Number.isNaN(minVal) || minVal === 0) {
      return undefined;
    }
    return minVal;
  }, [currentBlock, proposal?.voteSnapshotBlock]);
  const availableVotes = useUserVotesAsOfBlock(currentOrSnapshotBlock) ?? 0;
  const hasVoted = useHasVotedOnProposal(BigInt(proposal?.id ?? 0n));
  const proposalVote = useProposalVote(BigInt(proposal?.id ?? 0n));
  const proposalCreationTimestamp = useBlockTimestamp(proposal?.createdBlock);
  const disableVoteButton =
    isWalletConnected === false || availableVotes === 0 || hasVoted === true;
  const activeLocale = useActiveLocale();
  const hasManyVersions = Array.isArray(props.proposalVersions)
    ? props.proposalVersions.length > 1
    : false;
  const isDaoGteV3 = useIsDaoGteV3();
  useEffect(() => {
    const latestProposalVersion = props.proposalVersions?.[props.proposalVersions.length - 1];
    if (hasManyVersions === true && latestProposalVersion != null) {
      setUpdatedTimestamp(latestProposalVersion?.createdAt);
    } else {
      setCreatedTimestamp(props.proposal.createdTimestamp);
    }
  }, [currentBlock, hasManyVersions, props.proposalVersions, props.proposal]);

  const voteButton = (
    <>
      {isWalletConnected ? (
        <>
          {!availableVotes && (
            <div
              className={
                'font-pt text-brand-gray-light-text mb-[1.15rem] min-w-[9.5rem] text-[16px] font-medium'
              }
            >
              <Trans>You have no votes.</Trans>
            </div>
          )}
        </>
      ) : (
        <div
          className={
            'font-pt text-brand-gray-light-text mb-[1.15rem] min-w-48 text-[16px] font-medium'
          }
        >
          <Trans>Connect a wallet to vote.</Trans>
        </div>
      )}
      <Button
        className={cn(
          disableVoteButton
            ? 'rounded-12 border-brand-dark-red bg-brand-gray-light-text mb-2 h-12 w-full min-w-32 max-w-32 cursor-not-allowed border font-bold opacity-50 shadow-none'
            : 'rounded-12 border-brand-color-green bg-brand-color-green hover:bg-brand-color-green hover:shadow-brand-focus-green focus:bg-brand-color-green focus:shadow-brand-focus-green mb-2 h-12 w-full min-w-32 max-w-32 border font-bold',
          'max-lg:max-w-full',
        )}
        disabled={disableVoteButton}
        onClick={submitButtonClickHandler}
      >
        <Trans>Submit vote</Trans>
      </Button>
    </>
  );

  const proposer = (
    <a
      href={buildEtherscanAddressLink(proposal.proposer || '')}
      target="_blank"
      rel="noreferrer"
      className={'mr-1'}
    >
      <ShortAddress
        address={proposal.proposer || '0x0000000000000000000000000000000000000000'}
        avatar={false}
      />
    </a>
  );

  const sponsorLink = (sponsor: string) => {
    return (
      <a
        href={buildEtherscanAddressLink(sponsor)}
        target="_blank"
        rel="noreferrer"
        className={'mr-1'}
      >
        <ShortAddress address={sponsor as `0x${string}`} avatar={false} />
      </a>
    );
  };
  const transactionLink = transactionIconLink(proposal.transactionHash);

  return (
    <>
      <div className={'relative'}>
        <Link href={'/vote'}>
          <button
            type="button"
            className={cn(
              'absolute -left-12 mr-4 mt-[0.1rem] inline-block size-8 appearance-none rounded-full p-0 font-bold',
              'text-brand-text-muted-700 hover:bg-brand-surface-muted border border-black/10 bg-white hover:text-black',
              'max-lg:relative max-lg:left-0 max-xs:hidden',
            )}
          >
            ←
          </button>
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-start">
          <div>
            <span className="font-londrina text-brand-gray-light-text text-[24px]">
              <div className="d-flex">
                <div>
                  <Trans>Proposal {i18n.number(Number(proposal.id || '0'))}</Trans>
                </div>
                <div>
                  <ProposalStatus status={proposal?.status} className={'ml-3 mt-[0.1rem]'} />
                </div>
              </div>
            </span>
            <div className={'flex pr-8'}>
              <div className={'mr-2'}>
                <h1 className="font-londrina text-brand-gray-dark-text text-[42px]">
                  {title ? title : proposal.title}{' '}
                </h1>
              </div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="d-flex justify-content-end align-items-end">
            {isActiveForVoting === true && props.isObjectionPeriod !== true && voteButton}
          </div>
        )}
      </div>

      <div className={'flex flex-row'}>
        {activeLocale === Locales.ja_JP ? (
          <>
            <HoverCard
              hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
              tip={proposal?.proposer ?? ''}
              id="byLineHoverCard"
            >
              <div className={'ml-10 font-medium'}>
                <Trans>
                  <span className={'text-brand-gray-light-text'}>Proposed by: </span>
                  <span>{proposer}</span>
                  <span className={'relative top-[-3px]'}>{transactionLink}</span>
                </Trans>
              </div>
            </HoverCard>
            {props.proposal.signers.length > 0 && (
              <div className={'ml-2 flex flex-row gap-[5px]'}>
                <h3>
                  <span className={'text-brand-gray-light-text'}>
                    <Trans>Sponsored by</Trans>
                  </span>
                </h3>{' '}
                {props.proposal.signers.map((signer: { id: string }) => {
                  return (
                    <Fragment key={signer.id}>
                      <HoverCard
                        hoverCardContent={(tip: string) => (
                          <ByLineHoverCard proposerAddress={tip} />
                        )}
                        tip={signer.id ? signer.id : ''}
                        id="byLineHoverCard"
                      >
                        <h3>{sponsorLink(signer.id)}</h3>
                      </HoverCard>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className={'font-londrina text-brand-gray-light-text text-[18px]'}>Proposed by</h3>
            <div className={'ml-0 flex flex-row'}>
              <HoverCard
                hoverCardContent={(tip: string) => <ByLineHoverCard proposerAddress={tip} />}
                tip={proposal?.proposer ?? ''}
                id="byLineHoverCard"
              >
                <h3 className={'font-londrina text-brand-gray-light-text text-[18px]'}>
                  {proposer}
                </h3>
              </HoverCard>
            </div>
            <span className={'my-auto'}>{transactionLink}</span>

            {props.proposal.signers.length > 0 && (
              <div className={'ml-2 flex flex-row gap-[5px]'}>
                <h3>
                  <span className={'text-brand-gray-light-text'}>Sponsored by</span>
                </h3>{' '}
                {props.proposal.signers.map((signer: { id: string }) => {
                  return (
                    <Fragment key={signer.id}>
                      <HoverCard
                        hoverCardContent={(tip: string) => (
                          <ByLineHoverCard proposerAddress={tip} />
                        )}
                        tip={signer.id ? signer.id : ''}
                        id="byLineHoverCard"
                      >
                        <h3>{sponsorLink(signer.id)}</h3>
                      </HoverCard>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      {isDaoGteV3 && (
        <p className={'inline-block text-[12px]'}>
          {hasManyVersions ? (
            <Link href={`/vote/${proposal.id}/history/`}>
              <strong
                className={
                  'border-brand-border-light mr-[5px] rounded-md border px-[10px] py-[6px]'
                }
              >
                Version {hasManyVersions ? props?.versionNumber?.toString() : '1'}
              </strong>{' '}
              <span className={'opacity-70'}>
                updated{' '}
                {updatedTimestamp !== null ? relativeTimestamp(Number(updatedTimestamp)) : null}
              </span>
            </Link>
          ) : (
            <>
              <strong
                className={
                  'border-brand-border-light mr-[5px] rounded-md border px-[10px] py-[6px]'
                }
              >
                Version {hasManyVersions ? props?.versionNumber?.toString() : '1'}
              </strong>{' '}
              <span className={'opacity-70'}>
                created{' '}
                {createdTimestamp !== null ? relativeTimestamp(Number(createdTimestamp)) : null}
              </span>
            </>
          )}
        </p>
      )}

      {isMobile && (
        <div className={'px-12'}>
          {isActiveForVoting === true && props.isObjectionPeriod !== true && voteButton}
        </div>
      )}

      {proposal != null && isActiveForVoting === true && hasVoted === true && (
        <Alert
          variant="success"
          className={
            'font-pt bg-brand-surface-muted mt-2 border border-black/10 font-medium text-black'
          }
        >
          {getTranslatedVoteCopyFromString(proposalVote)}
        </Alert>
      )}

      {proposal != null &&
        isActiveForVoting === true &&
        proposalCreationTimestamp != null &&
        Number.isFinite(proposalCreationTimestamp) &&
        availableVotes > 0 &&
        hasVoted !== true && (
          <Alert
            variant="success"
            className={
              'font-pt bg-brand-surface-muted mt-2 border border-black/10 font-medium text-black'
            }
          >
            <Trans>
              Only Nouns you owned or were delegated to you before{' '}
              {i18n.date(new Date(proposalCreationTimestamp * 1000), {
                dateStyle: 'long',
                timeStyle: 'long',
              })}{' '}
              are eligible to vote.
            </Trans>
          </Alert>
        )}
    </>
  );
};

export default ProposalHeader;
