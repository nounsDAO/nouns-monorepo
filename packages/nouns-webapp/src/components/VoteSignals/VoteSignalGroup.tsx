import React from 'react';
import { useEffect } from 'react';
import classes from './VoteSignals.module.css';
import clsx from 'clsx';
import VoteSignal from './VoteSignal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion/dist/framer-motion';
import { VoteSignalDetail } from '../../wrappers/nounsData';

type Props = {
  voteSignals: VoteSignalDetail[];
  support: number;
  isExpanded?: boolean;
};

const VoteSignalGroup = (props: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  useEffect(() => {
    if (props.isExpanded) {
      setIsExpanded(true);
    } else {
      // expand on render if there's any feedback in For, then try Against, then Abstain
      if (props.support === 1 && props.voteSignals.length > 0) {
        setIsExpanded(true);
      } else if (props.support === 0 && props.voteSignals.length > 0) {
        setIsExpanded(true);
      } else if (props.support === 2 && props.voteSignals.length > 0) {
        setIsExpanded(true);
      }
    }
  }, [props.support, props.voteSignals.length, props.isExpanded]);

  return (
    <div className={classes.voteSignalGroup}>
      <button
        className={clsx(
          classes.voteSignalLabel,
          props.support === 1 && classes.for,
          props.support === 0 && classes.against,
          props.support === 2 && classes.abstain,
          props.voteSignals.length > 0 && 'cursor-default',
        )}
        onClick={() => props.voteSignals.length > 0 && setIsExpanded(!isExpanded)}
        disabled={props.voteSignals.length === 0}
      >
        <p>
          {props.voteSignals.length}{' '}
          {(props.support === 1 && 'For') ||
            (props.support === 0 && 'Against') ||
            (props.support === 2 && 'Abstain')}
        </p>
        {props.voteSignals.length > 0 && (
          <motion.div
            className={clsx(
              classes.arrowIcon,
              isExpanded && classes.expanded,
              props.voteSignals.length > 0 ? 'opacity-100' : 'opacity-25',
            )}
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
        <motion.div key={props.support} className={clsx(isExpanded && classes.voteSignalsList)}>
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
