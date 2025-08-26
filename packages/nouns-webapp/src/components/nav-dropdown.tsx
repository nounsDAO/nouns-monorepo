import React, { HTMLAttributes, useState } from 'react';

import { Dropdown } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { cn } from '@/lib/utils';
import { usePickByState } from '@/utils/color-responsive-ui-utils';

import navDropdownClasses from '@/components/nav-bar/nav-bar-dropdown.module.css';
// responsiveUiUtilsClasses usage replaced by Tailwind responsive utilities

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
        className={cn(
          'font-pt h-10 rounded-[10px] p-0 text-base font-bold leading-4 shadow-none transition-all duration-150 ease-in-out',
        )}
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
        className={cn(navDropdownClasses.nounsNavLink, 'xl-max:hidden')}
        onToggle={() => setButtonUp(!buttonUp)}
        autoClose={true}
      >
        <Dropdown.Toggle as={customDropdownToggle} id="dropdown" />
        <Dropdown.Menu
          className={cn(
            '!left-[5px] m-0 overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.1)] p-0 [&>a:hover]:bg-white [&>a:last-child]:border-none [&>a]:block [&>a]:rounded-none [&>a]:border-0 [&>a]:border-b-[1.5px] [&>a]:border-b-[#e2e3e8] [&>a]:px-4 [&>a]:py-2 [&>a]:font-bold [&>a]:text-[rgb(95,95,95)] [&>a]:no-underline',
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
