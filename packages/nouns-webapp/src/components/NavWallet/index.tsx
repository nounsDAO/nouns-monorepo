import React, { useState } from 'react';

import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { blo } from 'blo';
import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';
import { useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';

import { getNavBarButtonVariant, NavBarButtonStyle } from '@/components/NavBarButton';
import WalletConnectModal from '@/components/WalletConnectModal';
import { useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/useActivateLocale';
import {
  shortENS,
  useShortAddress,
  veryShortAddress,
  veryShortENS,
} from '@/utils/addressAndENSDisplayUtils';
import { usePickByState } from '@/utils/colorResponsiveUIUtils';
import { Address } from '@/utils/types';

import classes from './NavWallet.module.css';
import WalletConnectButton from './WalletConnectButton';

import navDropdownClasses from '@/components/NavWallet/NavBarDropdown.module.css';
import responsiveUiUtilsClasses from '@/utils/ResponsiveUIUtils.module.css';

interface NavWalletProps {
  address: Address;
  buttonStyle?: NavBarButtonStyle;
}

type Props = {
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  value: string;
};

type CustomMenuProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  labeledBy?: string;
};

const NavWallet: React.FC<NavWalletProps> = props => {
  const { address, buttonStyle } = props;

  const [buttonUp, setButtonUp] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { disconnect: deactivate } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const shortAddress = useShortAddress(address);
  const activeLocale = useActiveLocale();
  const { data: ensAvatar } = useEnsAvatar({ name: ensName?.toString() });
  const setModalStateHandler = (state: boolean) => {
    setShowConnectModal(state);
  };

  const switchWalletHandler = () => {
    setShowConnectModal(false);
    setButtonUp(false);
    deactivate();
    setShowConnectModal(false);
    setShowConnectModal(true);
  };

  const disconectWalletHandler = () => {
    setShowConnectModal(false);
    setButtonUp(false);
    deactivate();
  };

  const statePrimaryButtonClass = usePickByState(
    navDropdownClasses.whiteInfo,
    navDropdownClasses.coolInfo,
    navDropdownClasses.warmInfo,
  );

  const stateSelectedDropdownClass = usePickByState(
    navDropdownClasses.whiteInfoSelected,
    navDropdownClasses.dropdownActive,
    navDropdownClasses.dropdownActive,
  );

  const mobileTextColor = usePickByState(
    'rgba(140, 141, 146, 1)',
    'rgba(121, 128, 156, 1)',
    'rgba(142, 129, 127, 1)',
  );

  const mobileBorderColor = usePickByState(
    'rgba(140, 141, 146, .5)',
    'rgba(121, 128, 156, .5)',
    'rgba(142, 129, 127, .5)',
  );

  const connectWalletButtonStyle = usePickByState(
    NavBarButtonStyle.WHITE_WALLET,
    NavBarButtonStyle.COOL_WALLET,
    NavBarButtonStyle.WARM_WALLET,
  );

  // @ts-expect-error RefType is not defined but is needed for the forwardRef
  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          navDropdownClasses.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={navDropdownClasses.button}>
          <div className={classes.icon}>
            <img
              alt={address}
              src={ensAvatar ?? blo(address)}
              width={21}
              height={21}
              style={{ borderRadius: '50%' }}
            />
          </div>
          <div className={navDropdownClasses.dropdownBtnContent}>
            {ensName ? ensName : shortAddress}
          </div>
          <div className={buttonUp ? navDropdownClasses.arrowUp : navDropdownClasses.arrowDown}>
            <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />{' '}
          </div>
        </div>
      </div>
    </>
  ));
  customDropdownToggle.displayName = 'CustomDropdownToggle';

  const CustomMenu = React.forwardRef((props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props.labeledBy}
      >
        <div>
          <div
            onClick={switchWalletHandler}
            className={clsx(
              classes.dropDownTop,
              navDropdownClasses.button,
              navDropdownClasses.dropdownPrimaryText,
              usePickByState(
                navDropdownClasses.whiteInfoSelectedTop,
                navDropdownClasses.coolInfoSelected,
                navDropdownClasses.warmInfoSelected,
              ),
            )}
          >
            <Trans>Switch wallet</Trans>
          </div>

          <div
            onClick={disconectWalletHandler}
            className={clsx(
              classes.dropDownBottom,
              navDropdownClasses.button,
              usePickByState(
                navDropdownClasses.whiteInfoSelectedBottom,
                navDropdownClasses.coolInfoSelected,
                navDropdownClasses.warmInfoSelected,
              ),
              classes.disconnectText,
            )}
          >
            <Trans>Disconnect</Trans>
          </div>
        </div>
      </div>
    );
  });
  CustomMenu.displayName = 'CustomMenu';

  const renderENS = (ens: string) => {
    if (activeLocale === 'ja-JP') {
      return veryShortENS(ens);
    }
    return shortENS(ens);
  };

  const renderAddress = (address: Address) => {
    if (activeLocale === 'ja-JP') {
      return veryShortAddress(address);
    }
    return shortAddress;
  };

  const walletConnectedContentMobile = (
    <div className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.mobileOnly)}>
      <div
        className={'d-flex justify-content-between flex-row'}
        style={{
          justifyContent: 'space-between',
        }}
      >
        <div className={navDropdownClasses.connectContentMobileWrapper}>
          <div className={clsx(navDropdownClasses.wrapper, getNavBarButtonVariant(buttonStyle))}>
            <div className={navDropdownClasses.button}>
              <div className={classes.icon}>
                {' '}
                <img
                  alt={address}
                  src={address ? blo(address as Address) : ''}
                  width={21}
                  height={21}
                  style={{ borderRadius: '50%' }}
                />
              </div>
              <div className={navDropdownClasses.dropdownBtnContent}>
                {ensName ? renderENS(ensName) : renderAddress(address)}
              </div>
            </div>
          </div>
        </div>

        <div className={`d-flex flex-row ${classes.connectContentMobileText}`}>
          <div
            style={{
              borderRight: `1px solid ${mobileBorderColor}`,
              color: mobileTextColor,
            }}
            className={classes.mobileSwitchWalletText}
            onClick={switchWalletHandler}
          >
            <Trans>Switch</Trans>
          </div>
          <div className={classes.disconnectText} onClick={disconectWalletHandler}>
            <Trans>Sign out</Trans>
          </div>
        </div>
      </div>
    </div>
  );

  const walletConnectedContentDesktop = (
    <Dropdown
      className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.desktopOnly)}
      onToggle={() => setButtonUp(!buttonUp)}
    >
      <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
      <Dropdown.Menu className={`${navDropdownClasses.desktopDropdown} `} as={CustomMenu} />
    </Dropdown>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={() => setModalStateHandler(false)} />
      )}
      {activeAccount ? (
        <>
          {walletConnectedContentDesktop}
          {walletConnectedContentMobile}
        </>
      ) : (
        <WalletConnectButton
          className={clsx(navDropdownClasses.nounsNavLink, navDropdownClasses.connectBtn)}
          onClickHandler={() => setModalStateHandler(true)}
          buttonStyle={connectWalletButtonStyle}
        />
      )}
    </>
  );
};

export default NavWallet;
