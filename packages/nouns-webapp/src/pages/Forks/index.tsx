import React from 'react'
import { Fork, useForks } from '../../wrappers/nounsDao';
import { Link } from 'react-router-dom';

type Props = {}

const ForksPage: React.FC<Props> = props => {
  const forks = useForks();
  const now = new Date();
  const isLatestForkFinished = forks.data && forks.data[forks.data.length - 1].executed && +forks.data[forks.data.length - 1].forkingPeriodEndTimestamp < now.getTime() / 1000;
  return (
    <div>
      {/* if latest fork id is finished forking, display a callout with an option to start a new fork. */}
      {isLatestForkFinished && (
        <div>
          <p>
            The latest fork is finished forking. Start a new fork.
          </p>
          <button>
            Start a new fork
          </button>
        </div>
      )}
      {forks.data && forks.data.map((fork: Fork, i: number) => {
        return (
          <div key={i}>
            <Link to={`/fork/${fork.id}`}>
              {fork.id}
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default ForksPage