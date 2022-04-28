import Davatar from '@davatar/react';
import { useEthers } from '@usedapp/core';
import React, { useState } from 'react';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { getNavBarButtonVariant, NavBarButtonStyle } from '../NavBarButton';
import classes from './NavWallet.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import WalletConnectModal from '../WalletConnectModal';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { isMobileScreen } from '../../utils/isMobile';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import WalletConnectButton from './WalletConnectButton';
import { Trans } from '@lingui/macro';
import {
  shortENS,
  useShortAddress,
  veryShortAddress,
  veryShortENS,
} from '../../utils/addressAndENSDisplayUtils';
import { useActiveLocale } from '../../hooks/useActivateLocale';

interface NavWalletProps {
  address: string;
  buttonStyle?: NavBarButtonStyle;
}

type Props = {
  onClick: (e: any) => void;
  value: string;
};

type RefType = number;

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
  const history = useHistory();
  const { library: provider } = useEthers();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();
  const ens = useReverseENSLookUp(address);
  const shortAddress = useShortAddress(address);
  const activeLocale = useActiveLocale();

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
    classes.whiteInfo,
    classes.coolInfo,
    classes.warmInfo,
    history,
  );

  const stateSelectedDropdownClass = usePickByState(
    classes.whiteInfoSelected,
    classes.dropdownActive,
    classes.dropdownActive,
    history,
  );

  const mobileTextColor = usePickByState(
    'rgba(140, 141, 146, 1)',
    'rgba(121, 128, 156, 1)',
    'rgba(142, 129, 127, 1)',
    history,
  );

  const mobileBorderColor = usePickByState(
    'rgba(140, 141, 146, .5)',
    'rgba(121, 128, 156, .5)',
    'rgba(142, 129, 127, .5)',
    history,
  );

  const connectWalletButtonStyle = usePickByState(
    NavBarButtonStyle.WHITE_WALLET,
    NavBarButtonStyle.COOL_WALLET,
    NavBarButtonStyle.WARM_WALLET,
    history,
  );

  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          classes.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={classes.button}>
          <div className={classes.icon}>
            {' '}
            <Davatar size={21} address={address} provider={provider} />
          </div>
          <div className={classes.address}>{ens ? ens : shortAddress}</div>
          <div className={buttonUp ? classes.arrowUp : classes.arrowDown}>
            <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />{' '}
          </div>
        </div>
      </div>
    </>
  ));

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
              classes.button,
              classes.switchWalletText,
              usePickByState(
                classes.whiteInfoSelectedTop,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
              ),
            )}
          >
            <Trans>Switch wallet</Trans>
          </div>

          <div
            onClick={disconectWalletHandler}
            className={clsx(
              classes.dropDownBottom,
              classes.button,
              usePickByState(
                classes.whiteInfoSelectedBottom,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
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

  const renderENS = (ens: string) => {
    if (activeLocale === 'ja-JP') {
      return veryShortENS(ens);
    }
    return shortENS(ens);
  };

  const renderAddress = (address: string) => {
    if (activeLocale === 'ja-JP') {
      return veryShortAddress(address);
    }
    return shortAddress;
  };

  const walletConnectedContentMobile = (
    <div className="d-flex flex-row justify-content-between">
      <div className={classes.connectContentMobileWrapper}>
        <div className={clsx(classes.wrapper, getNavBarButtonVariant(buttonStyle))}>
          <div className={classes.button}>
            <div className={classes.icon}>
              {' '}
              <Davatar size={21} address={address} provider={provider} />
            </div>
            <div className={classes.address}>{ens ? renderENS(ens) : renderAddress(address)}</div>
          </div>
        </div>
      </div>

      <div
        className={`d-flex flex-row ${classes.connectContentMobileText}`}
        style={{
          width: 'fit-content',
        }}
      >
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
  );

  const walletConnectedContentDesktop = (
    <Dropdown className={classes.nounsNavLink} onToggle={() => setButtonUp(!buttonUp)}>
      <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
      <Dropdown.Menu className={`${classes.desktopDropdown} `} as={CustomMenu} />
    </Dropdown>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={() => setModalStateHandler(false)} />
      )}
      {activeAccount ? (
        isMobileScreen() ? (
          walletConnectedContentMobile
        ) : (
          walletConnectedContentDesktop
        )
      ) : (
        <WalletConnectButton
          className={clsx(classes.nounsNavLink, classes.connectBtn)}
          onClickHandler={() => setModalStateHandler(true)}
          buttonStyle={connectWalletButtonStyle}
        />
      )}
    </>
  );
};

export default NavWallet;
