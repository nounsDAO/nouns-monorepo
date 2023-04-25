import React from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignal from './VoteSignal';
import VoteSignalGroup from './VoteSignalGroup';

type Props = {};

const tempVoteSignalsFor = [
  {
    address: '0x1234',
    voteCount: 3,
    support: 1,
    reason: "I'm voting for this proposal because I like it.",
  },
  {
    address: '0xXYZZ',
    voteCount: 1,
    support: 1,
    reason:
      'Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
  },
  {
    address: '0xBCA',
    voteCount: 1,
    support: 1,
    reason: '',
  },
];
const tempVoteSignalsAgainst = [
  {
    address: '0x1234',
    voteCount: 6,
    support: 0,
    reason: "I'm voting against this proposal because I don't like it.",
  },
  {
    address: '0xABC',
    voteCount: 1,
    support: 0,
    reason: '',
  },
];

const tempVoteSignalsAbstain: any[] = [];

const VoteSignals = (props: Props) => {
  return (
    <div className={classes.voteSignalsWrapper}>
      <div className={classes.header}>
        <h2>
          <Trans>Pre-voting feedback</Trans>
        </h2>
        <p>
          Nouns voters can cast voting signals to give proposers of pending proposals an idea of how
          they intend to vote and helpful guidance on proposal changes to change their vote.
        </p>
      </div>
      <div className={classes.voteSignalGroupsList}>
        <VoteSignalGroup voteSignals={tempVoteSignalsFor} support={1} />
        <VoteSignalGroup voteSignals={tempVoteSignalsAgainst} support={0} />
        <VoteSignalGroup voteSignals={tempVoteSignalsAbstain} support={2} />
      </div>
    </div>
  );
};

export default VoteSignals;
