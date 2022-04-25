import Davatar from '@davatar/react';
import React, { useState } from 'react';
import { getNavBarButtonVariant, NavBarButtonStyle } from '../NavBarButton';
import classes from './NavLocalSwitcher.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { isMobileScreen } from '../../utils/isMobile';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import LocalSwitcherButton from './LocaleSwitcherButton';

interface NavLocalSwitcherProps {
  buttonStyle?: NavBarButtonStyle;
}

type Props = {
  onClick: (e: any) => void;
  value: string;
};

type RefType = number;

type CustomMenuProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  labeledBy?: string;
};

const NavLocalSwitcher: React.FC<NavLocalSwitcherProps> = props => {
  const { buttonStyle } = props;

  const [buttonUp, setButtonUp] = useState(false);
  const history = useHistory();

   const statePrimaryButtonClass = usePickByState(
    classes.whiteInfo,
    classes.coolInfo,
    classes.warmInfo,
    history,
  );

  const stateSelectedDropdownClass = usePickByState(
    classes.whiteInfoSelected,
    classes.dropdownActive,
    classes.dropdownActive,
    history,
  );

  const mobileTextColor = usePickByState(
    'rgba(140, 141, 146, 1)',
    'rgba(121, 128, 156, 1)',
    'rgba(142, 129, 127, 1)',
    history,
  );

  const mobileBorderColor = usePickByState(
    'rgba(140, 141, 146, .5)',
    'rgba(121, 128, 156, .5)',
    'rgba(142, 129, 127, .5)',
    history,
  );

  const connectLocalSwitcherButtonStyle = usePickByState(
    NavBarButtonStyle.WHITE_WALLET,
    NavBarButtonStyle.COOL_WALLET,
    NavBarButtonStyle.WARM_WALLET,
    history,
  );

  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          classes.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={classes.button}>
          {/* <div className={classes.icon}>
            {' '}
            <Davatar size={21} address={address} provider={provider} />
          </div> */}
          <div className={classes.address}>{
            <FontAwesomeIcon icon={ faGlobe} />
          }</div>
          <div className={buttonUp ? classes.arrowUp : classes.arrowDown}>
            <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />{' '}
          </div>
        </div>
      </div>
    </>
  ));

  const CustomMenu = React.forwardRef((props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props.labeledBy}
      >
        <div>
          <div
            // onClick={switchLocalSwitcherHandler}
            className={clsx(
              classes.dropDownTop,
              classes.button,
              classes.switchWalletText,
              usePickByState(
                classes.whiteInfoSelectedTop,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
              ),
            )}
          >
              <svg xmlns="http://www.w3.org/2000/svg" style={{
                  height: '24px', width: '24px', marginRight: '0.5rem'
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
</svg>
             English 
          </div>
          <div
            // onClick={disconectLocalSwitcherHandler}
            className={clsx(
              classes.dropDownInterior,
              classes.button,
              usePickByState(
                classes.whiteInfoSelectedBottom,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
              ),
              classes.disconnectText,
            )}
          >
             Español 
          </div>

          <div
            // onClick={disconectLocalSwitcherHandler}
            className={clsx(
              classes.dropDownBottom,
              classes.button,
              usePickByState(
                classes.whiteInfoSelectedBottom,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
              ),
              classes.disconnectText,
            )}
          >
              日本語
          </div>
        </div>
      </div>
    );
  });

  const walletConnectedContentMobile = (
    <div className="d-flex flex-row justify-content-between">
      <div className={classes.connectContentMobileWrapper}>
        <div className={clsx(classes.wrapper, getNavBarButtonVariant(buttonStyle))}>
          <div className={classes.button}>
            {/* <div className={classes.icon}>
              {' '}
              <Davatar size={21} address={address} provider={provider} />
            </div> */}
            <div className={classes.address}>{
                <FontAwesomeIcon icon={faGlobe} />
            }</div>
          </div>
        </div>
      </div>

      <div className={`d-flex flex-row ${classes.connectContentMobileText}`}>
        <div
          style={{
            borderRight: `1px solid ${mobileBorderColor}`,
            color: mobileTextColor,
          }}
          className={classes.mobileSwitchLocalSwitcherText}
        //   onClick={switchLocalSwitcherHandler}
        >
          Switch
        </div>
        <div className={classes.disconnectText} 
        // onClick={disconectLocalSwitcherHandler}
        >
          Sign out
        </div>
      </div>
    </div>
  );

  const walletConnectedContentDesktop = (
    <Dropdown className={classes.nounsNavLink} onToggle={() => setButtonUp(!buttonUp)}>
      <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
      <Dropdown.Menu className={`${classes.desktopDropdown} `} as={CustomMenu} />
    </Dropdown>
  );

  return (
    <>
    {walletConnectedContentDesktop}
    </>
  );
};

export default NavLocalSwitcher;