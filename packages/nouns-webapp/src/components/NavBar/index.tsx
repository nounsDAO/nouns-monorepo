import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useState } from 'react';
import { useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import clsx from 'clsx';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(false);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span>
            <ShortAddress>{activeAccount}</ShortAddress>
          </span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item
        className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
        onClick={() => {
          deactivate();
          setShowConnectModal(false);
        }}
      >
        DISCONNECT
      </Nav.Item>
    </>
  );

  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        CONNECT WALLET
      </Nav.Link>
    </>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
            <img
              src={logo}
              width="85"
              height="85"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              GOVERNANCE
            </Nav.Link>
            <Nav.Link href="playground" className={classes.nounsNavLink} target="_blank">
              PLAYGROUND
            </Nav.Link>
            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
