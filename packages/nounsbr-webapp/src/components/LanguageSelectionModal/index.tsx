import Modal from '../Modal';
import classes from './LanguageSelectionModal.module.css';
import { setLocale } from '../../i18n/setLocale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Trans } from '@lingui/macro';
import { SUPPORTED_LOCALES, SupportedLocale, LOCALE_LABEL } from '../../i18n/locales';
import { useActiveLocale } from '../../hooks/useActivateLocale';

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = props => {
  const { onDismiss } = props;
  const activeLocale = useActiveLocale();

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {SUPPORTED_LOCALES.map((locale: SupportedLocale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale}
            onClick={() => {
              setLocale(locale);
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
