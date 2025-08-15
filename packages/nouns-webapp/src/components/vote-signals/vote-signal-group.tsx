import React, { useEffect } from 'react';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';

import { VoteSignalDetail } from '@/wrappers/nounsData';

import VoteSignal from './vote-signal';

type Props = {
  voteSignals: VoteSignalDetail[];
  support: number;
  isExpanded?: boolean;
};

const VoteSignalGroup = (props: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  useEffect(() => {
    if (props.isExpanded === true) {
      setIsExpanded(true);
    } else {
      // expand on render if there are any vote signals (for For, Against, or Abstain)
      if (props.voteSignals.length > 0) {
        setIsExpanded(true);
      }
    }
  }, [props.support, props.voteSignals.length, props.isExpanded]);

  return (
    <div className="border-b border-[#e6e6e6] py-2.5 last:border-none">
      <button
        className={clsx(
          'flex w-full flex-row items-center justify-between gap-2.5 border-none bg-transparent',
          props.support === 1 && '[&>p]:text-[var(--brand-color-green)]',
          props.support === 0 && '[&>p]:text-[var(--brand-color-red)]',
          props.support === 2 && '[&>p]:text-[var(--brand-gray-light-text)]',
          props.voteSignals.length > 0 && 'cursor-default',
        )}
        onClick={() => props.voteSignals.length > 0 && setIsExpanded(!isExpanded)}
        disabled={props.voteSignals.length === 0}
      >
        <p className="m-0 w-full p-0 text-left text-lg font-bold leading-none">
          {props.voteSignals.length}{' '}
          {(props.support === 1 && 'For') ||
            (props.support === 0 && 'Against') ||
            (props.support === 2 && 'Abstain')}
        </p>
        {props.voteSignals.length > 0 && (
          <motion.div
            className={clsx(props.voteSignals.length > 0 ? 'opacity-100' : 'opacity-25')}
            animate={{
              rotate: isExpanded ? 0 : 180,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.div>
        )}
      </button>
      <AnimatePresence>
        <motion.div
          key={props.support}
          className={clsx(isExpanded && 'mt-2.5 flex flex-col gap-2.5')}
        >
          {isExpanded &&
            props.voteSignals.map((voteSignal, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  transition: {
                    delay: i * 0.05,
                    duration: 0.05,
                  },
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  transition: {
                    delay: i * 0.02,
                    duration: 0.05,
                  },
                }}
              >
                <VoteSignal
                  key={i}
                  support={voteSignal.supportDetailed}
                  address={voteSignal.voter.id}
                  voteCount={voteSignal.votes}
                  reason={voteSignal.reason}
                />
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VoteSignalGroup;
