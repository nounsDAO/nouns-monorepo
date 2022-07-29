import React from 'react';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import { useProposal } from '../../wrappers/nounsDao';
import {
  selectIconForNounVoteActivityRow,
  selectProposalStatusIcon,
  selectVotingInfoText,
} from '../NounProfileVoteRow';
import { NounVoteHistory } from '../ProfileActivityFeed';
import ShortAddress from '../ShortAddress';
import classes from './MobileNounProfileVoteRow.module.css';

interface MobileNounProfileVoteRowProps {
  proposalId: number;
  vote?: NounVoteHistory;
}

const MobileNounProfileVoteRow: React.FC<MobileNounProfileVoteRowProps> = props => {
  const { proposalId, vote } = props;

  const proposal = useProposal(proposalId);

  const history = useHistory();
  const activeLocale = useActiveLocale();

  if (proposal === undefined) {
    return <></>;
  }

  return (
    <div
      style={{
        borderBottom: '1px solid var(--brand-gray-border)',
        paddingBottom: '0.5rem',
        fontFamily: 'PT Root UI',
        fontSize: '18px',
        marginTop: '1.0rem'
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        {/* Icon */}
        <div>
          <div
            style={{
              width: '38px',
              marginRight: '0px',
              // marginBottom: '4px',
              marginTop: '0.25rem',
              marginLeft: '6px',
            }}
          >
            {selectIconForNounVoteActivityRow(proposal, vote)}
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            marginLeft: '0.5rem',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >

          {/* Main copy */}
          <div
            style={{
              marginLeft: '1rem',
            }}
          >
            {selectVotingInfoText(proposal, vote)}{' '}
            <span
              style={{
                textDecoration: 'none',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              {proposal.title}
            </span>
        </div>
            
        {/* Info pills */}
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: '1rem',
            marginTop: '0.1rem'
        }}>
            {vote && vote.voter && (
                <div
                className={classes.voteStatusWrapper}
                style={{
                    marginRight: '0.5rem',
                }}
                >
                <ReactTooltip
                    id={'noun-profile-delegate'}
                    effect={'solid'}
                    className={classes.delegateHover}
                    getContent={dataTip => {
                    return <div>{dataTip}</div>;
                    }}
                />
                <div
                    data-tip={`Delegate for Proposal ${vote.proposal.id}`}
                    data-for="noun-profile-delegate"
                    style={{
                    borderRadius: '8px',
                    padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                    backgroundColor: 'var(--brand-gray-light-text-translucent)',
                    color: 'var(--brand-gray-light-text)',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    display: 'flex',
                    }}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        height: '16px',
                        width: '16px',
                        marginRight: '0.3rem',
                        marginTop: '0.12rem',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                    </svg>
                    <ShortAddress address={vote.voter.id} />
                </div>
                </div>
            )}

            <div className={classes.voteStatusWrapper}>
            <div className={classes.voteProposalStatus}>{selectProposalStatusIcon(proposal)}</div>
            </div>
        </div>





        </div>
      </div>
    </div>
  );
};

export default MobileNounProfileVoteRow;
