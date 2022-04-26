import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { supportedLocales as locales } from '../../utils/i18n/supportedLocales';
import classes from './LanguageSelectionModal.module.css';
import { getCurrentLocale } from '../../utils/i18n/getCurrentLocale';
import { setLocale } from '../../utils/i18n/setLocale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Trans } from "@lingui/macro";

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

export interface Locale {
  name: string;
  locale: string;
}

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = props => {
  const { onDismiss } = props;
  // const [modalLocale, setModalLocale] = useState(getCurrentLocale());

  // TODO is this actually doing anything for us?
  // useEffect(() => {
  //   if (modalLocale !== getCurrentLocale()) {
  //     setLocale(modalLocale);
  //   }
  // }, [modalLocale]);

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {locales.map((locale: Locale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale.locale}
            onClick={() => setLocale(locale.locale)}
          >
            {locale.name}
            {locale.locale === getCurrentLocale() && (
              <FontAwesomeIcon
                icon={faCheck}
                height={24}
                width={24}
                className={classes.icon}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  console.log(getCurrentLocale());
  return <Modal title={<Trans>Select Language</Trans>} content={modalContent} onDismiss={onDismiss} />;
};
export default LanguageSelectionModal;