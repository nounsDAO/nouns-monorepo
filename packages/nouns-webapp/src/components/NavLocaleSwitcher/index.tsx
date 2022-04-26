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
import navWalletClasses from '../NavWallet/NavWallet.module.css';
import { SupportedLocale, supportedLocales as locales } from '../../utils/i18n/supportedLocales';

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
    navWalletClasses.whiteInfo,
    navWalletClasses.coolInfo,
    navWalletClasses.warmInfo,
    history,
  );

  const stateSelectedDropdownClass = usePickByState(
    navWalletClasses.whiteInfoSelected,
    navWalletClasses.dropdownActive,
    navWalletClasses.dropdownActive,
    history,
  );

  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          navWalletClasses.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={navWalletClasses.button}>
          <div className={navWalletClasses.address}>{<FontAwesomeIcon icon={faGlobe} />}</div>
          <div className={buttonUp ? navWalletClasses.arrowUp : navWalletClasses.arrowDown}>
            <FontAwesomeIcon icon={buttonUp ? faSortUp : faSortDown} />{' '}
          </div>
        </div>
      </div>
    </>
  ));

  const buttonStyleTop = usePickByState(
    navWalletClasses.whiteInfoSelectedTop,
    navWalletClasses.coolInfoSelected,
    navWalletClasses.warmInfoSelected,
    history,
  );

  const buttonStyleBottom = usePickByState(
    navWalletClasses.whiteInfoSelectedBottom,
    navWalletClasses.coolInfoSelected,
    navWalletClasses.warmInfoSelected,
    history,
  ); 

  const CustomMenu = React.forwardRef((props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props.labeledBy}
      >
        {locales.map((locale: SupportedLocale, index: number) => {
            let dropDownStyle;
            let buttonStyle;

            switch(index) {
              case 0:
                dropDownStyle = classes.dropDownTop;
                buttonStyle = buttonStyleTop;
                break;
              case locales.length - 1:
                dropDownStyle = classes.dropDownBottom;
                buttonStyle = buttonStyleBottom;
                break;
              default:
                dropDownStyle = classes.dropDownInterior
                buttonStyle = buttonStyleBottom;
            }

            return (
              <div
                className={clsx(
                  navWalletClasses.button,
                  navWalletClasses.switchWalletText,
                  buttonStyle,
                  dropDownStyle,
                  classes.desktopLanguageButton,
                )}
                onClick={() => setLocale(locale.locale)}
              >
                {locale.name}
                {getCurrentLocale() === locale.locale && (
                  <FontAwesomeIcon icon={faCheck} height={24} width={24} />
                )}
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
      {isMobileScreen() ? (
        <div
          className={navWalletClasses.nounsNavLink}
          onClick={() => setShowLanguagePickerModal(true)}
        >
          <NavBarButton
            buttonText={<Trans>Language</Trans>}
            buttonIcon={<FontAwesomeIcon icon={faGlobe} />}
            buttonStyle={buttonStyle}
          />
        </div>
      ) : (
        <Dropdown className={navWalletClasses.nounsNavLink} onToggle={() => setButtonUp(!buttonUp)}>
          <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
          <Dropdown.Menu className={`${navWalletClasses.desktopDropdown} `} as={CustomMenu} />
        </Dropdown>
      )}
    </>
  );
};

export default NavLocaleSwitcher;
