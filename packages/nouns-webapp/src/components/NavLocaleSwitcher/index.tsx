import React, { useState } from 'react';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import classes from './NavLocalSwitcher.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'react-bootstrap';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { isMobileScreen } from '../../utils/isMobile';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import LanguageSelectionModal from '../LanguageSelectionModal';
import { getCurrentLocale } from '../../utils/i18n/getCurrentLocale';
import { setLocale } from '../../utils/i18n/setLocale';
import { Trans } from '@lingui/macro';

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

const NavLocaleSwitcher: React.FC<NavLocalSwitcherProps> = props => {
  const { buttonStyle } = props;

  const [buttonUp, setButtonUp] = useState(false);
  const history = useHistory();
  const [showLanguagePickerModal, setShowLanguagePickerModal] = useState(false);

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
          <div className={classes.address}>{<FontAwesomeIcon icon={faGlobe} />}</div>
          <div className={buttonUp ? classes.arrowUp : classes.arrowDown}>
            <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />{' '}
          </div>
        </div>
      </div>
    </>
  ));

  const check = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        height: '24px',
        width: '24px',
        marginLeft: '0.5rem',
      }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

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
            style={{
              justifyContent: 'space-between',
            }}
            onClick={() => setLocale('en')}
          >
            English{' '}
            {getCurrentLocale() === 'en' && (
              <FontAwesomeIcon icon={faCheck} height={24} width={24} />
            )}
          </div>
          <div
            className={clsx(
              classes.dropDownBottom,
              classes.button,
              usePickByState(
                classes.whiteInfoSelectedBottom,
                classes.coolInfoSelected,
                classes.warmInfoSelected,
                history,
              ),
              classes.switchWalletText,
            )}
            style={{
              justifyContent: 'space-between',
            }}
            onClick={() => setLocale('ja')}
          >
            日本語
            {getCurrentLocale() === 'ja' && (
              <FontAwesomeIcon icon={faCheck} height={24} width={24} />
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {showLanguagePickerModal && (
        <LanguageSelectionModal onDismiss={() => setShowLanguagePickerModal(false)} />
      )}
      {isMobileScreen() ? (
        <div className={classes.nounsNavLink} onClick={() => setShowLanguagePickerModal(true)}>
          <NavBarButton
            buttonText={<Trans>Language</Trans>}
            buttonIcon={<FontAwesomeIcon icon={faGlobe} />}
            buttonStyle={buttonStyle}
          />
        </div>
      ) : (
        <Dropdown className={classes.nounsNavLink} onToggle={() => setButtonUp(!buttonUp)}>
          <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
          <Dropdown.Menu className={`${classes.desktopDropdown} `} as={CustomMenu} />
        </Dropdown>
      )}
    </>
  );
};

export default NavLocaleSwitcher;
