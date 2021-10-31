import { useAppSelector } from '../../hooks';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useState } from 'react';
import { useEtherBalance, useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import clsx from 'clsx';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanAddressLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const history = useHistory();
  const treasuryBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const daoEtherscanLink = buildEtherscanAddressLink(config.addresses.nounsDaoExecutor);

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
        <Nav.Link className={clsx(classes.nounsNavLink, classes.addressNavLink)} disabled>
          <span className={classes.greenStatusCircle} />
          <span>{activeAccount && <ShortAddress address={activeAccount} avatar={true} />}</span>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
          onClick={() => {
            setShowConnectModal(false);
            deactivate();
            setShowConnectModal(false);
          }}
        >
          DISCONNECT
        </Nav.Link>
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

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun') ||
    history.location.pathname.includes('/auction');

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <Navbar expand="lg" style={{ backgroundColor: `${useStateBg ? stateBgColor : ''}` }}>
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
          {Number(CHAIN_ID) !== 1 && (
            <Nav.Item>
              <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
              TESTNET
            </Nav.Item>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  TREASURY Ξ {Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                </Nav.Link>
              )}
            </Nav.Item>
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              DAO
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.notion)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              DOCS
            </Nav.Link>
            <Nav.Link as={Link} to="/playground" className={classes.nounsNavLink}>
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
