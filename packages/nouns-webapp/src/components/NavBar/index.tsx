import { useAppSelector } from '../../hooks';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import NavBarItem from './NavBarItem';
import { useState } from 'react';
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const {deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(true);
  // USE TO PASS INTO CONNECT TO WALLET BUTTON
  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const connectedContent = (
    <>
      <NavBarItem>
        <a href="/playground" className={classes.playground} target="_blank" rel="noreferrer">
          PLAYGROUND
        </a>
      </NavBarItem>
      <NavBarItem className={classes.connectedBtn}>
        <ShortAddress>{activeAccount}</ShortAddress>
        <span className={classes.greenStatusCircle} />
      </NavBarItem>
      <NavBarItem onClick={() => {deactivate()}} className={classes.connectedBtn}>
        Disconnect
      </NavBarItem>
    </>
  );

  const disconnectedContent = (
    <>
    <NavBarItem className={classes.connectBtn} onClick={showModalHandler} >
      Connect Wallet
    </NavBarItem>
    </>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && <WalletConnectModal onDismiss={hideModalHandler} />}
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand href="#home" className={classes.navBarBrand}>
            <img
              src={logo}
              width="70"
              height="70"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
