import React, { HTMLAttributes, useState } from 'react';

import { cn } from '@/lib/utils';
import { Dropdown } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { usePickByState } from '@/utils/color-responsive-ui-utils';

import classes from './nav-dropdown.module.css';

import navDropdownClasses from '@/components/nav-bar/nav-bar-dropdown.module.css';
import responsiveUiUtilsClasses from '@/utils/responsive-ui-utils.module.css';

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

  const customDropdownToggle = ({
    ref,
    onClick,
  }: HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
    <>
      <div
        ref={ref}
        className={cn(classes.wrapper)}
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
  );

  customDropdownToggle.displayName = 'CustomDropdownToggle';

  return (
    <>
      <Dropdown
        className={cn(
          classes.dropdownButton,
          navDropdownClasses.nounsNavLink,
          responsiveUiUtilsClasses.desktopOnly,
        )}
        onToggle={() => setButtonUp(!buttonUp)}
        autoClose={true}
      >
        <Dropdown.Toggle as={customDropdownToggle} id="dropdown" />
        <Dropdown.Menu
          className={cn(
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
