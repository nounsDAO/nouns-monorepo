import { FC } from 'react';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import { useAtom } from 'jotai/react';

import Modal from '@/components/modal';
import { activeLocaleAtom } from '@/i18n/active-locale-atom';
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/locales';

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: FC<LanguageSelectionModalProps> = ({ onDismiss }) => {
  const [activeLocale, setActiveLocale] = useAtom(activeLocaleAtom);

  const modalContent = (
    <div className="max-h-[40vh] overflow-y-scroll">
      {SUPPORTED_LOCALES.map((locale: SupportedLocale) => {
        return (
          <div
            className="text-brand-black m-[5px] flex justify-between rounded-[5px] border-0 bg-[rgba(211,211,211,0.664)] px-[20px] py-[5px] outline-none hover:bg-[lightgray] hover:text-white focus:bg-[lightgray] focus:shadow-none focus:outline-none active:bg-[lightgray] active:shadow-none disabled:bg-[lightgray]"
            key={locale}
            onClick={() => {
              setActiveLocale(locale);
              onDismiss();
            }}
          >
            {LOCALE_LABEL[locale]}
            {locale === activeLocale && (
              <FontAwesomeIcon icon={faCheck} height={24} width={24} className="mt-1" />
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
