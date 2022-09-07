import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Trans } from '@lingui/macro';
import classes from './DelegateTitle.module.css';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import ShortAddress from '../ShortAddress';
import React from 'react';
import { StandaloneNounCircular } from '../StandaloneNoun';
import { BigNumber } from 'ethers';

interface DelegateTitleProps {
  delegateAddress: string;
  nounsRepresented: string[];
}

const DelegateTitle: React.FC<DelegateTitleProps> = props => {
  const { delegateAddress, nounsRepresented } = props;

  const history = useHistory();
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-start align-items-start">
        <button
          onClick={() => {
            history.goBack();
          }}
          className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}
        >
          ←
        </button>
        <div className={classes.headerRow}>
          <span>
            <div className="d-flex">
              <div>
                <Trans>Delegate</Trans>
              </div>
            </div>
          </span>
          <div className={classes.proposalTitleWrapper}>
            <div className={classes.proposalTitle}>
              <h1>
                <ShortAddress address={delegateAddress} />
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.nounStackWrapper}>
        {nounsRepresented.slice(0, 6).map((nounId: string, index: number) => {
          return (
            <div
              style={{
                zIndex: `${10 * (index + 1)}`,
              }}
              className={classes.nounWrapper}
            >
              <StandaloneNounCircular
                height={84}
                width={84}
                nounId={BigNumber.from(nounId)}
                border={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DelegateTitle;
