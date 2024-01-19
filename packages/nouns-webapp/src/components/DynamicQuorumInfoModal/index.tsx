import { useQuery } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import config from '../../config';
import { Proposal, useDynamicQuorumProps } from '../../wrappers/nounsDao';
import { adjustedNounSupplyAtPropSnapshot } from '../../wrappers/subgraph';
import { Backdrop } from '../Modal';
import classes from './DynamicQuorumInfoModal.module.css';
import { XIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';

const PLOTTING_CONSTANTS = {
  width: 950,
  dqFunctionMaxQXCrossoverPlotSpace: 470,
  height: 320,
  minQHeightPlotSpace: 288,
  maxQHeightPlotSpace: 32,
  slopeDQFunctionPlotSpace: -0.54468085106,
  mobileScreenCutoffWidthPixels: 1200,
};

const DynamicQuorumInfoModalOverlay: React.FC<{
  proposal: Proposal;
  againstVotesBps: number;
  againstVotesAbs: number;
  minQuorumBps: number;
  maxQuorumBps: number;
  quorumCoefficent: number;
  totalNounSupply: number;
  onDismiss: () => void;
  currentQuorum?: number;
}> = props => {
  const {
    onDismiss,
    proposal,
    againstVotesAbs,
    againstVotesBps,
    quorumCoefficent,
    minQuorumBps,
    maxQuorumBps,
    totalNounSupply,
    currentQuorum,
  } = props;

  const linearToConstantCrossoverBPS = (maxQuorumBps - minQuorumBps) / quorumCoefficent;

  const dqmFunction = (bps: number) => {
    return Math.min(minQuorumBps + quorumCoefficent * bps, maxQuorumBps);
  };

  const plotSpaceFunction = (x: number) => {
    return PLOTTING_CONSTANTS.slopeDQFunctionPlotSpace * x + PLOTTING_CONSTANTS.minQHeightPlotSpace;
  };

  const calcPlotFrac = () => {
    if (Math.floor((linearToConstantCrossoverBPS * totalNounSupply) / 10_000) <= 0) {
      return 0;
    }
    return (
      (againstVotesAbs / Math.floor((linearToConstantCrossoverBPS * totalNounSupply) / 10_000)) *
      PLOTTING_CONSTANTS.dqFunctionMaxQXCrossoverPlotSpace
    );
  };

  const x =
    againstVotesBps < linearToConstantCrossoverBPS
      ? calcPlotFrac()
      : PLOTTING_CONSTANTS.dqFunctionMaxQXCrossoverPlotSpace +
        0.5 * PLOTTING_CONSTANTS.width * (againstVotesBps / 10_000);
  const y = Math.max(plotSpaceFunction(x), PLOTTING_CONSTANTS.maxQHeightPlotSpace);

  return (
    <>
      <div className={classes.closeBtnWrapper}>
        <button onClick={onDismiss} className={classes.closeBtn}>
          <XIcon className={classes.icon} />
        </button>
      </div>
      <div className={classes.modal}>
        <div className={classes.content}>
          <h1 className={classes.title}>
            <Trans>Dynamic Threshold</Trans>
          </h1>

          <p className={classes.mainCopy}>
            {window.innerWidth < 1200 ? (
              <Trans>
                The Threshold (minimum number of For votes required to pass a proposal) is set as a
                function of the number of Against votes a proposal has received. It increases
                linearly as a function of the % of Nouns voting against a prop, varying between Min
                Threshold and Max Threshold.
              </Trans>
            ) : (
              <Trans>
                The Threshold (minimum number of For votes required to pass a proposal) is set as a
                function of the number of Against votes a proposal has received. The number of For
                votes required to pass Proposal {proposal.id} is given by the following curve:
              </Trans>
            )}
          </p>

          {/* Mobile - no graph content */}
          <div className={clsx(responsiveUiUtilsClasses.mobileOnly, classes.mobileQuorumWrapper)}>
            <div className={classes.mobileQuorumInfo}>
              <span>Min Threshold:</span> {Math.floor((minQuorumBps * totalNounSupply) / 10_000)}{' '}
              Nouns
            </div>

            <div className={classes.mobileQuorumInfo}>
              <span>Current Threshold:</span>{' '}
              {Math.floor(
                (Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) * totalNounSupply) / 10_000,
              )}{' '}
              Nouns
            </div>

            <div className={classes.mobileQuorumInfo}>
              <span>Max Threshold:</span> {Math.floor((maxQuorumBps * totalNounSupply) / 10_000)}{' '}
              Nouns
            </div>
          </div>

          {/* Outter container */}
          <div className={clsx(classes.graphContainer, classes.outterGraphContainer)}>
            <div className={classes.graphWrapper}>
              {/* Y-Axis label */}
              <div className={classes.yAxisText}>
                <Trans>Required % of Nouns to Pass</Trans>
              </div>

              {/* Inner graph container */}
              <div className={clsx(classes.graphContainer, classes.innerGraphContainer)}>
                {/* <svg width="950" height="320"> */}
                <svg width={PLOTTING_CONSTANTS.width} height={PLOTTING_CONSTANTS.height}>
                  <line
                    x1="0"
                    y1={PLOTTING_CONSTANTS.minQHeightPlotSpace}
                    x2="100%"
                    y2={PLOTTING_CONSTANTS.minQHeightPlotSpace}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <line
                    x1="0"
                    y1={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    x2="100%"
                    y2={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <line
                    x1={470}
                    y1={PLOTTING_CONSTANTS.maxQHeightPlotSpace}
                    x2={470}
                    y2={PLOTTING_CONSTANTS.height}
                    stroke="#151C3B40"
                    stroke-width="4"
                    stroke-dasharray="5"
                  />
                  <g fill="#4965F080" stroke="none">
                    <polygon points={`950,288 950,32 470,32 0,288`} />
                    <polygon points={`950,320 950,288 ${0},288 0,320`} />
                  </g>
                  {Math.abs(x - 470) > 100 && (
                    <text
                      fill="var(--brand-gray-light-text)"
                      x={470 + 10}
                      y={PLOTTING_CONSTANTS.height - 10}
                    >
                      {linearToConstantCrossoverBPS / 100}% of Nouns Against
                    </text>
                  )}
                  {/* Vertical Line indicating against BPS */}
                  <line
                    x1={x}
                    y1={PLOTTING_CONSTANTS.height}
                    y2={y}
                    x2={x}
                    stroke="var(--brand-color-red)"
                    stroke-width="4"
                  />
                  {/* Horizontal Line Indicating Required For BPS */}
                  <line
                    x1={0}
                    y1={y}
                    y2={y}
                    x2={x}
                    stroke="var(--brand-color-green)"
                    stroke-width="4"
                  />
                  <circle cy={y} cx={x} r="7" fill="var(--brand-gray-light-text)" />
                  <text x="20" y="24">
                    Max Threshold: {Math.floor((maxQuorumBps * totalNounSupply) / 10_000)} Nouns{' '}
                    <tspan fill="var(--brand-gray-light-text)">
                      ({maxQuorumBps / 100}% of Nouns)
                    </tspan>
                  </text>
                  {Math.abs(y - 10 - PLOTTING_CONSTANTS.minQHeightPlotSpace) > 100 ? (
                    <>
                      <text x="20" y="280">
                        Min Threshold: {Math.floor((minQuorumBps * totalNounSupply) / 10_000)}{' '}
                        {Math.floor((minQuorumBps * totalNounSupply) / 10_000) === 1
                          ? 'Noun'
                          : 'Nouns'}{' '}
                        <tspan fill="var(--brand-gray-light-text)">
                          ({minQuorumBps / 100}% of Nouns)
                        </tspan>
                      </text>
                    </>
                  ) : (
                    <>
                      <text x="550" y="280">
                        Min Thresold: {Math.floor((minQuorumBps * totalNounSupply) / 10_000)} Nouns{' '}
                        <tspan fill="var(--brand-gray-light-text)">
                          ({minQuorumBps / 100}% of Nouns)
                        </tspan>
                      </text>
                    </>
                  )}
                  {againstVotesBps >= 400 && againstVotesAbs >= maxQuorumBps && (
                    <text x={10} y={y - 10} fill="var(--brand-gray-light-text)">
                      {Math.floor(Math.min(maxQuorumBps, dqmFunction(againstVotesBps)) / 100)}% of
                      Nouns
                    </text>
                  )}
                  {againstVotesBps > 4000 ? (
                    <text
                      x={x - 390}
                      y={y + (againstVotesBps > 0.9 * linearToConstantCrossoverBPS ? 20 : -10)}
                    >
                      Current Threshold: {currentQuorum}{' '}
                      <tspan fill="var(--brand-gray-light-text)">
                        ({againstVotesAbs} {againstVotesAbs === 1 ? 'Noun' : 'Nouns'} Currently
                        Against)
                      </tspan>
                    </text>
                  ) : (
                    <text
                      x={x + 10}
                      y={y + (againstVotesBps > 0.9 * linearToConstantCrossoverBPS ? 20 : -10)}
                    >
                      Current Threshold: {currentQuorum}{' '}
                      <tspan fill="var(--brand-gray-light-text)">
                        ({againstVotesAbs} {againstVotesAbs === 1 ? 'Noun' : 'Nouns'} Currently
                        Against)
                      </tspan>
                    </text>
                  )}
                  {againstVotesAbs > 0 && (
                    <text x={x + (x < 712 ? 10 : -110)} y={310} fill="var(--brand-gray-light-text)">
                      {Math.floor(againstVotesBps / 100)}% of Nouns
                    </text>
                  )}
                  {againstVotesBps >= 0.1 * maxQuorumBps && (
                    <text x={4} y={310} fill="var(--brand-gray-light-text)">
                      0%
                    </text>
                  )}
                  Sorry, your browser does not support inline SVG.
                </svg>
              </div>
            </div>

            <div className={classes.xAxisText}>
              <Trans>% of Nouns Currently Against</Trans>
            </div>
          </div>

          <p className={classes.moreDetailsCopy}>
            <Trans>
              More details on how the dynamic threshold works can be found{' '}
              <span className={classes.underline}>here</span>.
            </Trans>
          </p>
        </div>
      </div>
    </>
  );
};

const DynamicQuorumInfoModal: React.FC<{
  proposal: Proposal;
  againstVotesAbsolute: number;
  onDismiss: () => void;
  currentQuorum?: number;
}> = props => {
  const { onDismiss, proposal, againstVotesAbsolute, currentQuorum } = props;

  const { data, loading, error } = useQuery(
    adjustedNounSupplyAtPropSnapshot(proposal && proposal.id ? proposal.id : '0'),
  );

  const dynamicQuorumProps = useDynamicQuorumProps(
    config.addresses.nounsDAOProxy,
    proposal.startBlock,
  );

  if (error) {
    return <>Failed to fetch dynamic threshold info</>;
  }

  if (loading) {
    return <></>;
  }

  // coeffient is represented as fixed point number multiplied by 1e6, thus we need to divide by this number to rescale it
  const scalingFactor = 1_000_000;
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onDismiss={onDismiss} />,
        document.getElementById('backdrop-root')!,
      )}
      {ReactDOM.createPortal(
        <DynamicQuorumInfoModalOverlay
          againstVotesBps={Math.floor(
            (againstVotesAbsolute / data.proposals[0].adjustedTotalSupply) * 10_000,
          )}
          againstVotesAbs={againstVotesAbsolute}
          minQuorumBps={dynamicQuorumProps?.minQuorumVotesBPS ?? 0}
          maxQuorumBps={dynamicQuorumProps?.maxQuorumVotesBPS ?? 0}
          quorumCoefficent={
            dynamicQuorumProps?.quorumCoefficient
              ? dynamicQuorumProps?.quorumCoefficient / scalingFactor
              : 0
          }
          onDismiss={onDismiss}
          proposal={proposal}
          totalNounSupply={data.proposals[0].adjustedTotalSupply}
          currentQuorum={currentQuorum}
        />,
        document.getElementById('overlay-root')!,
      )}
    </>
  );
};

export default DynamicQuorumInfoModal;
