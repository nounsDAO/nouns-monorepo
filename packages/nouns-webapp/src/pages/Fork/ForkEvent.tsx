import { useCallback, useEffect, useState } from 'react'
import classes from './Fork.module.css';
import { EscrowDeposit, EscrowWithdrawal, useProposalTitles, ForkCycleEvent, ProposalTitle } from '../../wrappers/nounsDao'
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import ShortAddress from '../../components/ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';
import clsx from 'clsx';

type Props = {
  event: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent
  isOnlyEvent: boolean;
}

const ForkEvent = ({ event, isOnlyEvent }: Props) => {
  const [actionLabel, setActionLabel] = useState('');
  const [nounCount, setNounCount] = useState('');
  // const [timestamp, setTimestamp] = useState('');
  // const [proposalsList, setProposalsList] = useState<ProposalTitle[]>([]);
  const [nounsInEvent, setNounsInEvent] = useState<JSX.Element[]>([]);
  const [ownerLink, setOwnerLink] = useState<JSX.Element>();
  const handleEventTypes = useCallback((event: EscrowDeposit | EscrowWithdrawal | ForkCycleEvent) => {
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
      case 'EscrowDeposit' || 'EscrowWithdrawal':
        setActionLabel('added');
        setNounCount(event.tokenIDs?.length > 1 ? `${event.tokenIDs?.length} Nouns` : `Noun ${event.tokenIDs?.[0]}`);
        setNounsInEvent(event.tokenIDs?.map((tokenId, i) => {
          return (
            <Link key={i} to={`/noun/${tokenId}`}>
              <img src={`https://noun.pics/${tokenId}`} alt={`Noun ${tokenId}`} className={classes.nounImage} />
            </Link>
          )
        }));
        setOwnerLink(
          <a
            href={buildEtherscanAddressLink(event.owner.id || '')}
            target="_blank"
            rel="noreferrer"
            className={classes.proposerLinkJp}
          >
            <ShortAddress address={event.owner.id || ''} avatar={false} />
          </a>
        )
        break;
      case 'EscrowWithdrawal':
        setActionLabel('removed');
        // setNounCount(event.tokenIDs?.length > 1 ? `${event.tokenIDs?.length} Nouns` : `Noun ${event.tokenIDs?.[0]}`);
        // setNounsInEvent(event.tokenIDs?.map((tokenId, i) => {
        //   return (
        //     <Link key={i} to={`/noun/${tokenId}`}>
        //       <img src={`https://noun.pics/${tokenId}`} alt={`Noun ${tokenId}`} className={classes.nounImage} />
        //     </Link>
        //   )
        // }));
        break;
    }
  }, []);

  useEffect(() => {
    handleEventTypes(event);
  }, [event, handleEventTypes]);


  const isCycleEvent = event.eventType === 'ForkStarted' || event.eventType === "ForkExecuted" || event.eventType === 'ForkingEnded';
  // const actionLabel = event.eventType === 'EscrowDeposit' ? 'added' : 'removed';
  // const nounCount = event.eventType === 'EscrowDeposit' || event.eventType === 'EscrowWithdrawal' && event.tokenIDs?.length > 1 ? `${event.tokenIDs?.length} Nouns` : `Noun ${event.tokenIDs?.[0]}`;
  const timestamp = event.createdAt && dayjs(+event.createdAt * 1000).fromNow()
  const proposalsTitles = useProposalTitles(event.eventType === "EscrowDeposit" ? event.proposalIDs : []);
  // const nounsInEvent = event.tokenIDs?.map((tokenId, i) => {
  //   return (
  //     <Link key={i} to={`/noun/${tokenId}`}>
  //       <img src={`https://noun.pics/${tokenId}`} alt={`Noun ${tokenId}`} className={classes.nounImage} />
  //     </Link>
  //   )
  // });
  const proposalsList = proposalsTitles?.map((proposal, i) => {
    return (
      <li key={i}>
        <Link to={`/vote/${proposal.id}`}>
          <strong>{proposal.id}</strong> {proposal.title}
        </Link>
      </li>
    )
  });
  // const ownerLink = (
  //   <a
  //     href={buildEtherscanAddressLink(event.owner.id || '')}
  //     target="_blank"
  //     rel="noreferrer"
  //     className={classes.proposerLinkJp}
  //   >
  //     <ShortAddress address={event.owner.id || ''} avatar={false} />
  //   </a>
  // );
  //   const title = {
  //     if(event.eventType === 'ForkStarted') {
  //       return 'Fork started'
  //     }
  //   if (event.eventType === 'ForkExecuted') {
  //     return 'Fork executed'
  //   }
  //   if (event.eventType === 'ForkingEnded') {
  //     return 'Forking period ended'
  //   }
  // }

  if (event.createdAt === null) return null;

  return (
    <div className={clsx(classes.forkTimelineItem, isOnlyEvent && classes.isOnlyEvent)} id={event.id}>
      <a href={`#${event.id}`} className={classes.eventPoint} />
      <header>
        <span className={classes.timestamp}>
          <a href={`#${event.id}`}>
            {timestamp}
          </a>
        </span>
        <h3 className={classes.eventTitle}>
          {isCycleEvent ? (actionLabel) : (<>{ownerLink} {actionLabel} {nounCount}</>)}

        </h3>
        {event.eventType === "EscrowDeposit" && event.reason && (
          <p className={classes.message}>{event.reason}</p>
        )}
        <div className={classes.nounsList}>
          {nounsInEvent}
        </div>
        {event.eventType === "EscrowDeposit" && proposalsList && proposalsList.length > 0 && (
          <div className={classes.proposals}>
            <p className={classes.sectionLabel}>
              <Trans>Offending proposal{proposalsList.length === 1 ? '' : 's'}</Trans>
            </p>
            <ul>
              {proposalsList}
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}

export default ForkEvent