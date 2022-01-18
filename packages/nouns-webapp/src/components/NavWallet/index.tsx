import Davatar from '@davatar/react';
import { useEthers } from '@usedapp/core';
import React, { useState } from 'react';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { NavBarButtonStyle } from '../NavBarButton';
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

interface NavWalletProps {
  address: string;
  buttonStyle?: NavBarButtonStyle;
}

const NavWallet: React.FC<NavWalletProps> = props => {
  const { address, buttonStyle } = props;
  const [buttonUp, setButtonUp] = useState(false);

  const variant = () => {
    switch (buttonStyle) {
      case NavBarButtonStyle.COOL_INFO: {
        return classes.coolInfo;
      }
      case NavBarButtonStyle.COOL_WALLET: {
        return classes.coolWallet;
      }
      case NavBarButtonStyle.WARM_INFO: {
        return classes.warnInfo;
      }
      case NavBarButtonStyle.WARM_WALLET: {
        return classes.warmWallet;
      }
      case NavBarButtonStyle.WHITE_INFO: {
        return classes.whiteInfo;
      }
      case NavBarButtonStyle.WHITE_ACTIVE: {
        return classes.whiteActive;
      }
      default: {
        return classes.info;
      }
    }
  };
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
  const shortAddress = address && [address.substr(0, 4), address.substr(38, 4)].join('...');

  type Props = {
    onClick: (e: any) => void;
    value: string;
  };

  type RefType = number;

  const CustomToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={`${classes.wrapper} ${variant()}`}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={classes.button} onClick={() => setButtonUp(!buttonUp)}>
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

  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun') ||
    history.location.pathname.includes('/auction');

  const greyBg = '#d5d7e1';

  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        <NavBarButton
          buttonStyle={
            useStateBg && stateBgColor === greyBg
              ? NavBarButtonStyle.COOL_WALLET
              : NavBarButtonStyle.WARM_WALLET
          }
          buttonText={'Connect wallet'}
        />
      </Nav.Link>
    </>
  );

  const connectedContent = () => {
    if(window.innerWidth < 992) {
        return connectedContentMobile;
    }
    return connectedContentDesktop;
   };

  const mobileTextColor = () => {

    if(!useStateBg) {
        return 'rgba(140, 141, 146, 1)';
    }
    if (stateBgColor === greyBg) {
        return 'rgba(121, 128, 156, 1)';
    }
    return 'rgba(142, 129, 127, 1)'
  };


  const mobileBorderColor = () => {

    if(!useStateBg) {
        return 'rgba(140, 141, 146, .5)';
    }
    if (stateBgColor === greyBg) {
        return 'rgba(121, 128, 156, .5)';
    }
    return 'rgba(142, 129, 127, .5)'
  };

  const connectedContentMobile = (
      <div className="d-flex flex-row justify-content-between">
          <div style={{
              marginLeft: '.25rem',
              marginTop: '.3rem'
          }}>
                    <div
                    className={`${classes.wrapper} ${variant()}`}
                    >
                    <div className={classes.button} >
                    <div className={classes.icon}>
                        {' '}
                        <Davatar size={21} address={address} provider={provider} />
                    </div>
                    <div>{ens ? ens : shortAddress}</div>
                    </div>
                </div>  
          </div>

          <div style={{
              fontFamily: "PT Root UI Bold",
              fontSize: "18px",
              marginRight: '2.25rem',
              marginTop: '1rem',
              height: '2rem'
          }} className="d-flex flex-row">
              <div style={{borderRight: `1px solid ${mobileBorderColor()}`, marginRight: '1rem', paddingRight: '1rem', color: mobileTextColor()}} onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
            setShowConnectModal(true);
          }}>
                  Swtich
              </div>
              <div style={{color: 'var(--brand-color-red)'}} onClick={() => {
            setShowConnectModal(false);
            deactivate();
          }}>
                  Disconnect
              </div>
          </div>
      </div>

  );

  const connectedContentDesktop = (
    <Dropdown className={classes.nounsNavLink}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Custom toggle
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          borderRadius: '12px',
          marginTop: '.5rem',
          border: '0',
        }}
        className={`${variant()}`}
      >
        <Dropdown.Item
          eventKey="1"
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
            setShowConnectModal(true);
          }}
        >
          Switch wallet
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="2"
          style={{ color: 'var(--brand-color-red' }}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
          }}
        >
          Disconnect
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      {activeAccount ? connectedContent() : disconnectedContent}
    </>
  );
};

export default NavWallet;
