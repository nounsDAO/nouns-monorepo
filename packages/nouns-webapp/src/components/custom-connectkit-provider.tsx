import { FC, PropsWithChildren } from 'react';

import { ConnectKitProvider } from 'connectkit';

import { useActiveLocale } from '@/hooks/use-activate-locale';
import { SupportedLocale } from '@/i18n/locales';

export const CustomConnectkitProvider: FC<PropsWithChildren> = ({ children }) => {
  const language = useActiveLocale() as SupportedLocale;

  return (
    <ConnectKitProvider
      theme="nouns"
      mode="light"
      options={{
        hideNoWalletCTA: true,
        hideQuestionMarkCTA: true,
        language: language === 'pseudo' ? 'en-US' : language,
      }}
    >
      {children}
    </ConnectKitProvider>
  );
};
