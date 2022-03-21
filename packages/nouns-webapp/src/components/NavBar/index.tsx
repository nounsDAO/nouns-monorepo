import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useEtherBalance } from '@usedapp/core';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
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
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { black } from '../../utils/nounBgColors';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const lidoBalanceAsETH = useLidoBalance();
  const treasuryBalance = ethBalance && lidoBalanceAsETH && ethBalance.add(lidoBalanceAsETH);
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);

  const useStateBg =
    // history.location.pathname === '/' ||
    history.location.pathname.includes('/noun/') || history.location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  return (
    <>
      <Navbar expand="lg" style={{ backgroundColor: black }} className={classes.navBarCustom}>
        <Container fluid={'xxl'}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/">
              <h1 className={classes.logo}> CC:0 </h1>
            </Navbar.Brand>
          </div>
          <Navbar.Toggle className={classes.navBarToggle} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
              <NavBarButton
                buttonText={'Read the Documentation'}
                buttonStyle={NavBarButtonStyle.LINK}
              />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.notion)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavBarButton buttonText={'Contribute CC0'} buttonStyle={NavBarButtonStyle.LINK} />
            </Nav.Link>
            <Nav.Link
              href={externalURL(ExternalURL.discourse)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              <NavBarButton buttonText={'Join the DAO'} buttonStyle={NavBarButtonStyle.LINK} />
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/playground" className={classes.nounsNavLink}>
              <NavBarButton
                buttonText={'Playground'}
                buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link> */}
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
