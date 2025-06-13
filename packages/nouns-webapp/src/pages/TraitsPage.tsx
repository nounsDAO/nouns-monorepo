import type { INounSeed } from '@/wrappers/nounToken';
import type { EncodedImage } from '@nouns/sdk';

import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { ImageData } from '@noundry/nouns-assets';
import { buildSVG, PNGCollectionEncoder } from '@nouns/sdk';
import { CopyIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { traitCategory } from '@/lib/traitCategory';
import { traitName } from '@/lib/traitName';
import { svg2png } from '@/utils/svg2png';

interface TraitItem {
  name: string;
  filename: string;
  svg: string;
  category: string;
  type: string;
  hexColor?: string;
}

const encoder = new PNGCollectionEncoder(ImageData.palette);

const capitalizeFirstLetter = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const traitKeyToTitle: Record<string, string> = {
  glasses: 'Noggles',
  heads: 'Heads',
  accessories: 'Accessories',
  bodies: 'Bodies',
};

const backgroundColors = {
  cool: '#d5d7e1',
  warm: '#e1d7d5',
};

const downloadSVG = (svg: string, filename: string) => {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const downloadEl = document.createElement('a');
  downloadEl.href = url;
  downloadEl.download = `${filename}.svg`;
  downloadEl.click();
  URL.revokeObjectURL(url);
};

const downloadPNG = async (svg: string, filename: string) => {
  try {
    const png = await svg2png(svg, 320, 320);
    if (png) {
      const downloadEl = document.createElement('a');
      downloadEl.href = png;
      downloadEl.download = `${filename}.png`;
      downloadEl.click();
    }
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard`);
  } catch (error) {
    console.error('Failed to copy:', error);
    toast.error('Failed to copy to clipboard');
  }
};

const generateTraitItems = (): TraitItem[] => {
  const traitItems: TraitItem[] = [];

  // Process each trait category
  Object.entries(traitCategory).forEach(([traitType, imageKey]) => {
    const categoryTitle = traitKeyToTitle[imageKey] || capitalizeFirstLetter(imageKey);
    const images = ImageData.images[imageKey];

    images.forEach((imageData: EncodedImage, index: number) => {
      const name = traitName(traitType as keyof INounSeed, index);

      // Build SVG for this single trait (with transparent background)
      const svg = buildSVG([imageData], encoder.data.palette, undefined);

      traitItems.push({
        name,
        filename: imageData.filename,
        svg,
        category: categoryTitle,
        type: traitType === 'glasses' ? 'Noggles' : traitType,
      });
    });
  });

  // Add background colors
  Object.entries(backgroundColors).forEach(([bgName, hexColor]) => {
    // Create a colored rectangle SVG with centered hex code text
    const svg = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="${hexColor}" />
      <text x="16" y="18" text-anchor="middle" font-family="monospace" font-size="3" fill="${hexColor === '#d5d7e1' ? '#333' : '#666'}">${hexColor}</text>
    </svg>`;

    traitItems.push({
      name: capitalizeFirstLetter(bgName),
      filename: `background-${bgName}`,
      svg,
      category: 'Backgrounds',
      type: 'background',
      hexColor,
    });
  });

  return traitItems;
};

const TraitsPage: React.FC = () => {
  const [traits, setTraits] = useState<TraitItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTraits = () => {
      const traitItems = generateTraitItems();
      setTraits(traitItems);
      setLoading(false);
    };

    loadTraits();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Trans>Loading traits...</Trans>
        </div>
      </div>
    );
  }

  // Group traits by category
  const traitsByCategory = traits.reduce(
    (acc, trait) => {
      if (!acc[trait.category]) {
        acc[trait.category] = [];
      }
      acc[trait.category].push(trait);
      return acc;
    },
    {} as Record<string, TraitItem[]>,
  );

  // Define the order for categories
  const categoryOrder = ['Noggles', 'Heads', 'Accessories', 'Bodies', 'Backgrounds'];
  const orderedCategories = categoryOrder.filter(category => traitsByCategory[category]);

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="mb-8">
        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          <Trans>Traits</Trans>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          <Trans>Browse and download all available Noun traits.</Trans>
        </p>
      </div>

      {orderedCategories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">{category}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
            {traitsByCategory[category].map(trait => (
              <Dialog key={trait.filename}>
                <DialogTrigger asChild>
                  <div className="flex h-full cursor-pointer flex-col rounded-lg border border-gray-200 bg-white p-2 transition-shadow hover:shadow-md">
                    <div className="bg-checkerboard mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg shadow-inner">
                      <img
                        src={`data:image/svg+xml;base64,${btoa(trait.svg)}`}
                        alt={trait.name}
                        className="h-full w-full object-contain drop-shadow"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                      <h3 className="text-center text-sm font-medium text-gray-900">
                        {trait.name}
                      </h3>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[min(calc(100vw-2rem),28rem)] rounded-xl">
                  <DialogHeader>
                    <DialogTitle>
                      {trait.name} {capitalizeFirstLetter(trait.type)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-checkerboard flex aspect-square max-w-96 items-center justify-center overflow-hidden rounded-lg shadow-inner">
                      <img
                        src={`data:image/svg+xml;base64,${btoa(trait.svg)}`}
                        alt={trait.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    {trait.type === 'background' ? (
                      <div className="flex flex-col items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(trait.hexColor!)}
                          className="flex items-center gap-2"
                        >
                          <CopyIcon size={16} />
                          Copy Hex Code
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => downloadSVG(trait.svg, trait.filename)}
                          className="flex items-center gap-2"
                        >
                          <DownloadIcon size={16} />
                          SVG
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => downloadPNG(trait.svg, trait.filename)}
                          className="flex items-center gap-2"
                        >
                          <DownloadIcon size={16} />
                          PNG
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TraitsPage;
