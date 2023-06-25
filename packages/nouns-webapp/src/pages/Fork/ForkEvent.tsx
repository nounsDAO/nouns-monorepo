import React from 'react'
import classes from './Fork.module.css';
import { EscrowDeposit, EscrowWithdrawal, useProposalTitles } from '../../wrappers/nounsDao'
import { Trans } from '@lingui/macro';
import { Link } from 'react-router-dom';
import ShortAddress from '../../components/ShortAddress';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import dayjs from 'dayjs';

type Props = {
  event: EscrowDeposit | EscrowWithdrawal
}


const ForkEvent = ({ event }: Props) => {
  // console.log('event details', event);
  const actionLabel = event.eventType === 'EscrowDeposit' ? 'added' : 'removed';
  const nounCount = event.tokenIDs?.length;
  const nounLabel = nounCount > 1 ? 'Nouns' : 'Noun';
  const timestamp = dayjs(+event.createdAt * 1000).fromNow()
  const proposalsTitles = useProposalTitles(event.eventType === "EscrowDeposit" ? event.proposalIDs : []);
  // console.log('proposalsTitles', proposalsTitles, event.eventType === "EscrowDeposit" && event.proposalIDs);
  const nounsInEvent = event.tokenIDs?.map((tokenId, i) => {
    return (
      <Link key={i} to={`/noun/${tokenId}`}>
        <img src={`https://noun.pics/${tokenId}`} alt={`Noun ${tokenId}`} className={classes.nounImage} />
      </Link>
    )
  });
  const proposalsList = proposalsTitles?.map((proposal, i) => {
    return (
      <li key={i}>
        <Link to={`/vote/${proposal.id}`}>
          <strong>{proposal.id}</strong> {proposal.title}
        </Link>
      </li>
    )
  });
  const ownerLink = (
    <a
      href={buildEtherscanAddressLink(event.owner.id || '')}
      target="_blank"
      rel="noreferrer"
      className={classes.proposerLinkJp}
    >
      <ShortAddress address={event.owner.id || ''} avatar={false} />
    </a>
  );

  return (
    <div className={classes.forkTimelineItem} id={event.id}>
      <a href={`#${event.id}`} className={classes.eventPoint} />
      <header>
        <span className={classes.timestamp}>
          <a href={`#${event.id}`}>
            {timestamp}
          </a>
        </span>
        <h3 className={classes.eventTitle}>
          {ownerLink} {actionLabel} {nounCount} {nounLabel}
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
              <Trans>Offending proposals</Trans>
            </p>
            <ul>
              {proposalsList}
              {/* <li><a href="/vote/282"><strong>282</strong> Dynamic Quorum Updates</a></li>
              <li><a href="/vote/123"><strong>123</strong> Prop 56 FUN Frames Re-evaluation</a></li>
              <li><a href="/vote/282"><strong>99</strong> Sailing PR campaign, Korea Blockchain Week 2022 [6,7 August]</a></li> */}
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}

export default ForkEvent