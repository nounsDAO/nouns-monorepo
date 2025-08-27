import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';
import Link from 'next/link';

import ShortAddress from '@/components/short-address';
import { cn } from '@/lib/utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import {
  EscrowDeposit,
  EscrowWithdrawal,
  ForkCycleEvent,
  useProposalTitles,
} from '@/wrappers/nouns-dao';

type Props = {
  event?: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent;
  isOnlyEvent?: boolean;
};

const ForkEvent = ({ event, isOnlyEvent = false }: Props) => {
  const [actionLabel, setActionLabel] = useState('');
  const [nounCount, setNounCount] = useState('');
  const [nounsInEvent, setNounsInEvent] = useState<ReactNode[]>([]);
  const [ownerLink, setOwnerLink] = useState<ReactNode>();
  const handleEventTypes = useCallback(
    (event: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent) => {
      switch (event.eventType) {
        case 'ForkStarted':
          setActionLabel('Fork started');
          setNounCount('');
          setNounsInEvent([]);
          break;
        case 'ForkExecuted':
          setActionLabel('Fork executed. Forking period started');
          setNounCount('');
          setNounsInEvent([]);
          break;
        case 'ForkingEnded':
          setActionLabel('Forking period ended');
          setNounCount('');
          setNounsInEvent([]);
          break;
        case 'EscrowDeposit':
          setActionLabel('added');
          setNounCount(
            event.tokenIDs?.length > 1
              ? `${event.tokenIDs?.length} Nouns`
              : `Noun ${event.tokenIDs?.[0]}`,
          );
          setNounsInEvent(
            event.tokenIDs?.map((tokenId, i) => {
              return (
                <Link key={i} href={`/noun/${tokenId}`}>
                  <img
                    src={`https://noun.pics/${tokenId}`}
                    alt={`Noun ${tokenId}`}
                    className="aspect-square w-full max-w-[50px] rounded-[6px]"
                  />
                </Link>
              );
            }),
          );
          setOwnerLink(
            <a
              href={buildEtherscanAddressLink(event.owner.id || '')}
              target="_blank"
              rel="noreferrer"
              className="text-[#14161b] no-underline hover:underline"
            >
              <ShortAddress address={event.owner.id || ''} avatar={false} />
            </a>,
          );
          break;
        case 'ForkJoin':
          setActionLabel('joined with');
          setNounCount(
            event.tokenIDs?.length > 1
              ? `${event.tokenIDs?.length} Nouns`
              : `Noun ${event.tokenIDs?.[0]}`,
          );
          setNounsInEvent(
            event.tokenIDs?.map((tokenId, i) => {
              return (
                <Link key={i} href={`/noun/${tokenId}`}>
                  <img
                    src={`https://noun.pics/${tokenId}`}
                    alt={`Noun ${tokenId}`}
                    className="aspect-square w-full max-w-[50px] rounded-[6px]"
                  />
                </Link>
              );
            }),
          );
          setOwnerLink(
            <a
              href={buildEtherscanAddressLink(event.owner.id || '')}
              target="_blank"
              rel="noreferrer"
              className="text-[#14161b] no-underline hover:underline"
            >
              <ShortAddress address={event.owner.id || ''} avatar={false} />
            </a>,
          );
          break;
        case 'EscrowWithdrawal':
          setActionLabel('removed');
          setNounCount(
            event.tokenIDs?.length > 1
              ? `${event.tokenIDs?.length} Nouns`
              : `Noun ${event.tokenIDs?.[0]}`,
          );
          setNounsInEvent(
            event.tokenIDs?.map((tokenId, i) => {
              return (
                <Link key={i} href={`/noun/${tokenId}`}>
                  <img
                    src={`https://noun.pics/${tokenId}`}
                    alt={`Noun ${tokenId}`}
                    className="aspect-square w-full max-w-[50px] rounded-[6px]"
                  />
                </Link>
              );
            }),
          );
          setOwnerLink(
            <a
              href={buildEtherscanAddressLink(event.owner.id || '')}
              target="_blank"
              rel="noreferrer"
              className="text-[#14161b] no-underline hover:underline"
            >
              <ShortAddress address={event.owner.id || ''} avatar={false} />
            </a>,
          );
          break;
      }
    },
    [],
  );

  useEffect(() => {
    if (event) handleEventTypes(event);
  }, [event, handleEventTypes]);

  const proposalIds =
    event && (event.eventType === 'EscrowDeposit' || event.eventType === 'ForkJoin')
      ? event.proposalIDs
      : [];
  const proposalsTitles = useProposalTitles(proposalIds);

  if (!event) return null;

  const isCycleEvent =
    event.eventType === 'ForkStarted' ||
    event.eventType === 'ForkExecuted' ||
    event.eventType === 'ForkingEnded';
  const timestamp = event.createdAt !== null && dayjs(Number(event.createdAt) * 1000).fromNow();
  const dateTime =
    event.createdAt !== null &&
    dayjs(Number(event.createdAt) * 1000).format('MMMM D, YYYY, h:mm A');
  const proposalsList = proposalsTitles?.map((proposal, i) => {
    return (
      <li key={i}>
        <Link href={`/vote/${proposal.id}`}>
          <strong>{proposal.id}</strong> {proposal.title}
        </Link>
      </li>
    );
  });

  if (event.createdAt === null) return null;

  return (
    <div className={cn('group relative m-0 pb-[50px] pl-[40px]', isOnlyEvent && '')} id={event.id}>
      <span aria-hidden className="absolute bottom-0 left-[6px] top-[3px] w-[3px] bg-[#b3b3b3]" />
      <a href={`#${event.id}`} className="absolute -left-[7px] -top-[2px] block size-[30px]">
        <span className="absolute inset-0 rounded-full border-[3px] border-[#B3B3B3] bg-white" />
        <span className="absolute inset-0 rounded-full border-[3px] border-[#14161b] bg-white opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-50" />
      </a>
      <header>
        <span className="font-londrina text-[#14161b]">
          <a
            href={`#${event.id}`}
            className="no-underline transition-all duration-200 ease-in-out group-hover:opacity-100"
          >
            {timestamp ?? ''}
            <span className="font-pt ml-2 text-[13px] opacity-0 transition-opacity duration-200 ease-in-out group-hover:inline-block group-hover:opacity-50">
              {dateTime ?? ''}
            </span>
          </a>
        </span>
        <h3 className="m-0 text-[20px] font-bold leading-[1.1]">
          {isCycleEvent ? (
            actionLabel
          ) : (
            <>
              {ownerLink} {actionLabel} {nounCount}
            </>
          )}
        </h3>
        {(event.eventType === 'EscrowDeposit' || event.eventType === 'ForkJoin') &&
          event.reason && (
            <p className="mx-0 my-1 p-0 text-[18px] italic opacity-80 before:ml-[-6px] before:content-['“'] after:content-['”']">
              {event.reason}
            </p>
          )}
        <div className="mt-[14px] flex flex-row flex-wrap gap-[10px]">{nounsInEvent}</div>
        {(event.eventType === 'EscrowDeposit' || event.eventType === 'ForkJoin') &&
          proposalsList &&
          proposalsList.length > 0 && (
            <div className="mt-5 list-none border-t border-[#e6e6e6] pt-[10px]">
              <p className="m-0 p-0 text-[14px] font-bold opacity-80">
                <Trans>Offending proposal{proposalsList.length === 1 ? '' : 's'}</Trans>
              </p>
              <ul>{proposalsList}</ul>
            </div>
          )}
      </header>
    </div>
  );
};

export default ForkEvent;
export { ForkEvent };
