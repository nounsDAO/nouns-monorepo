import { ReactNode } from 'react';

import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import 'nextra-theme-docs/style.css';

import { AskAI } from '@/components/ask-ai';
import config from '@/config';
import Noggles from '@/public/images/general/logo.svg?react';
import DiscordIcon from '@/public/images/socials/discord.svg?react';
import FarcasterIcon from '@/public/images/socials/farcaster.svg?react';
import GitHubIcon from '@/public/images/socials/github.svg?react';
import XIcon from '@/public/images/socials/x.svg?react';

import '../globals.css';

export const metadata = {
  title: 'Nouns DAO Docs',
  description: 'Documentation for Nouns DAO',
};

const llmsTxtUri = config.baseUri + '/llms.txt';

const navbar = (
  <Navbar
    logo={
      <span className="xs:text-4xl shrink whitespace-nowrap text-3xl font-bold">
        <Noggles className="inline-block w-auto max-w-[100px] align-top" /> Docs
      </span>
    }
  >
    <AskAI markdownUri={llmsTxtUri} />
  </Navbar>
);
const footer = (
  <Footer>
    <div className="flex w-full flex-wrap items-center justify-between gap-10">
      <span>
        {new Date().getFullYear()} Nouns DAO · made with{' '}
        <img src={'/images/general/logo.svg'} style={{ height: '12px', display: 'inline-block' }} />
      </span>
      <div className="flex gap-6">
        <a href="https://x.com/nounsdao" target="_blank" rel="noopener">
          <XIcon className="size-5 p-0.5" />
        </a>
        <a href="https://farcaster.xyz/~/channel/nouns" target="_blank" rel="noopener">
          <FarcasterIcon className="size-5" />
        </a>
        <a href="https://github.com/nounsDAO" target="_blank" rel="noopener">
          <GitHubIcon className="size-5" />
        </a>
        <a href="https://discord.gg/Z47Qpz26Fe" target="_blank" rel="noopener">
          <DiscordIcon className="size-5" />
        </a>
      </div>
    </div>
  </Footer>
);

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        color={{
          hue: { dark: 347, light: 347 },
          saturation: { dark: 65, light: 95 },
          lightness: { dark: 54, light: 54 },
        }}
      >
        <link rel="shortcut icon" href="/images/general/docs-head.svg" />
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/nounsDAO/nouns-monorepo/edit/master/packages/nouns-docs/"
          footer={footer}
          toc={{
            extraContent: <AskAI />,
          }}
          // ... Your additional layout options
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
