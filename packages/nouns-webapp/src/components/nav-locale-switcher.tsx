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
      'font-pt h-10 rounded-[10px] p-0 text-base font-bold leading-4 shadow-none transition-all duration-150 ease-in-out',
      'max-lg:h-12 max-lg:text-lg',
      buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
    )}
    onClick={e => {
      e.preventDefault();
      onClick?.(e);
    }}
  >
    <div
      className={cn(
        // layout → spacing
        'flex size-full flex-row items-center justify-start pr-3.5',
        // responsive type/size
        'max-lg:h-12 max-lg:text-lg',
        // width adjustments at small screens using default screens
        'max-xs:w-[90px] xs:w-auto',
      )}
    >
      <div className={'min-h-4.5 truncate leading-5 text-black'}>
        <FontAwesomeIcon icon={faGlobe} />
      </div>
      <div className={buttonUp ? 'ml-2 mt-2' : 'mb-1 ml-2'}>
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
              'ml-1 rounded-t-[10px] border-b border-b-black/5 pb-2 pl-4 pt-[0.65rem] transition-all duration-150 ease-in-out hover:text-black';
            buttonStyle = buttonStyleTop;
            break;
          case SUPPORTED_LOCALES.length - 1:
            dropDownStyle = 'ml-1 rounded-b-[10px] pb-[0.65rem] pl-4 pt-2 hover:text-black';
            buttonStyle = buttonStyleBottom;
            break;
          default:
            dropDownStyle =
              'ml-1 border-b border-b-black/5 pb-[0.65rem] pl-4 pt-2 hover:text-black';
            buttonStyle = buttonStyleBottom;
        }

        return (
          <div
            key={locale}
            className={cn(
              'flex size-full flex-row items-center justify-start pr-3.5',
              'max-lg:h-12 max-lg:text-lg',
              'transition-all duration-150 ease-in-out hover:cursor-pointer hover:bg-white',
              buttonStyle,
              dropDownStyle,
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
    'border border-black/10 bg-white text-brand-gray-light-text',
    'bg-brand-surface-cool text-brand-cool-muted',
    'bg-brand-surface-warm text-brand-warm-muted',
  );

  const stateSelectedDropdownClass = usePickByState(
    'border border-black/10 bg-brand-surface text-brand-text-muted-600',
    'bg-white text-black',
    'bg-white text-black',
  );

  const buttonStyleTop = usePickByState(
    'border-l-1.5 border-r-1.5 border-t-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
    'bg-brand-surface-cool text-brand-cool-muted',
    'bg-brand-surface-warm text-brand-warm-light-text',
  );

  const buttonStyleBottom = usePickByState(
    'border-b-1.5 border-l-1.5 border-r-1.5 border-brand-border-ui bg-brand-surface text-brand-text-muted-600',
    'bg-brand-surface-cool text-brand-cool-muted',
    'bg-brand-surface-warm text-brand-warm-light-text',
  );

  return (
    <>
      {showLanguagePickerModal && (
        <LanguageSelectionModal onDismiss={() => setShowLanguagePickerModal(false)} />
      )}

      <div
        className={cn(
          'font-pt p-0.3 text-brand-black text-sm font-bold transition-all duration-150 ease-in-out',
          'max-xl:block hidden',
        )}
        onClick={() => setShowLanguagePickerModal(true)}
      >
        <NavBarButton
          buttonText={<Trans>Language</Trans>}
          buttonIcon={<FontAwesomeIcon icon={faGlobe} />}
          buttonStyle={buttonStyle}
        />
      </div>

      <div
        className={cn(
          'font-pt p-0.3 text-brand-black text-sm font-bold transition-all duration-150 ease-in-out',
          'max-xl:hidden',
        )}
      >
        <CustomDropdownToggle
          buttonUp={buttonUp}
          stateSelectedDropdownClass={stateSelectedDropdownClass}
          statePrimaryButtonClass={statePrimaryButtonClass}
          onClick={() => setButtonUp(!buttonUp)}
        />
        {buttonUp && (
          <CustomMenu
            className={cn('border-0 bg-inherit')}
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
