import React from "react";
import { Nav } from "react-bootstrap";
import NavBarButton, { NavBarButtonStyle } from "../../NavBarButton";

interface LocaleSwitcherButtonProps {
    className: string;
    onClickHandler: () => void;
    buttonStyle: NavBarButtonStyle;
};

const LocaleSwitcherButton: React.FC<LocaleSwitcherButtonProps> = props => {
    const { className, onClickHandler, buttonStyle } = props;
    return (
      <Nav.Link className={className} onClick={onClickHandler}>
        <NavBarButton buttonStyle={buttonStyle} buttonText={'Connect'} />
      </Nav.Link>
    );
};

export default LocaleSwitcherButton;