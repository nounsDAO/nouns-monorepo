import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.png';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { ExternalURL, externalURL } from '../../utils/externalURL';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
import NavLocaleSwitcher from '../NavLocaleSwitcher';
import NavDropdown from '../NavDropdown';
import { Dropdown } from 'react-bootstrap';
import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import { ReactComponent as Noggles } from '../../assets/icons/Noggles.svg';
import { useTreasuryBalance } from '../../hooks/useTreasuryBalance';
import clsx from 'clsx';
import { AtxDaoNFT, useCall } from '../../wrappers/atxDaoNFT';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const treasuryBalance = useTreasuryBalance();
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  let balanceArr = useCall('balanceOf', [activeAccount]);
  let balance;
  if (balanceArr !== undefined) {
    balance = balanceArr[0].toNumber();
  }

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/noun/') ||
    history.location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);

  let output;
  console.log(activeAccount);

if (activeAccount !== undefined) {
  if (balance > 0) {
    output = <div><Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
    <NavBarButton
      buttonText={<Trans>Proposals</Trans>}
      buttonIcon={<FontAwesomeIcon icon={faUsers} />}
      buttonStyle={nonWalletButtonStyle}
    />
  </Nav.Link>
  <Nav.Link
    href={externalURL(ExternalURL.charmverse)}
    className={classes.nounsNavLink}
    target="_blank"
    rel="noreferrer"
    onClick={closeNav}
  >
    <NavBarButton
      buttonText={"Docs"}
      buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
      buttonStyle={nonWalletButtonStyle}
    />
  </Nav.Link>
  <Nav.Link
    href={externalURL(ExternalURL.discourse)}
    className={classes.nounsNavLink}
    target="_blank"
    rel="noreferrer"
    onClick={closeNav}
  >
    <NavBarButton
      buttonText={<Trans>Discourse</Trans>}
      buttonIcon={<FontAwesomeIcon icon={faComments} />}
      buttonStyle={nonWalletButtonStyle}
    />
  </Nav.Link>
  <Nav.Link as={Link} to="/rep" className={classes.nounsNavLink} onClick={closeNav}>
    <NavBarButton
      buttonText={<Trans>REP</Trans>}
      buttonIcon={<FontAwesomeIcon icon={faCoins} />}
      buttonStyle={nonWalletButtonStyle}
    />
  </Nav.Link></div>
  }
}

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={logo} className={classes.navBarLogo} alt="ATX DAO Logo" />
            </Navbar.Brand>
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                    treasuryStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </Nav.Item>
          </div>
          <Navbar.Toggle
            className={classes.navBarToggle}
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">
            { output }
          </Navbar.Collapse>
          <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
