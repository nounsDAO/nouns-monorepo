import React, { HTMLAttributes, useState } from 'react';

import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/NavBarButton';
import { usePickByState } from '@/utils/colorResponsiveUIUtils';

import classes from './NavDropdown.module.css';

import navDropdownClasses from '@/components/NavBar/NavBarDropdown.module.css';
import responsiveUiUtilsClasses from '@/utils/ResponsiveUIUtils.module.css';

interface NavDropDownProps {
  buttonStyle?: NavBarButtonStyle;
  buttonIcon?: React.ReactNode;
  buttonText: string;
  children: React.ReactNode;
}

const NavDropDown: React.FC<NavDropDownProps> = props => {
  const { buttonStyle } = props;

  const [buttonUp, setButtonUp] = useState(false);

  const statePrimaryButtonClass = usePickByState(
    navDropdownClasses.whiteInfo,
    navDropdownClasses.coolInfo,
    navDropdownClasses.warmInfo,
  );

  const stateSelectedDropdownClass = usePickByState(
    navDropdownClasses.whiteInfoSelected,
    navDropdownClasses.dropdownActive,
    navDropdownClasses.dropdownActive,
  );

  const customDropdownToggle = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ onClick }, ref) => (
      <>
        <div
          ref={ref}
          className={clsx(classes.wrapper)}
          onClick={e => {
            e.preventDefault();
            onClick?.(e);
          }}
        >
          <NavBarButton
            buttonText={props.buttonText}
            buttonIcon={props.buttonIcon}
            buttonStyle={buttonStyle}
            isDropdown={true}
            isButtonUp={buttonUp}
          />
        </div>
      </>
    ),
  );

  customDropdownToggle.displayName = 'CustomDropdownToggle';

  return (
    <>
      <Dropdown
        className={clsx(
          classes.dropdownButton,
          navDropdownClasses.nounsNavLink,
          responsiveUiUtilsClasses.desktopOnly,
        )}
        onToggle={() => setButtonUp(!buttonUp)}
        autoClose={true}
      >
        <Dropdown.Toggle as={customDropdownToggle} id="dropdown" />
        <Dropdown.Menu
          className={clsx(
            classes.menu,
            stateSelectedDropdownClass,
            buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
          )}
        >
          {props.children}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default NavDropDown;
