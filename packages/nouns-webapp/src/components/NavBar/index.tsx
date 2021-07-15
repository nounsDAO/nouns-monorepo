import { useAppSelector } from '../../hooks';
import { useEthers } from '@usedapp/core';
import { Container } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { activateBrowserWallet } = useEthers();

  const connectedContent = activeAccount ? (
    <div className={classes.connectedDiv}>
      <ShortAddress>{activeAccount}</ShortAddress>
    </div>
  ) : (
    <button className={classes.connectButton} onClick={() => activateBrowserWallet()}>
      Connect Wallet
    </button>
  );

  return (
    <Container>
      <Navbar bg="transparent" expand="lg">
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="70"
            height="70"
            className="d-inline-block align-middle"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        {connectedContent}
      </Navbar>
    </Container>
  );
};

export default NavBar;
