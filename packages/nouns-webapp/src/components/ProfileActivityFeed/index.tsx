import React, { useState } from 'react';
import { Col, Collapse, Spinner, Table } from 'react-bootstrap';
import Section from '../../layout/Section';
import classes from './ProfileActivityFeed.module.css';

import { useQuery } from '@apollo/client';
import { Proposal, ProposalState, useAllProposals } from '../../wrappers/nounsDao';
import { createTimestampAllProposals, nounVotingHistoryQuery } from '../../wrappers/subgraph';
import NounProfileVoteRow from '../NounProfileVoteRow';
import { LoadingNoun } from '../Noun';
import { useNounCanVoteTimestamp } from '../../wrappers/nounsAuction';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { Trans } from '@lingui/macro';
import {
  NounProfileEvent,
  NounProfileEventType,
  useNounProfileEvents,
} from '../../wrappers/nounProfileActivityFeed';
import NounActivityFeedRow from '../NounActivityFeedRow';
import { ExternalLinkIcon, ScaleIcon, SwitchHorizontalIcon } from '@heroicons/react/solid';
import ShortAddress from '../ShortAddress';
import { ethers } from 'ethers';
import ReactTooltip from 'react-tooltip';
import { buildEtherscanTxLink } from '../../utils/etherscan';

interface ProfileActivityFeedProps {
  nounId: number;
}

interface ProposalInfo {
  id: number;
}

export interface NounVoteHistory {
  proposal: ProposalInfo;
  support: boolean;
  supportDetailed: number | undefined;
  voter: { id: string };
  blockNumber: number;
}

const ProfileActivityFeed: React.FC<ProfileActivityFeedProps> = props => {
  const { nounId } = props;

  const MAX_EVENTS_SHOW_ABOVE_FOLD = 5;

  // TODO change verbeage to events vs proposals
  const [truncateProposals, setTruncateProposals] = useState(true);

  const { loading, error, data } = useNounProfileEvents(nounId);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    console.log(data);
    return (
      <div>
        <Trans>Failed to fetch Noun activity history</Trans>
      </div>
    );
  }

  return (
    <Section fullWidth={false}>
      <Col lg={{ span: 10, offset: 1 }}>
        <div className={classes.headerWrapper}>
          <h1>
            <Trans>Activity</Trans>
          </h1>
        </div>
        {data && data.length ? (
          <>
            <Table responsive hover className={classes.aboveTheFoldEventsTable}>
              <tbody className={classes.nounInfoPadding}>
                {data?.length ? (
                  data
                    .slice(0)
                    .slice(0, MAX_EVENTS_SHOW_ABOVE_FOLD)
                    .map((event: NounProfileEvent, i: number) => {
                      if (event.eventType === NounProfileEventType.VOTE) {
                        return (
                          <NounProfileVoteRow
                            proposalId={event.data.proposal.id}
                            vote={event.data}
                          />
                        );
                      }

                      if (event.eventType === NounProfileEventType.DELEGATION) {
                        return (
                          <NounActivityFeedRow
                            // TODO
                            // onClick={() => window.open('https://etherscan.io', '_blank')}
                            onClick={() =>
                              window.open(
                                buildEtherscanTxLink(
                                  event.data.id.subString(0, event.data.id.indexOf('_')),
                                ),
                                '_blank',
                              )
                            }
                            icon={
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                  color: 'var(--brand-gray-light-text)',
                                  borderRadius: '100%',
                                  // padding: '1rem',
                                  height: '38px',
                                  width: '38px',
                                  marginLeft: '0.4rem',
                                }}
                              >
                                <ScaleIcon
                                  style={{
                                    height: '22px',
                                    width: '22px',
                                  }}
                                />
                              </div>
                            }
                            primaryContent={
                              <>
                                Delegate changed from
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {' '}
                                  <ShortAddress address={event.data.previousDelegate.id} />
                                </span>{' '}
                                to{' '}
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  <ShortAddress address={event.data.newDelegate.id} />
                                </span>
                              </>
                            }
                            secondaryContent={
                              <>
                                <ReactTooltip
                                  id={'view-on-etherscan-tooltip'}
                                  effect={'solid'}
                                  className={classes.delegateHover}
                                  getContent={dataTip => {
                                    return <div>{dataTip}</div>;
                                  }}
                                />
                                <div
                                  data-tip={`View on Etherscan`}
                                  data-for="view-on-etherscan-tooltip"
                                  style={{
                                    borderRadius: '8px',
                                    padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                                    backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                    color: 'var(--brand-gray-light-text)',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    display: 'flex',
                                    marginLeft: 'auto',
                                  }}
                                >
                                  <ExternalLinkIcon
                                    style={{
                                      height: '16px',
                                      width: '16px',
                                      marginRight: '0.3rem',
                                      marginTop: '0.18rem',
                                    }}
                                  />
                                  {event.data.id.substring(0, 15) + '...'}
                                </div>
                              </>
                            }
                          />
                        );
                      }

                      if (event.eventType === NounProfileEventType.TRANSFER) {
                        return (
                          <NounActivityFeedRow
                            // TODO
                            onClick={() =>
                              window.open(buildEtherscanTxLink(event.data.id), '_blank')
                            }
                            icon={
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                  color: 'var(--brand-gray-light-text)',
                                  borderRadius: '100%',
                                  // padding: '1rem',
                                  height: '38px',
                                  width: '38px',
                                  marginLeft: '0.4rem',
                                }}
                              >
                                <SwitchHorizontalIcon
                                  style={{
                                    height: '22px',
                                    width: '22px',
                                  }}
                                />
                              </div>
                            }
                            primaryContent={
                              <>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  <ShortAddress address={event.data.previousHolder.id} />
                                </span>{' '}
                                transfered Noun {nounId} to{' '}
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  <ShortAddress address={event.data.newHolder.id} />
                                </span>
                              </>
                            }
                            secondaryContent={
                              <>
                                <ReactTooltip
                                  id={'view-on-etherscan-tooltip'}
                                  effect={'solid'}
                                  className={classes.delegateHover}
                                  getContent={dataTip => {
                                    return <div>{dataTip}</div>;
                                  }}
                                />
                                <div
                                  data-tip={`View on Etherscan`}
                                  data-for="view-on-etherscan-tooltip"
                                  style={{
                                    borderRadius: '8px',
                                    padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                                    backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                    color: 'var(--brand-gray-light-text)',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    display: 'flex',
                                    marginLeft: 'auto',
                                  }}
                                >
                                  <ExternalLinkIcon
                                    style={{
                                      height: '16px',
                                      width: '16px',
                                      marginRight: '0.3rem',
                                      marginTop: '0.18rem',
                                    }}
                                  />
                                  {event.data.id.substring(0, 15) + '...'}
                                </div>
                              </>
                            }
                          />
                        );
                      }
                    })
                ) : (
                  <LoadingNoun />
                )}
              </tbody>
            </Table>
            <Collapse in={!truncateProposals}>
              <div>
                <Table responsive hover>
                  <tbody className={classes.nounInfoPadding}>
                    {data?.length ? (
                      data
                        .slice(0)
                        // .reverse()
                        .slice(MAX_EVENTS_SHOW_ABOVE_FOLD, data.length)
                        .map((event: NounProfileEvent, i: number) => {
                          if (event.eventType === NounProfileEventType.VOTE) {
                            return (
                              <NounProfileVoteRow
                                proposalId={event.data.proposal.id}
                                vote={event.data}
                              />
                            );
                          }

                          if (event.eventType === NounProfileEventType.DELEGATION) {
                            return (
                              <NounActivityFeedRow
                                // TODO
                                onClick={() => window.open('https://etherscan.io', '_blank')}
                                icon={
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                      color: 'var(--brand-gray-light-text)',
                                      borderRadius: '100%',
                                      // padding: '1rem',
                                      height: '38px',
                                      width: '38px',
                                      marginLeft: '0.4rem',
                                    }}
                                  >
                                    <ScaleIcon
                                      style={{
                                        height: '22px',
                                        width: '22px',
                                      }}
                                    />
                                  </div>
                                }
                                primaryContent={
                                  <>
                                    Delegate changed from
                                    <span
                                      style={{
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {' '}
                                      <ShortAddress address={event.data.previousDelegate.id} />
                                    </span>{' '}
                                    to{' '}
                                    <span
                                      style={{
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      <ShortAddress address={event.data.newDelegate.id} />
                                    </span>
                                  </>
                                }
                                secondaryContent={
                                  <>
                                    <ReactTooltip
                                      id={'view-on-etherscan-tooltip'}
                                      effect={'solid'}
                                      className={classes.delegateHover}
                                      getContent={dataTip => {
                                        return <div>{dataTip}</div>;
                                      }}
                                    />
                                    <div
                                      data-tip={`View on Etherscan`}
                                      data-for="view-on-etherscan-tooltip"
                                      style={{
                                        borderRadius: '8px',
                                        padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                                        backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                        color: 'var(--brand-gray-light-text)',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        marginLeft: 'auto',
                                      }}
                                    >
                                      <ExternalLinkIcon
                                        style={{
                                          height: '16px',
                                          width: '16px',
                                          marginRight: '0.3rem',
                                          marginTop: '0.18rem',
                                        }}
                                      />
                                      {event.data.id.substring(0, 15) + '...'}
                                    </div>
                                  </>
                                }
                              />
                            );
                          }

                          if (event.eventType === NounProfileEventType.TRANSFER) {
                            return (
                              <NounActivityFeedRow
                                // TODO
                                onClick={() => window.open('https://etherscan.io', '_blank')}
                                icon={
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                      color: 'var(--brand-gray-light-text)',
                                      borderRadius: '100%',
                                      // padding: '1rem',
                                      height: '38px',
                                      width: '38px',
                                      marginLeft: '0.4rem',
                                    }}
                                  >
                                    <SwitchHorizontalIcon
                                      style={{
                                        height: '22px',
                                        width: '22px',
                                      }}
                                    />
                                  </div>
                                }
                                primaryContent={
                                  <>
                                    <span
                                      style={{
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      <ShortAddress address={event.data.previousHolder.id} />
                                    </span>{' '}
                                    transfered Noun {nounId} to{' '}
                                    <span
                                      style={{
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      <ShortAddress address={event.data.newHolder.id} />
                                    </span>
                                  </>
                                }
                                secondaryContent={
                                  <>
                                    <ReactTooltip
                                      id={'view-on-etherscan-tooltip'}
                                      effect={'solid'}
                                      className={classes.delegateHover}
                                      getContent={dataTip => {
                                        return <div>{dataTip}</div>;
                                      }}
                                    />
                                    <div
                                      data-tip={`View on Etherscan`}
                                      data-for="view-on-etherscan-tooltip"
                                      style={{
                                        borderRadius: '8px',
                                        padding: '0.36rem 0.65rem 0.36rem 0.65rem',
                                        backgroundColor: 'var(--brand-gray-light-text-translucent)',
                                        color: 'var(--brand-gray-light-text)',
                                        fontWeight: 'bold',
                                        fontSize: '14px',
                                        display: 'flex',
                                        marginLeft: 'auto',
                                      }}
                                    >
                                      <ExternalLinkIcon
                                        style={{
                                          height: '16px',
                                          width: '16px',
                                          marginRight: '0.3rem',
                                          marginTop: '0.18rem',
                                        }}
                                      />
                                      {event.data.id.substring(0, 15) + '...'}
                                    </div>
                                  </>
                                }
                              />
                            );
                          }
                        })
                    ) : (
                      <LoadingNoun />
                    )}
                  </tbody>
                </Table>
              </div>
            </Collapse>

            {data.length <= MAX_EVENTS_SHOW_ABOVE_FOLD ? (
              <></>
            ) : (
              <>
                {truncateProposals ? (
                  <div
                    className={classes.expandCollapseCopy}
                    onClick={() => setTruncateProposals(false)}
                  >
                    <Trans>Show all {data.length} events </Trans>{' '}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </div>
                ) : (
                  <div
                    className={classes.expandCollapseCopy}
                    onClick={() => setTruncateProposals(true)}
                  >
                    <Trans>Show fewer</Trans> <FontAwesomeIcon icon={faChevronUp} />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className={classes.nullStateCopy}>
            <Trans>This Noun has no activity, since it was just created. Check back soon!</Trans>
          </div>
        )}
      </Col>
    </Section>
  );
};

export default ProfileActivityFeed;
