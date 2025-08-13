import type { AppProps } from 'next/app';

import React from 'react';

// Global styles for the Pages Router
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';

// Reuse the same application providers used by the App Router
import { Providers } from '@/app/providers';

export default function NounsApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </React.StrictMode>
  );
}
