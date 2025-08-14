import React, { HTMLAttributes, useState } from 'react';

import { faCheck, faGlobe, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { useAtom } from 'jotai/react';
import { Dropdown } from 'react-bootstrap';

import LanguageSelectionModal from '@/components/language-selection-modal';
import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { activeLocaleAtom } from '@/i18n/activeLocaleAtom';
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/locales';
import { usePickByState } from '@/utils/color-responsive-ui-utils';

import classes from './nav-local-switcher.module.css';

import navDropdownClasses from '@/components/nav-bar/nav-bar-dropdown.module.css';
import responsiveUiUtilsClasses from '@/utils/responsive-ui-utils.module.css';

interface NavLocalSwitcherProps {
  buttonStyle?: NavBarButtonStyle;
}

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
  const [activeLocale, setActiveLocale] = useAtom(activeLocaleAtom);

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

  const customDropdownToggle = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ onClick }, ref) => (
      <>
        <div
          ref={ref}
          className={clsx(
            navDropdownClasses.wrapper,
            buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
          )}
          onClick={e => {
            e.preventDefault();
            onClick?.(e);
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
    ),
  );

  customDropdownToggle.displayName = 'CustomDropdownToggle';

  // eslint-disable-next-line @eslint-react/no-nested-component-definitions
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
              key={locale}
              className={clsx(
                navDropdownClasses.button,
                navDropdownClasses.dropdownPrimaryText,
                buttonStyle,
                dropDownStyle,
                classes.desktopLanguageButton,
              )}
              onClick={() => setActiveLocale(locale)}
            >
              {LOCALE_LABEL[locale]}
              {activeLocale === locale && <FontAwesomeIcon icon={faCheck} height={24} width={24} />}
            </div>
          );
        })}
      </div>
    );
  });

  CustomMenu.displayName = 'CustomMenu';

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
