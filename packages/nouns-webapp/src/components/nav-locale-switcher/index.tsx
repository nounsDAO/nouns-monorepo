import React, { useState } from 'react';

import { faCheck, faGlobe, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { useAtom } from 'jotai/react';

import LanguageSelectionModal from '@/components/language-selection-modal';
import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { activeLocaleAtom } from '@/i18n/active-locale-atom';
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { usePickByState } from '@/utils/color-responsive-ui-utils';

import navDropdownClasses from '@/components/nav-bar/nav-bar-dropdown.module.css';
// responsiveUiUtilsClasses usage replaced by Tailwind responsive utilities

interface NavLocalSwitcherProps {
  buttonStyle?: NavBarButtonStyle;
}

type CustomMenuProps = {
  style?: React.CSSProperties;
  className?: string;
  labeledBy?: string;
  buttonStyleTop: string;
  buttonStyleBottom: string;
  activeLocale: SupportedLocale;
  setActiveLocale: (l: SupportedLocale) => void;
};

type CustomDropdownToggleProps = {
  buttonUp: boolean;
  stateSelectedDropdownClass: string;
  statePrimaryButtonClass: string;
  onClick?: (e: React.MouseEvent) => void;
};

const CustomDropdownToggle: React.FC<CustomDropdownToggleProps> = ({
  buttonUp,
  stateSelectedDropdownClass,
  statePrimaryButtonClass,
  onClick,
}) => (
  <div
    className={cn(
      navDropdownClasses.wrapper,
      'lg-max:h-12 lg-max:text-lg',
      buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
    )}
    onClick={e => {
      e.preventDefault();
      onClick?.(e);
    }}
  >
    <div className={cn(navDropdownClasses.button, 'lg-max:h-12 lg-max:text-lg', 'max-[330px]:w-[70px] max-[370px]:w-[90px] min-[400px]:w-auto')}>
      <div className={navDropdownClasses.dropdownBtnContent}>
        <FontAwesomeIcon icon={faGlobe} />
      </div>
      <div className={buttonUp ? navDropdownClasses.arrowUp : navDropdownClasses.arrowDown}>
        <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />
      </div>
    </div>
  </div>
);

const CustomMenu = ({
  ref,
  style,
  className,
  labeledBy,
  buttonStyleTop,
  buttonStyleBottom,
  activeLocale,
  setActiveLocale,
}: CustomMenuProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
      {SUPPORTED_LOCALES.map((locale: SupportedLocale, index: number) => {
        let dropDownStyle;
        let buttonStyle;

        switch (index) {
          case 0:
            dropDownStyle =
              'ml-1 rounded-t-[10px] border-b border-b-[rgba(0,0,0,0.06)] pb-2 pl-4 pt-[0.65rem] transition-all duration-150 ease-in-out hover:text-black';
            buttonStyle = buttonStyleTop;
            break;
          case SUPPORTED_LOCALES.length - 1:
            dropDownStyle = 'ml-1 rounded-b-[10px] pb-[0.65rem] pl-4 pt-2 hover:text-black';
            buttonStyle = buttonStyleBottom;
            break;
          default:
            dropDownStyle =
              'ml-1 border-b border-b-[rgba(0,0,0,0.06)] pb-[0.65rem] pl-4 pt-2 hover:text-black';
            buttonStyle = buttonStyleBottom;
        }

        return (
          <div
            key={locale}
            className={cn(
              navDropdownClasses.button,
              'lg-max:h-12 lg-max:text-lg',
              navDropdownClasses.dropdownPrimaryText,
              buttonStyle,
              dropDownStyle,
              'justify-between',
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
};

CustomDropdownToggle.displayName = 'CustomDropdownToggle';
CustomMenu.displayName = 'CustomMenu';

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

  return (
    <>
      {showLanguagePickerModal && (
        <LanguageSelectionModal onDismiss={() => setShowLanguagePickerModal(false)} />
      )}

      <div
        className={cn(navDropdownClasses.nounsNavLink, 'xl-max:block hidden')}
        onClick={() => setShowLanguagePickerModal(true)}
      >
        <NavBarButton
          buttonText={<Trans>Language</Trans>}
          buttonIcon={<FontAwesomeIcon icon={faGlobe} />}
          buttonStyle={buttonStyle}
        />
      </div>

      <div className={cn(navDropdownClasses.nounsNavLink, 'xl-max:hidden')}>
        <CustomDropdownToggle
          buttonUp={buttonUp}
          stateSelectedDropdownClass={stateSelectedDropdownClass}
          statePrimaryButtonClass={statePrimaryButtonClass}
          onClick={() => setButtonUp(!buttonUp)}
        />
        {buttonUp && (
          <CustomMenu
            className={`${navDropdownClasses.desktopDropdown}`}
            buttonStyleTop={buttonStyleTop}
            buttonStyleBottom={buttonStyleBottom}
            activeLocale={activeLocale}
            setActiveLocale={setActiveLocale}
          />
        )}
      </div>
    </>
  );
};

export default NavLocaleSwitcher;
