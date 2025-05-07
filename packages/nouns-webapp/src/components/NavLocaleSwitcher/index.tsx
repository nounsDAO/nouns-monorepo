import React, { useState } from 'react';

import { faCheck, faSortDown, faSortUp, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Dropdown } from 'react-bootstrap';

import { useActiveLocale } from '../../hooks/useActivateLocale';
import { SUPPORTED_LOCALES, SupportedLocale, LOCALE_LABEL } from '../../i18n/locales';
import { setLocale } from '../../i18n/setLocale';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import LanguageSelectionModal from '../LanguageSelectionModal';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';

import classes from './NavLocalSwitcher.module.css';

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
  const [showLanguagePickerModal, setShowLanguagePickerModal] = useState(false);
  const activeLocale = useActiveLocale();

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

  const buttonStyleTop = usePickByState(
    navDropdownClasses.whiteInfoSelectedTop,
    navDropdownClasses.coolInfoSelected,
    navDropdownClasses.warmInfoSelected,
  );

  const buttonStyleBottom = usePickByState(
    navDropdownClasses.whiteInfoSelectedBottom,
    navDropdownClasses.coolInfoSelected,
    navDropdownClasses.warmInfoSelected,
  );

  // @ts-ignore
  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          navDropdownClasses.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={navDropdownClasses.button}>
          <div className={navDropdownClasses.dropdownBtnContent}>
            {<FontAwesomeIcon icon={faGlobe} />}
          </div>
          <div className={buttonUp ? navDropdownClasses.arrowUp : navDropdownClasses.arrowDown}>
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
        {SUPPORTED_LOCALES.map((locale: SupportedLocale, index: number) => {
          let dropDownStyle;
          let buttonStyle;

          switch (index) {
            case 0:
              dropDownStyle = classes.dropDownTop;
              buttonStyle = buttonStyleTop;
              break;
            case SUPPORTED_LOCALES.length - 1:
              dropDownStyle = classes.dropDownBottom;
              buttonStyle = buttonStyleBottom;
              break;
            default:
              dropDownStyle = classes.dropDownInterior;
              buttonStyle = buttonStyleBottom;
          }

          return (
            <div
              className={clsx(
                navDropdownClasses.button,
                navDropdownClasses.dropdownPrimaryText,
                buttonStyle,
                dropDownStyle,
                classes.desktopLanguageButton,
              )}
              onClick={() => setLocale(locale)}
            >
              {LOCALE_LABEL[locale]}
              {activeLocale === locale && <FontAwesomeIcon icon={faCheck} height={24} width={24} />}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <>
      {showLanguagePickerModal && (
        <LanguageSelectionModal onDismiss={() => setShowLanguagePickerModal(false)} />
      )}

      <div
        className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.mobileOnly)}
        onClick={() => setShowLanguagePickerModal(true)}
      >
        <NavBarButton
          buttonText={<Trans>Language</Trans>}
          buttonIcon={<FontAwesomeIcon icon={faGlobe} />}
          buttonStyle={buttonStyle}
        />
      </div>

      <Dropdown
        className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.desktopOnly)}
        onToggle={() => setButtonUp(!buttonUp)}
        autoClose={true}
      >
        <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
        <Dropdown.Menu className={`${navDropdownClasses.desktopDropdown} `} as={CustomMenu} />
      </Dropdown>
    </>
  );
};

export default NavLocaleSwitcher;
