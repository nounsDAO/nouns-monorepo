import React from 'react';

import { Trans } from '@lingui/react/macro';
import { useAccount } from 'wagmi';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import ShortAddress from '@/components/short-address';
import { useReadNounsTokenDelegates } from '@/contracts';
import { formatShortAddress } from '@/utils/addressAndENSDisplayUtils';

import classes from './current-delegate-pannel.module.css';

interface CurrentDelegatePannelProps {
  onPrimaryBtnClick: (e: React.MouseEvent<HTMLElement>) => void;
  onSecondaryBtnClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const CurrentDelegatePannel: React.FC<CurrentDelegatePannelProps> = ({
  onPrimaryBtnClick,
  onSecondaryBtnClick,
}) => {
  const { address: maybeAccount } = useAccount();
  const { data: delegate } = useReadNounsTokenDelegates();
  const account = delegate ?? maybeAccount ?? '0x';
  const shortAccount = formatShortAddress(account);

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
          <div className={classes.current}>
            <Trans>Current Delegate</Trans>
          </div>
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
          buttonText={<Trans>Update Delegate</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
          onClick={onPrimaryBtnClick}
        />
      </div>
    </div>
  );
};

export default CurrentDelegatePannel;
