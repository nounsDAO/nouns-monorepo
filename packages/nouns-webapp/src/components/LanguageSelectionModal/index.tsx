import Modal from '../Modal';
import classes from './LanguageSelectionModal.module.css';
import { getCurrentLocale } from '../../i18n/getCurrentLocale';
import { setLocale } from '../../i18n/setLocale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Trans } from '@lingui/macro';
import { SUPPORTED_LOCALES, SupportedLocale, LOCALE_LABEL } from "../../i18n/locales";

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = props => {
  const { onDismiss } = props;

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {SUPPORTED_LOCALES.map((locale: SupportedLocale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale}
            onClick={() => setLocale(locale)}
          >
            {LOCALE_LABEL[locale]}
            {locale === getCurrentLocale() && (
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
