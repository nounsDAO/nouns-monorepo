import { useState } from 'react';

import { faFile, faPenToSquare, faPlay, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { useReadNounsTreasuryBalancesInEth } from '@nouns/sdk/react/treasury';
import clsx from 'clsx';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { formatEther } from 'viem';

import NogglesIcon from '@/assets/icons/Noggles.svg?react';
import NogglesLogo from '@/assets/noggles.svg?react';
import testnetNoun from '@/assets/testnet-noun.png';
import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import NavBarTreasury from '@/components/nav-bar-treasury';
import NavDropdown from '@/components/nav-dropdown';
import NavLocaleSwitcher from '@/components/nav-locale-switcher';
import ShortAddress from '@/components/short-address';
import config, { CHAIN_ID } from '@/config';
import { nounsTreasuryAddress } from '@/contracts';
import { useAppSelector } from '@/hooks';
import { usePickByState } from '@/utils/color-responsive-ui-utils';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { defaultChain } from '@/wagmi';
import { useIsDaoGteV3 } from '@/wrappers/nounsDao';

import navDropdownClasses from './nav-bar-dropdown.module.css';
import classes from './nav-bar.module.css';

import responsiveUiUtilsClasses from '@/utils/responsive-ui-utils.module.css';

const NavBar = () => {
  const chainId = defaultChain.id;
  const isDaoGteV3 = useIsDaoGteV3();
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const pathname = usePathname();
  const treasuryBalance = useReadNounsTreasuryBalancesInEth({
    query: {
      select: data => {
        console.log(data);
        return data.total;
      },
    },
  }).data;
  const daoEtherscanLink = buildEtherscanAddressLink(nounsTreasuryAddress[chainId]);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const safePathname = pathname ?? '';
  const useStateBg =
    safePathname === '/' || safePathname.includes('/noun/') || safePathname.includes('/auction/');

  const stateBasedButtonStyle = isCool ? NavBarButtonStyle.COOL_INFO : NavBarButtonStyle.WARM_INFO;

  const nonWalletButtonStyle = !useStateBg ? NavBarButtonStyle.WHITE_INFO : stateBasedButtonStyle;

  const closeNav = () => setIsNavExpanded(false);
  const buttonClasses = usePickByState(
    navDropdownClasses.whiteInfoSelectedBottom,
    navDropdownClasses.coolInfoSelected,
    navDropdownClasses.warmInfoSelected,
  );
  const candidatesNavItem = config.featureToggles.candidates ? (
    <Dropdown.Item className={buttonClasses} href="/vote#candidates">
      <Trans>Candidates</Trans>
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
          ),
        )}
        href="/vote"
      >
        <Trans>Proposals</Trans>
      </Dropdown.Item>
      {candidatesNavItem}
    </NavDropdown>
  );

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
            <Link href="/packages/nouns-webapp/public" className={classes.navBarBrand}>
              <Navbar.Brand>
                <NogglesLogo className={classes.navBarLogo} aria-label="Nouns DAO noggles" />
              </Navbar.Brand>
            </Link>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun.src} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance !== undefined ? (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(formatEther(treasuryBalance)).toFixed(0)}
                    treasuryStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              ) : null}
            </Nav.Item>
          </div>
          <Navbar.Toggle
            className={classes.navBarToggle}
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end z-10">
            <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
              <Nav.Link as={Link} href="/vote" className={classes.nounsNavLink} onClick={closeNav}>
                <NavBarButton
                  buttonText={isDaoGteV3 ? <Trans>Proposals</Trans> : <Trans>DAO</Trans>}
                  buttonIcon={<FontAwesomeIcon icon={faFile} />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
              {isDaoGteV3 && (
                <>
                  {config.featureToggles.candidates && (
                    <Nav.Link
                      as={Link}
                      href="/vote#candidates"
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
                </>
              )}
            </div>
            <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
              {isDaoGteV3 ? (
                v3DaoNavItem
              ) : (
                <Nav.Link
                  as={Link}
                  href="/vote"
                  className={classes.nounsNavLink}
                  onClick={closeNav}
                >
                  <NavBarButton
                    buttonText={<Trans>DAO</Trans>}
                    buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                    buttonStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </div>
            <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
              <Nav.Link
                as={Link}
                href="/playground"
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
                href="/nouns"
                className={clsx(classes.nounsNavLink, classes.exploreButton)}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Nouns</Trans>}
                  buttonIcon={<NogglesIcon />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/traits"
                className={clsx(classes.nounsNavLink, classes.exploreButton)}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Traits</Trans>}
                  buttonIcon={<NogglesIcon />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
            </div>
            <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
              <NavDropdown
                buttonText="Explore"
                buttonIcon={<NogglesIcon />}
                buttonStyle={nonWalletButtonStyle}
              >
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                    ),
                  )}
                  href="/nouns"
                >
                  <Trans>Nouns</Trans>
                </Dropdown.Item>
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                    ),
                  )}
                  href="/traits"
                >
                  <Trans>Traits</Trans>
                </Dropdown.Item>
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                    ),
                  )}
                  href="/playground"
                >
                  Playground
                </Dropdown.Item>
              </NavDropdown>
            </div>
            <NavLocaleSwitcher buttonStyle={nonWalletButtonStyle} />
            <ConnectKitButton.Custom>
              {({ isConnected, show, address }) => {
                if (!isConnected)
                  return (
                    <NavBarButton
                      buttonText="Connect"
                      buttonStyle={nonWalletButtonStyle}
                      onClick={show}
                    />
                  );
                return (
                  <NavBarButton
                    buttonText={<ShortAddress address={address!} avatar={true} size={24} />}
                    buttonStyle={nonWalletButtonStyle}
                    onClick={show}
                  />
                );
              }}
            </ConnectKitButton.Custom>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
