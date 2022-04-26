import Modal from '../Modal';
import { SupportedLocale, supportedLocales as locales } from '../../utils/i18n/supportedLocales';
import classes from './LanguageSelectionModal.module.css';
import { getCurrentLocale } from '../../utils/i18n/getCurrentLocale';
import { setLocale } from '../../utils/i18n/setLocale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Trans } from '@lingui/macro';

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
      {locales.map((locale: SupportedLocale) => {
        return (
          <div
            className={classes.languageButton}
            key={locale.locale}
            onClick={() => setLocale(locale.locale)}
          >
            {locale.name}
            {locale.locale === getCurrentLocale() && (
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
