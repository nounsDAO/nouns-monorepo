import React from 'react';

import { Trans, useLingui } from '@lingui/react/macro';
import { DownloadIcon } from 'lucide-react';
import { Link } from 'react-router';

import CCZero from '@/pages/BrandAssets/cczero-badge.svg?react';
import playgroundNouns from '@/pages/BrandAssets/playground-nouns.webp';

interface AssetCardProps {
  title: string;
  imageSrc: string;
  pngHref: string;
  svgHref: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ title, imageSrc, pngHref, svgHref }) => {
  const handleDownload = (href: string, filename: string) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    link.click();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

        {/* Checkerboard background container */}
        <div
          className="relative mb-6 flex items-center justify-center rounded-lg bg-white p-8 shadow-inner"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #f3f4f6 25%, transparent 25%), 
              linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f3f4f6 75%), 
              linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          <img
            src={imageSrc}
            alt={title}
            className="max-h-32 max-w-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Download buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleDownload(pngHref, `${title.toLowerCase().replace(' ', '_')}.png`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
          >
            <DownloadIcon size={16} />
            PNG
          </button>
          <button
            type="button"
            onClick={() => handleDownload(svgHref, `${title.toLowerCase().replace(' ', '_')}.svg`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <DownloadIcon size={16} />
            SVG
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaygroundCard: React.FC<{
  title: string;
  imageSrc: string;
  description: string;
}> = ({ title, imageSrc, description }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>

        {/* Checkerboard background container */}
        <div className="bg-warm-background relative flex items-center justify-center rounded-lg">
          <img src={imageSrc} alt={title} className="max-h-64 max-w-full object-contain" />
        </div>

        <p className="mb-4 text-sm text-gray-600">{description}</p>

        {/* Go to playground button */}
        <Link
          to="/playground"
          reloadDocument
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
        >
          <Trans>Go to playground</Trans>
        </Link>
      </div>
    </div>
  );
};

export const BrandAssetsPage = () => {
  const { t } = useLingui();

  const assets = [
    {
      title: t`Colored Noggles`,
      imageSrc: '/brand-assets/color_noggles.png',
      pngHref: '/brand-assets/color_noggles.png',
      svgHref: '/brand-assets/color_noggles.svg',
    },
    {
      title: t`Black monochrome Noggles`,
      imageSrc: '/brand-assets/black_noggles.png',
      pngHref: '/brand-assets/black_noggles.png',
      svgHref: '/brand-assets/black_noggles.svg',
    },
    {
      title: t`White monochrome Noggles`,
      imageSrc: '/brand-assets/white_noggles.png',
      pngHref: '/brand-assets/white_noggles.png',
      svgHref: '/brand-assets/white_noggles.svg',
    },
  ];
  return (
    <div className="-mb-20 min-h-screen bg-gray-100">
      <div className="container-xl py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">
            <Trans>Brand Assets</Trans>
          </h1>
          <p className="max-w-2xl text-lg text-gray-600">
            <Trans>
              Download official Nouns DAO brand assets including our iconic noggles in various
              formats.
            </Trans>
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-londrina text-4xl font-bold">
            <Trans>Logo</Trans>
          </h2>
          {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assets.map(asset => (
              <AssetCard
                key={asset.title}
                title={asset.title}
                imageSrc={asset.imageSrc}
                pngHref={asset.pngHref}
                svgHref={asset.svgHref}
              />
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="font-londrina mt-6 text-4xl font-bold">
            <Trans>Nouns</Trans>
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PlaygroundCard
              title={t`Playground`}
              imageSrc={playgroundNouns}
              description={t`Generate endless Nouns assembled from the onchain artwork`}
            />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="font-londrina mt-6 text-4xl font-bold">
            <Trans>License</Trans>
          </h2>
          <div className="mt-6 items-start gap-6">
            <p className="max-w-2xl text-lg text-gray-600">
              <Trans>
                The logos and every Noun generated on the playground are{' '}
                <a
                  href="https://creativecommons.org/public-domain/cc0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  CC0
                </a>{' '}
                (Creative Commons Zero), meaning they are in the public domain and free to use for
                any purpose without restriction.
              </Trans>
            </p>
            <CCZero className="mt-6 h-16" />
          </div>
        </section>
      </div>
    </div>
  );
};
