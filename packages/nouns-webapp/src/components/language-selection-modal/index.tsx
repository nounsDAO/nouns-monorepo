import { FC } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { useAtom } from 'jotai/react';

import Modal from '@/components/modal';
import { activeLocaleAtom } from '@/i18n/activeLocaleAtom';
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/locales';

import classes from './language-selection-modal.module.css';

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: FC<LanguageSelectionModalProps> = ({ onDismiss }) => {
  const [activeLocale, setActiveLocale] = useAtom(activeLocaleAtom);

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {SUPPORTED_LOCALES.map((locale: SupportedLocale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale}
            onClick={() => {
              setActiveLocale(locale);
              onDismiss();
            }}
          >
            {LOCALE_LABEL[locale]}
            {locale === activeLocale && (
              <FontAwesomeIcon icon={faCheck} height={24} width={24} className={classes.icon} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Modal title={<Trans>Select Language</Trans>} content={modalContent} onDismiss={onDismiss} />
  );
};
export default LanguageSelectionModal;
