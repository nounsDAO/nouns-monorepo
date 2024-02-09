import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import brand from '../../assets/sonshou.svg';
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
import { faBookOpen, faCodeFork, faFile, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import NavLocaleSwitcher from '../NavLocaleSwitcher';
import NavDropdown from '../NavDropdown';
import { Dropdown } from 'react-bootstrap';
import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import { ReactComponent as Noggles } from '../../assets/icons/Noggles.svg';
import { useTreasuryBalance } from '../../hooks/useTreasuryBalance';
import clsx from 'clsx';
import { useIsDaoGteV3 } from '../../wrappers/nounsDao';

const NavBar = () => {
  const isDaoGteV3 = useIsDaoGteV3();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const treasuryBalance = useTreasuryBalance();
  const daoEtherscanLink = buildEtherscanHoldingsLink(
    config.addresses.nounsDaoExecutorProxy || config.addresses.nounsDaoExecutor,
  );
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const exploreUri = config.app.exploreUri;

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
  const buttonClasses = usePickByState(
    navDropdownClasses.whiteInfoSelectedBottom,
    navDropdownClasses.coolInfoSelected,
    navDropdownClasses.warmInfoSelected,
    history,
  );
  const candidatesNavItem = config.featureToggles.candidates ? (
    <Dropdown.Item className={buttonClasses} href="/vote#candidates">
      <Trans>Candidates</Trans>
    </Dropdown.Item>
  ) : null;
  const forkNavItem = config.featureToggles.fork ? (
    <Dropdown.Item className={buttonClasses} href="/fork">
      <Trans>Fork</Trans>
    </Dropdown.Item>
  ) : null;

  const v3DaoNavItem = (
    <NavDropdown
      buttonText="DAO"
      buttonIcon={<FontAwesomeIcon icon={faUsers} />}
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
        href="/vote"
      >
        <Trans>Proposals</Trans>
      </Dropdown.Item>
      {candidatesNavItem}
      {forkNavItem}
    </NavDropdown>
  );

  const backgroundColor = config.isProduction ? `${useStateBg ? stateBgColor : 'white'}` : 'orange'

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={brand} className={classes.navBarLogo} alt="Nouns DAO noggles" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={treasuryBalance}
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
            <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
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
            </div>
            <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
              {isDaoGteV3 ? (
                v3DaoNavItem
              ) : (
                <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
                  <NavBarButton
                    buttonText={<Trans>DAO</Trans>}
                    buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </div>
            <Nav.Link
              href={externalURL(ExternalURL.document)}
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
            <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
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
                href={exploreUri}
                target="_blank"
                className={clsx(classes.nounsNavLink, classes.exploreButton)}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Nouns &amp; Traits</Trans>}
                  buttonIcon={<Noggles />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
            </div>
            <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
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
                  href={exploreUri}
                  target="_blank"
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
            </div>
            <NavLocaleSwitcher buttonStyle={nonWalletButtonStyle} />
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
