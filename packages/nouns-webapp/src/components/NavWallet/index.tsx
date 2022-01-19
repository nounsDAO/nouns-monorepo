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
import { Nav } from 'react-bootstrap';
import NavBarButton from '../NavBarButton';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useShortAddress } from '../ShortAddress';
import { isMobileScreen } from '../../utils/isMobile';
import {
  shouldUseStateBg,
  useIsCoolState,
  usePickByState,
} from '../../utils/colorResponsiveUIUtils';

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

  const history = useHistory();
  const { library: provider } = useEthers();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(false);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const ens = useReverseENSLookUp(address);
  const shortAddress = useShortAddress(address);

  const useStateBg = shouldUseStateBg(history);

  const isCoolState = useIsCoolState();

  const mobileTextColor = () => {
    if (!useStateBg) {
      return 'rgba(140, 141, 146, 1)';
    }
    if (isCoolState) {
      return 'rgba(121, 128, 156, 1)';
    }
    return 'rgba(142, 129, 127, 1)';
  };

  const mobileBorderColor = () => {
    if (!useStateBg) {
      return 'rgba(140, 141, 146, .5)';
    }
    if (isCoolState) {
      return 'rgba(121, 128, 156, .5)';
    }
    return 'rgba(142, 129, 127, .5)';
  };

  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        <NavBarButton
          buttonStyle={usePickByState(
            NavBarButtonStyle.WHITE_WALLET,
            NavBarButtonStyle.COOL_WALLET,
            NavBarButtonStyle.WARM_WALLET,
            history,
          )}
          buttonText={'Connect'}
        />
      </Nav.Link>
    </>
  );

  const statePrimaryButtonClass = usePickByState(
    classes.whiteInfo,
    classes.coolInfo,
    classes.warnInfo,
    history,
  );

  const stateSelectedDropdownClass = usePickByState(
    classes.whiteInfoSelected,
    classes.dropdownActive,
    classes.dropdownActive,
    history,
  );

  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={`${classes.wrapper} ${
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass
        }`}
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
          <div>{ens ? ens : shortAddress}</div>
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
            onClick={() => {
              setShowConnectModal(false);
              setButtonUp(false);
              deactivate();
              setShowConnectModal(false);
              setShowConnectModal(true);
            }}
            style={{
              borderRadius: '12px 12px 0px 0px',
              paddingTop: '.5rem',
              paddingLeft: '1rem',
              justifyContent: 'flex-start',
              width: '8.4rem',
              paddingBottom: '.25rem',
            }}
            className={`${classes.button} ${classes.switchWalletText} ${usePickByState(
              classes.whiteInfoSelectedTop,
              classes.coolInfoSelected,
              classes.warnInfoSelected,
              history,
            )}`}
          >
            Switch Wallet
          </div>

          <div
            onClick={() => {
              setShowConnectModal(false);
              setButtonUp(false);
              deactivate();
            }}
            style={{
              borderRadius: '0px 0px 12px 12px',
              paddingBottom: '.5rem',
              paddingLeft: '1rem',
              justifyContent: 'flex-start',
              color: 'var(--brand-color-red)',
              width: '8.4rem',
            }}
            className={`${classes.button} ${usePickByState(
              classes.whiteInfoSelectedBottom,
              classes.coolInfoSelected,
              classes.warnInfoSelected,
              history,
            )} ${classes.disconnectText} `}
          >
            Disconnect
          </div>
        </div>
      </div>
    );
  });

  const connectedContentMobile = (
    <div className="d-flex flex-row justify-content-between">
      <div className={classes.connectContentMobileWrapper}>
        <div className={`${classes.wrapper} ${getNavBarButtonVariant(buttonStyle)}`}>
          <div className={classes.button}>
            <div className={classes.icon}>
              {' '}
              <Davatar size={21} address={address} provider={provider} />
            </div>
            <div>{ens ? ens : shortAddress}</div>
          </div>
        </div>
      </div>

      <div className={`d-flex flex-row ${classes.connectContentMobileText}`}>
        <div
          style={{
            borderRight: `1px solid ${mobileBorderColor()}`,
            color: mobileTextColor(),
          }}
          className={classes.mobileSwitchWalletText}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
            setShowConnectModal(true);
          }}
        >
          Swtich
        </div>
        <div
          className={classes.disconnectText}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
          }}
        >
          Disconnect
        </div>
      </div>
    </div>
  );

  const connectedContentDesktop = (
    <Dropdown className={classes.nounsNavLink} onToggle={() => setButtonUp(!buttonUp)}>
      <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
      <div className={classes.menuWrapper}>
        <Dropdown.Menu className={`${classes.desktopDropdown} `} as={CustomMenu} />
      </div>
    </Dropdown>
  );

  const getConnectedContent = () => {
    return isMobileScreen() ? connectedContentMobile : connectedContentDesktop;
  };

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      {activeAccount ? getConnectedContent() : disconnectedContent}
    </>
  );
};

export default NavWallet;
