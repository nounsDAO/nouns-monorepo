import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from 'react-router';

import DiscordIcon from '@/assets/icons/socials/discord.svg?react';
import FarcasterIcon from '@/assets/icons/socials/farcaster.svg?react';
import GitHubIcon from '@/assets/icons/socials/github.svg?react';
import XIcon from '@/assets/icons/socials/x.svg?react';
import NogglesLogo from '@/assets/noggles.svg?react';
import {
  nounsAuctionHouseAddress,
  nounsDescriptorAddress,
  nounsGovernorAddress,
  nounsTokenAddress,
  nounsTreasuryAddress,
} from '@/contracts';
import { buildEtherscanAddressLink } from '@/utils/etherscan';
import { defaultChain } from '@/wagmi';

export const Footer = () => {
  const { t } = useLingui();
  const categories: { category: string; items: { label: string; url: string }[] }[] = [
    {
      category: 'Nouns DAO',
      items: [
        { label: t`Governance`, url: '/vote' },
        { label: t`Brand Assets`, url: '/brand' },
        { label: t`Playground`, url: '/playground' },
        { label: t`Nouns`, url: '/nouns' },
        { label: t`Traits`, url: '/traits' },
        {
          label: t`Forks`,
          url: '/fork',
        },
      ],
    },
    {
      category: 'Contracts',
      items: [
        { label: t`Token`, url: buildEtherscanAddressLink(nounsTokenAddress[defaultChain.id]) },
        {
          label: t`Auction`,
          url: buildEtherscanAddressLink(nounsAuctionHouseAddress[defaultChain.id]),
        },
        {
          label: t`Governor`,
          url: buildEtherscanAddressLink(nounsGovernorAddress[defaultChain.id]),
        },
        {
          label: t`Descriptor`,
          url: buildEtherscanAddressLink(nounsDescriptorAddress[defaultChain.id]),
        },
        {
          label: t`Treasury`,
          url: buildEtherscanAddressLink(nounsTreasuryAddress[defaultChain.id]),
        },
      ],
    },
  ];

  const socialItems: { alt: string; url: string; icon: React.ReactNode }[] = [
    { alt: 'X', url: 'https://x.com/nounsdao', icon: <XIcon className="size-6 p-0.5" /> },
    {
      alt: 'Farcaster',
      url: 'https://farcaster.xyz/~/channel/nouns',
      icon: <FarcasterIcon className="size-6" />,
    },
    { alt: 'GitHub', url: 'https://github.com/nounsDAO', icon: <GitHubIcon className="size-6" /> },
    {
      alt: 'Discord',
      url: 'https://discord.gg/Z47Qpz26Fe',
      icon: <DiscordIcon className="my-auto h-5" />,
    },
  ];

  return (
    <footer className="mt-10 border-t px-6 py-10 sm:mt-20 sm:!p-10 lg:!p-12">
      <div className="flex flex-wrap-reverse items-end justify-between gap-10">
        <section className="flex flex-grow items-center justify-center gap-4 sm:justify-normal">
          {socialItems.map(({ alt, url, icon }) => (
            <Link
              className="text-black transition-opacity hover:opacity-70"
              key={alt}
              aria-label={alt}
              to={url}
              target="_blank"
              rel="noreferrer"
            >
              {icon}
            </Link>
          ))}
        </section>
        <div className="mx-auto flex flex-wrap gap-12 sm:mx-0">
          {categories.map(({ category, items }) => (
            <section key={category}>
              <h3 className="mb-2 text-base font-bold">{category}</h3>
              <ul className="list-none space-y-1 pl-0">
                {items.map(({ label, url }) => (
                  <li key={label}>
                    <Link
                      reloadDocument
                      to={url}
                      target={url.startsWith('/') ? undefined : '_blank'}
                      className="font-medium text-black no-underline hover:text-red-500"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center text-base text-black sm:mt-16">
        <p className="m-0 p-1">{`${new Date().getFullYear()} Nouns DAO`}</p>·
        <p className="m-0 p-1">
          <Trans>
            made with <NogglesLogo className="inline-block h-3 align-baseline" />
          </Trans>
        </p>
      </div>
    </footer>
  );
};
