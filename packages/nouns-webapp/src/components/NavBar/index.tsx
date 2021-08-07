import { useAppSelector } from '../../hooks';
import { useEthers } from '@usedapp/core';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { activateBrowserWallet } = useEthers();

  const connectedContent = (
    <>
      <Nav.Item>
        <Nav.Link className={classes.nounsNavLink} disabled>
          <span className={classes.greenStatusCircle} />
          <span>
            <ShortAddress>{activeAccount}</ShortAddress>
          </span>
        </Nav.Link>
      </Nav.Item>
    </>
  );

  const disconnectedContent = (
    <Nav.Link className={classes.nounsNavLink} onClick={() => activateBrowserWallet()}>
      CONNECT WALLET
    </Nav.Link>
  );

  return (
    <Navbar expand="lg">
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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink}>
            GOVERNANCE
          </Nav.Link>
          <Nav.Link href="playground" className={classes.nounsNavLink} target="_blank">
            PLAYGROUND
          </Nav.Link>
          {activeAccount ? connectedContent : disconnectedContent}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
