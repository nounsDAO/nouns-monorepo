import React from 'react';
import { Nav } from 'react-bootstrap';
import NavBarButton, { NavBarButtonStyle } from '../../NavBarButton';

interface WalletConnectButtonProps {
  className: string;
  onClickHandler: () => void;
  buttonStyle: NavBarButtonStyle;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = props => {
  const { className, onClickHandler, buttonStyle } = props;
  return (
    <Nav.Link className={className} onClick={onClickHandler}>
      <NavBarButton buttonStyle={buttonStyle} buttonText={'Connect'} />
    </Nav.Link>
  );
};

export default WalletConnectButton;
