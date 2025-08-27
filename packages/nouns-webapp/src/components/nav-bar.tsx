'use client';

import { useState } from 'react';

import { faFile, faPenToSquare, faPlay, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { useReadNounsTreasuryBalancesInEth } from '@nouns/sdk/react/treasury';
import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
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
import { useIsDaoGteV3 } from '@/wrappers/nouns-dao';

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
    'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
    'bg-brand-surface-cool text-brand-cool-muted',
    'bg-brand-surface-warm text-brand-warm-muted',
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
        className={usePickByState(
          'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
          'bg-brand-surface-cool text-brand-cool-muted',
          'bg-brand-surface-warm text-brand-warm-muted',
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
        className="lg:mb-0 lg:mr-0 lg:pb-4"
        expanded={isNavExpanded}
      >
        <div className="mx-auto flex w-full max-w-none items-center justify-between border-0 border-solid border-neutral-200 px-4 leading-6 text-black md:max-w-screen-md xl:max-w-screen-xl">
          <div className="flex flex-row flex-nowrap items-center justify-center">
            <Navbar.Brand
              as={Link}
              href="/"
              className="relative z-20 py-2 transition-all duration-150 ease-in-out hover:scale-95"
            >
              <NogglesLogo className="lg-max:size-18 size-20" aria-label="Nouns DAO noggles" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                <img className="h-11 w-auto" src={testnetNoun.src} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance !== undefined ? (
                <Nav.Link
                  href={daoEtherscanLink}
                  className="font-pt p-0.3 text-15 font-bold text-black"
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
            className="rounded-10 mr-3 h-11 px-2 py-1"
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end z-10">
            <div className="xl-max:block hidden">
              <Nav.Link
                as={Link}
                href="/vote"
                className="font-pt p-0.3 text-15 font-bold text-black"
                onClick={closeNav}
              >
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
                      className="font-pt p-0.3 text-15 font-bold text-black"
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
            <div className="xl-max:hidden">
              {isDaoGteV3 ? (
                v3DaoNavItem
              ) : (
                <Nav.Link
                  as={Link}
                  href="/vote"
                  className="font-pt p-0.3 text-15 font-bold text-black"
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
            <div className="xl-max:block hidden">
              <Nav.Link
                as={Link}
                href="/playground"
                className="font-pt p-0.3 text-15 font-bold text-black"
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
                className="font-pt p-0.3 text-15 lg-max:[&_svg]:max-h-none lg-max:[&_svg]:min-h-10 lg-max:[&_svg]:max-w-10 font-bold text-black"
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
                className="font-pt p-0.3 text-15 lg-max:[&_svg]:max-h-none lg-max:[&_svg]:min-h-10 lg-max:[&_svg]:max-w-10 font-bold text-black"
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Traits</Trans>}
                  buttonIcon={<NogglesIcon />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
            </div>
            <div className="xl-max:hidden">
              <NavDropdown
                buttonText="Explore"
                buttonIcon={<NogglesIcon />}
                buttonStyle={nonWalletButtonStyle}
              >
                <Dropdown.Item
                  className={usePickByState(
                    'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
                    'bg-brand-surface-cool text-brand-cool-muted',
                    'bg-brand-surface-warm text-brand-warm-muted',
                  )}
                  href="/nouns"
                >
                  <Trans>Nouns</Trans>
                </Dropdown.Item>
                <Dropdown.Item
                  className={usePickByState(
                    'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
                    'bg-brand-surface-cool text-brand-cool-muted',
                    'bg-brand-surface-warm text-brand-warm-muted',
                  )}
                  href="/traits"
                >
                  <Trans>Traits</Trans>
                </Dropdown.Item>
                <Dropdown.Item
                  className={usePickByState(
                    'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
                    'bg-brand-surface-cool text-brand-cool-muted',
                    'bg-brand-surface-warm text-brand-warm-muted',
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
        </div>
      </Navbar>
    </>
  );
};

export default NavBar;
