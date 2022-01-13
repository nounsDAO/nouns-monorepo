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
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import useLidoBalance from '../../hooks/useLidoBalance';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from "../NavBarTreasury";

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();

  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const history = useHistory();
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);

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

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun') ||
    history.location.pathname.includes('/auction');
  
  const greyBg = '#d5d7e1';

  const nonWalletButtonStyle = !useStateBg ? NavBarButtonStyle.WHITE_INFO : (
    stateBgColor === greyBg ? NavBarButtonStyle.COOL_INFO : NavBarButtonStyle.WARM_INFO 
  );


  const disconnectedContent = (
    <>
      <Nav.Link
        className={clsx(classes.nounsNavLink, classes.connectBtn)}
        onClick={showModalHandler}
      >
        <NavBarButton buttonStyle = {
          useStateBg && stateBgColor === greyBg ? NavBarButtonStyle.COOL_WALLET: NavBarButtonStyle.WARM_WALLET 
        } 
        buttonText={'Connect wallet'}
        />
      </Nav.Link>
    </>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <Navbar expand="lg" style={{ backgroundColor: `${useStateBg ? stateBgColor : ''}` }}>
        <Container>
          <Navbar.Brand className={classes.navBarBrand} >
          <div className="d-flex justify-content-between align-items-center ">
            <Link to={"/"}>
            <img
              src={logo}
              width="85"
              height="85"
              className="d-inline-block align-middle"
              alt="Nouns DAO logo"
            />
            </Link>
            {treasuryBalance && useStateBg && (
              <Nav.Link
                href={daoEtherscanLink}
                target="_blank"
                rel="noreferrer"
              >
                <NavBarTreasury treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)} isWarmStyle={stateBgColor !== greyBg}/>
              </Nav.Link>
            )}
          </div>
          </Navbar.Brand>
          {Number(CHAIN_ID) !== 1 && (
            <Nav.Item>
              <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
              TESTNET
            </Nav.Item>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              <NavBarButton 
              buttonText = {'DAO'}
              buttonIcon = {(
                <FontAwesomeIcon icon={faUsers} />
              )}
              buttonStyle={
                nonWalletButtonStyle
              }
              />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.notion)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
                <NavBarButton 
                buttonText = {'Docs'}
                buttonIcon = {(
                  <FontAwesomeIcon icon={faBookOpen} />
                )}
                buttonStyle={
                  nonWalletButtonStyle
                }
                />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.discourse)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavBarButton 
                buttonText = {'Discourse'}
                buttonIcon = {(
                  <FontAwesomeIcon icon={faComments} />
                )}
                buttonStyle={
                  nonWalletButtonStyle
                }
                />
            </Nav.Link>
            <Nav.Link as={Link} to="/playground" className={classes.nounsNavLink}>
              <NavBarButton 
                  buttonText = {'Playground'}
                  buttonIcon = {(
                    <FontAwesomeIcon icon={faPlay} />
                  )}
                  buttonStyle={
                    nonWalletButtonStyle
                  }
                  /> 
            </Nav.Link>
            {activeAccount ? connectedContent : disconnectedContent}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
