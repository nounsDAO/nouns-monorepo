import type { Metadata } from 'next';

import React from 'react';

import { Providers } from './providers';

// Global CSS imports should live in the root layout
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/index.css';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Nouns',
  description: 'The Nouns DAO homepage',
  applicationName: 'Nouns',
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport = {
  width: 'device-width',
  initialScale: 1,
} satisfies import('next').Viewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
