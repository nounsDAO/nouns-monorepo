/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { promises as fs } from 'fs';
import path from 'path';

// Format: Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].

interface ImageData {
  name: string;
  data: string;
}

interface EncodedData {
  colors: string[];
  layers: ImageData[][];
}

interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}

const OUTPUT_FILE = 'random-noun.svg';

const decodeImage = (image: string): DecodedImage => {
  const data = image.replace(/^0x/, '');
  const paletteIndex = parseInt(data.substring(0, 2), 16);
  const bounds = {
    top: parseInt(data.substring(2, 4), 16),
    right: parseInt(data.substring(4, 6), 16),
    bottom: parseInt(data.substring(6, 8), 16),
    left: parseInt(data.substring(8, 10), 16),
  };
  const rects = data.substring(10);

  return {
    paletteIndex,
    bounds,
    rects: rects
      .match(/.{1,4}/g)!
      .map(rect => [
        parseInt(rect.substring(0, 2), 16),
        parseInt(rect.substring(2, 4), 16),
      ]),
  };
};

const getRandom = (array: ImageData[]) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomNoun = async () => {
  const fileJSON = await fs.readFile('encoded-layers.json', 'utf8');
  const data: EncodedData = JSON.parse(fileJSON);

  const [bodies, accessories, heads, glasses] = data.layers;
  const parts = [
    getRandom(bodies),
    getRandom(accessories),
    getRandom(heads),
    getRandom(glasses),
  ];

  const svgWithoutEndTag = parts.reduce((result, part) => {
    const svgRects: string[] = [];
    const { bounds, rects } = decodeImage(part.data);

    let currentX = bounds.left;
    let currentY = bounds.top;

    const boundWidth = bounds.right - bounds.left;

    rects.forEach(rect => {
      const [length, colorIndex] = rect;
      const hexColor = data.colors[colorIndex];

      // Do not push rect if transparent
      if (colorIndex !== 0) {
        svgRects.push(
          `<rect width="${length * 10}" height="10" x="${currentX * 10}" y="${
            currentY * 10
          }" fill="#${hexColor}" />`,
        );
      }

      currentX += length;
      if (currentX - bounds.left === boundWidth) {
        currentX = bounds.left;
        currentY++;
      }
    });
    result += svgRects.join('');
    return result;
  }, '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">');

  return `${svgWithoutEndTag}</svg>`;
};

const createRandomNoun = async () => {
  const svg = await getRandomNoun();
  await fs.writeFile(OUTPUT_FILE, svg);
  console.log(`Random Noun written to ${path.join(__dirname, OUTPUT_FILE)}`);
};

createRandomNoun();
