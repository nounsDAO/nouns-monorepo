import React from 'react';
import classes from './VoteSignals.module.css';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import VoteSignal from './VoteSignal';
import VoteSignalGroup from './VoteSignalGroup';
import { useAddFeedback } from '../../wrappers/nounsData';
import { Proposal } from '../../wrappers/nounsDao';

type Props = {
  availableVotes?: number;
  proposal: Proposal;
};

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
  const [reasonText, setReasonText] = React.useState('');
  const [support, setSupport] = React.useState<number>();
  const { addFeedback, addFeedbackState } = useAddFeedback();

  async function handleFeedbackSubmit() {
    if (!support) {
      return;
    }

    await addFeedback({
      proposalId: '0x123',
      support,
      reason: reasonText,
    });
  }

  return (
    <div className={classes.voteSignals}>
      <div className={classes.header}>
        <h2>
          <Trans>Pre-voting feedback</Trans>
        </h2>
        <p>
          Nouns voters can cast voting signals to give proposers of pending proposals an idea of how
          they intend to vote and helpful guidance on proposal changes to change their vote.
        </p>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.voteSignalGroupsList}>
          <VoteSignalGroup voteSignals={tempVoteSignalsFor} support={1} />
          <VoteSignalGroup voteSignals={tempVoteSignalsAgainst} support={0} />
          <VoteSignalGroup voteSignals={tempVoteSignalsAbstain} support={2} />
        </div>
        {/* {props.availableVotes && props.availableVotes > 0 && ( */}
        {/* // user is voter, show form */}
        <div className={classes.feedbackForm}>
          <p>Add your feedback</p>
          <div className={classes.buttons}>
            <button
              className={clsx(
                classes.button,
                classes.for,
                support && support === 1 ? classes.selectedSupport : classes.unselectedSupport,
              )}
              onClick={() => setSupport(1)}
            >
              For
            </button>
            <button
              className={clsx(
                classes.button,
                classes.against,
                support !== undefined && support === 0
                  ? classes.selectedSupport
                  : classes.unselectedSupport,
              )}
              onClick={() => setSupport(0)}
            >
              Against
            </button>
            <button
              className={clsx(
                classes.button,
                classes.abstain,
                support && support === 2 ? classes.selectedSupport : classes.unselectedSupport,
              )}
              onClick={() => setSupport(2)}
            >
              Abstain
            </button>
          </div>
          <input
            type="text"
            className={classes.reasonInput}
            placeholder="Optional reason"
            value={reasonText}
            onChange={event => setReasonText(event.target.value)}
          />
          <button className={clsx(classes.button, classes.submit)}>Submit</button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default VoteSignals;
