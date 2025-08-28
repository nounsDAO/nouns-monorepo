import React, { HTMLAttributes, useState } from 'react';

import { Dropdown } from 'react-bootstrap';

import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { cn } from '@/lib/utils';
import { usePickByState } from '@/utils/color-responsive-ui-utils';

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
    'border border-black/10 bg-white text-brand-gray-light-text',
    'bg-brand-surface-cool text-brand-cool-muted',
    'bg-brand-surface-warm text-brand-warm-muted',
  );

  const stateSelectedDropdownClass = usePickByState(
    'border border-black/10 bg-brand-surface text-brand-text-muted-600',
    'bg-white text-black',
    'bg-white text-black',
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
        className={cn(
          'font-pt p-0.3 text-brand-black text-sm font-bold transition-all duration-150 ease-in-out',
          'max-xl:hidden',
        )}
        onToggle={() => setButtonUp(!buttonUp)}
        autoClose={true}
      >
        <Dropdown.Toggle as={customDropdownToggle} id="dropdown" />
        <Dropdown.Menu
          className={cn(
            'rounded-10 [&>a]:border-b-brand-border-ui [&>a]:text-brand-text-muted-700 !left-[5px] m-0 overflow-hidden border border-black/10 p-0 [&>a:hover]:bg-white [&>a:last-child]:border-none [&>a]:block [&>a]:rounded-none [&>a]:border-0 [&>a]:border-b-[1.5px] [&>a]:px-4 [&>a]:py-2 [&>a]:font-bold [&>a]:no-underline',
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
