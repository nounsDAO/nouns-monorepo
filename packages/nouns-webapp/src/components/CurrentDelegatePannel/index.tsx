import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import React from 'react';
import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import ShortAddress from '../ShortAddress';
import classes from './CurrentDelegatePannel.module.css';

interface CurrentDelegatePannelProps {
  onPrimaryBtnClick: (e: any) => void;
  onSecondaryBtnClick: (e: any) => void;
}

const CurrentDelegatePannel: React.FC<CurrentDelegatePannelProps> = props => {
  const { onPrimaryBtnClick, onSecondaryBtnClick } = props;

  const { account: maybeAccount } = useEthers();
  const account = maybeAccount ?? '';
  const shortAccount = useShortAddress(account);

  return (
    <div className={classes.wrapper}>
      <div>
        <div className={classes.header}>
          <h1 className={classes.title}>
            <Trans>Delegation</Trans>
          </h1>

          <p className={classes.copy}>
            <Trans>
              Noun votes are not transferable, but are{' '}
              <span className={classes.emph}>delegatable</span>, which means you can assign your
              vote to someone else as long as you own your Noun.
            </Trans>
          </p>
        </div>

        <div className={classes.contentWrapper}>
          <div className={classes.current}>Current</div>

          <div className={classes.delegateInfoWrapper}>
            <div className={classes.ens}>
              <ShortAddress address={account} avatar={true} size={39} />
            </div>
            <div className={classes.shortAddress}>{shortAccount}</div>
          </div>
        </div>
      </div>

      <div className={classes.buttonWrapper}>
        <NavBarButton
          buttonText={<Trans>Close</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
          onClick={onSecondaryBtnClick}
        />
        <NavBarButton
          buttonText={<Trans>Change Delegate</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
          onClick={onPrimaryBtnClick}
        />
      </div>
    </div>
  );
};

export default CurrentDelegatePannel;
