import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import noggles from '../../assets/honey-noggles.svg';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { useTreasuryBalance } from '../../hooks/useTreasuryBalance';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const location = useLocation();
  const treasuryBalance = useTreasuryBalance();
  const daoEtherscanLink = buildEtherscanHoldingsLink(
    config.addresses.nounsDaoExecutorProxy || config.addresses.nounsDaoExecutor,
  );
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const isHomePage = location.pathname === '/' || location.pathname.includes('/noun/');
  const navBarBackgroundColor = isHomePage ? '#adebff' : 'white';

  const useStateBg =
    location.pathname === '/' ||
    location.pathname.includes('/noun/') ||
    location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
      ? NavBarButtonStyle.COOL_INFO
      : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor: navBarBackgroundColor }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={noggles} className={classes.navBarLogo} alt="Bouns DAO noggles" />
            </Navbar.Brand>
            {/* {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )} */}
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(2)}
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
            {/* <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
              <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
                <NavBarButton
                  buttonText={<Trans>{isDaoGteV3 ? 'Proposals' : 'DAO'}</Trans>}
                  buttonIcon={<FontAwesomeIcon icon={isDaoGteV3 ? faFile : faFile} />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
              {isDaoGteV3 && (
                <>
                  {config.featureToggles.candidates && (
                    <Nav.Link
                      as={Link}
                      to="/vote#candidates"
                      className={classes.nounsNavLink}
                      onClick={closeNav}
                    >
                      <NavBarButton
                        buttonText={<Trans>Candidates</Trans>}
                        buttonIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        buttonStyle={nonWalletButtonStyle}
                      />
                    </Nav.Link>
                  )}
                  {config.featureToggles.fork && (
                    <Nav.Link
                      as={Link}
                      to="/fork"
                      className={classes.nounsNavLink}
                      onClick={closeNav}
                    >
                      <NavBarButton
                        buttonText={<Trans>Fork</Trans>}
                        buttonIcon={<FontAwesomeIcon icon={faCodeFork} />}
                        buttonStyle={nonWalletButtonStyle}
                      />
                    </Nav.Link>
                  )}
                </>
              )}
            </div> */}
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
                  <NavBarButton
                    buttonText={<Trans>Proposals</Trans>}
                    buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
            {/* <Nav.Link
              href={externalURL(ExternalURL.nounsCenter)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Docs</Trans>}
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
            </Nav.Link> */}
            {/* <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
              <Nav.Link
                as={Link}
                to="/playground"
                className={classes.nounsNavLink}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Playground</Trans>}
                  buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/explore"
                className={clsx(classes.nounsNavLink, classes.exploreButton)}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Nouns &amp; Traits</Trans>}
                  buttonIcon={<Noggles />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
            </div> */}
            {/* <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
              <NavDropdown
                buttonText="Explore"
                buttonIcon={<Noggles />}
                buttonStyle={nonWalletButtonStyle}
              >
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                      history,
                    ),
                  )}
                  href="/explore"
                >
                  Nouns &amp; Traits
                </Dropdown.Item>
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                      history,
                    ),
                  )}
                  href="/playground"
                >
                  Playground
                </Dropdown.Item>
              </NavDropdown>
            </div> */}
            {/* <NavLocaleSwitcher buttonStyle={nonWalletButtonStyle} /> */}
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
