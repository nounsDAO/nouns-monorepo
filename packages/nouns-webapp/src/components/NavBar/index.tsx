import { useAppSelector } from '../../hooks';
import { useEthers } from '@usedapp/core';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import testnetNoun from '../../assets/testnet-noun.png';
import { Nav, Navbar, Container } from 'react-bootstrap';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { activateBrowserWallet } = useEthers();

  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} href="governance" rel="noreferrer">
          GOVERNANCE
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} href="playground" target="_blank" rel="noreferrer">
          PLAYGROUND
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span><ShortAddress>activeAccount</ShortAddress></span>
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const disconnectedContent = (
    <Nav.Item className={classes.connectBtn} onClick={() => activateBrowserWallet()}>
      Connect Wallet
    </Nav.Item>
  );

  return (
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
          <Nav className={classes.nounsNav}>{activeAccount ? connectedContent : disconnectedContent}</Nav>
        </Navbar.Collapse>
            </Container>
      </Navbar>

  );
};

export default NavBar;
