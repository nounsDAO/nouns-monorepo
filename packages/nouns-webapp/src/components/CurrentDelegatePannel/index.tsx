import { useEthers } from '@usedapp/core';
import React from 'react';
import account from '../../state/slices/account';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import delegationModalClasses from '../DelegationModal/DelegationModal.module.css';
import ShortAddress from '../ShortAddress';
import classes from './CurrentDelegatePannel.module.css';

interface CurrentDelegatePannelProps {
  onPrimaryBtnClick: (e: any) => void;
  onSecondaryBtnClick: (e: any) => void;
}

const CurrentDelegatePannel: React.FC<CurrentDelegatePannelProps> = props => {
  const { onPrimaryBtnClick, onSecondaryBtnClick } = props;

  const { account } = useEthers();
  const shortAccount = useShortAddress(account || '');

  return (
    <>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>Delegation</h1>

        <p className={classes.copy}>
          Noun votes are not transferable, but are <span className={classes.emph}>delegatable</span>
          , which means you can assign your vote to someone else as long as you own your Noun.
        </p>
      </div>

      {/* Current delegate */}
      <div className={classes.contentWrapper}>
        <div className={classes.current}>Current</div>

        {/* Current delegate component */}
        <div className={classes.delegateInfoWrapper}>
          <div className={classes.ens}>
            <ShortAddress address={account || ''} avatar={true} size={39} />
          </div>
          <div className={classes.shortAddress}>{shortAccount}</div>
        </div>
      </div>
    </>
  );
};

export default CurrentDelegatePannel;
