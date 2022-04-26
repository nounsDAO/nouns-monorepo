import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { locales } from '../../i18n/i18n';
import classes from './LanguageSelectionModal.module.css';
import { getCurrentLocale } from '../../utils/i18n/getCurrentLocale';
import { setLocale } from '../../utils/i18n/setLocale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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
  const [modalLocale, setModalLocale] = useState(getCurrentLocale());

  // TODO is this actually doing anything for us?
  useEffect(() => {
    if (modalLocale !== getCurrentLocale()) {
      setLocale(modalLocale);
    }
  }, [modalLocale]);

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {locales.map((locale: Locale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale.locale}
            onClick={() => setModalLocale(locale.locale)}
          >
            {locale.name}
            {locale.locale === modalLocale && (
              <FontAwesomeIcon
                icon={faCheck}
                height={24}
                width={24}
                style={{ marginTop: '.25rem' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  console.log(getCurrentLocale());
  return <Modal title="Select Language" content={modalContent} onDismiss={onDismiss} />;
};
export default LanguageSelectionModal;
