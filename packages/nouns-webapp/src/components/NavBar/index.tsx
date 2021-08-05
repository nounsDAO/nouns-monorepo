import { useAppSelector } from '../../hooks';
import { useEthers } from '@usedapp/core';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import NavBarItem from './NavBarItem';
import { useState } from 'react';
import WalletConnectModal from '../WalletConnectModal';
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import {FortmaticConnector} from "@web3-react/fortmatic-connector"
import config from '../../config';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { activateBrowserWallet, activate, deactivate } = useEthers();

  const [showConnectModal, setShowConnectModal] = useState(true);
  // USE TO PASS INTO CONNECT TO WALLET BUTTON
  // const showModalHandler = () => {
  //   setShowConnectModal(true);
  // };
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
    <NavBarItem className={classes.connectBtn} onClick={() => {
      const injected = new InjectedConnector({ supportedChainIds: config.supportedChainIds })
      activate(injected)
    }}>
      Connect Wallet
    </NavBarItem>
    <NavBarItem className={classes.connectBtn} onClick={() => {
      const walletlink = new WalletLinkConnector({
        appName:"Nouns.WTF",
        appLogoUrl:"https://nouns.wtf/static/media/logo.cdea1650.svg",
        url: config.rinkebyJsonRpc,
        supportedChainIds: config.supportedChainIds
        })
        activate(walletlink)
    }}>
      WalletLink
    </NavBarItem>
    <NavBarItem className={classes.connectBtn} onClick={async () => {
      const fortmatic = new FortmaticConnector({
         apiKey:"pk_test_FB5E5C15F2EC5AE6",
         chainId: 4
        })
        activate(fortmatic)
    }}>
      Fortmatic
    </NavBarItem>
    </>
  );

  return (
    <>
      {showConnectModal && <WalletConnectModal onDismiss={hideModalHandler} />}
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
