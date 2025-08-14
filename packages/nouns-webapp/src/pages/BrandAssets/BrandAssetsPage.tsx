'use client';

import type { StaticImageData } from 'next/image';

import React from 'react';

// i18n macros/components removed for build stability
import { DownloadIcon } from 'lucide-react';

import CCZero from '@/assets/cczero-badge.svg?react';
import playgroundNouns from '@/pages/BrandAssets/playground-nouns.webp';
import traitsImage from '@/pages/BrandAssets/traits.webp';
import { Link } from '@/utils/react-router-shim';

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
        <div className="bg-checkerboard relative mb-6 flex aspect-square items-center justify-center rounded-lg bg-white p-8 shadow-inner">
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

const SectionCard: React.FC<{
  title: string;
  imageSrc: string | StaticImageData;
  description: string;
  to?: string;
}> = ({ title, imageSrc, description, to = '/playground' }) => {
  const resolvedSrc = typeof imageSrc === 'string' ? imageSrc : imageSrc.src;
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <div className="bg-checkerboard relative flex aspect-square items-center justify-center rounded-lg shadow-inner">
          <img src={resolvedSrc} alt={title} className="object-contain drop-shadow" />
        </div>

        <p className="mb-4 text-sm text-gray-600">{description}</p>
      </div>

      <Link
        to={to}
        reloadDocument
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-800"
      >
        {title}
      </Link>
    </div>
  );
};

const BrandAssetsPage = () => {
  const assets = [
    {
      title: 'Colored Noggles',
      imageSrc: '/brand-assets/color_noggles.png',
      pngHref: '/brand-assets/color_noggles.png',
      svgHref: '/brand-assets/color_noggles.svg',
    },
    {
      title: 'Black monochrome Noggles',
      imageSrc: '/brand-assets/black_noggles.png',
      pngHref: '/brand-assets/black_noggles.png',
      svgHref: '/brand-assets/black_noggles.svg',
    },
    {
      title: 'White monochrome Noggles',
      imageSrc: '/brand-assets/white_noggles.png',
      pngHref: '/brand-assets/white_noggles.png',
      svgHref: '/brand-assets/white_noggles.svg',
    },
  ];
  return (
    <div className="-mb-10 min-h-screen bg-gray-100 sm:-mb-20">
      <div className="container-sm py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-5xl font-bold text-gray-900">Brand Assets</h1>
          <p className="max-w-2xl text-lg text-gray-600">
            Download official Nouns DAO brand assets including our iconic noggles in various
            formats.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="font-londrina text-4xl font-bold">Logo</h2>
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
          <h2 className="font-londrina mt-6 text-4xl font-bold">Nouns & Traits</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SectionCard
              title={'Go to playground'}
              to="/playground"
              imageSrc={playgroundNouns}
              description={'Generate endless Nouns assembled from the onchain artwork'}
            />
            <SectionCard
              title={'Explore traits'}
              imageSrc={traitsImage}
              description={'Download the individual traits that compose Nouns'}
              to="/traits"
            />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="font-londrina mt-6 text-4xl font-bold">License</h2>
          <div className="mt-6 items-start gap-6">
            <p className="max-w-2xl text-lg text-gray-600">
              The logos, traits and every Noun generated on the playground are{' '}
              <a
                href="https://creativecommons.org/public-domain/cc0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                CC0
              </a>{' '}
              (Creative Commons Zero), meaning they are in the public domain and free to use for any
              purpose without restriction.
            </p>
            <CCZero className="mt-6 h-16" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandAssetsPage;
