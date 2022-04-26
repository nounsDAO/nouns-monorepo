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
import navWalletClasses from "../NavWallet/NavWallet.module.css";

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
              classes.desktopLanguageButton,
              classes.dropDownTop,
              navWalletClasses.button,
              navWalletClasses.switchWalletText,
              usePickByState(
                navWalletClasses.whiteInfoSelectedTop,
                navWalletClasses.coolInfoSelected,
                navWalletClasses.warmInfoSelected,
                history,
              ),
            )}
            onClick={() => setLocale('en')}
          >
            English{' '}
            {getCurrentLocale() === 'en' && (
              <FontAwesomeIcon icon={faCheck} height={24} width={24} />
            )}
          </div>
          <div
            className={clsx(
              classes.desktopLanguageButton,
              classes.dropDownBottom,
              navWalletClasses.button,
              usePickByState(
                navWalletClasses.whiteInfoSelectedBottom,
                navWalletClasses.coolInfoSelected,
                navWalletClasses.warmInfoSelected,
                history,
              ),
              navWalletClasses.switchWalletText,
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
        <div className={navWalletClasses.nounsNavLink} onClick={() => setShowLanguagePickerModal(true)}>
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
