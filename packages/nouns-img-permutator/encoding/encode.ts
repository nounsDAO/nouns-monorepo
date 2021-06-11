import { readPngFile } from 'node-libpng';
import { promises as fs } from 'fs';
import path from 'path';

// Format: Color Index (2 bytes), Length (2 bytes), X-Y Coordinate Tuples [1 Byte, 1 Byte].

type ColorCoordinates = { [color: string]: [number, number][] };

interface ImageData {
  name: string;
  data: string;
}

const LAYER_COUNT = 5;
const OUTPUT_FILE = 'encoded-layers.json';

const toPaddedHex = (c: number, pad = 2) => {
  return c.toString(16).padStart(pad, '0');
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${toPaddedHex(r)}${toPaddedHex(g)}${toPaddedHex(b)}`;
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid Hex Color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const getFolder = (i: number) => `../assets/layer-${i}`;

const getEncodedImage = async (
  folder: string,
  file: string,
  coordinates: ColorCoordinates = {},
) => {
  const image = await readPngFile(path.join(folder, file));

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const { r, g, b, a } = image.rgbaAt(x, y);
      if (a !== 0) {
        const hexColor = rgbToHex(r, g, b);

        coordinates[hexColor] ||= [];
        coordinates[hexColor].push([x, y]);
      }
    }
  }

  const colorCoordinates = Object.values(coordinates);
  const encoded = colorCoordinates.reduce((result, coordinateSet, i) => {
    const coordinates = Buffer.from(coordinateSet.flatMap(([x, y]) => [x, y]));
    if (!coordinates.length) {
      return result;
    }

    result += `${toPaddedHex(i, 4)}${toPaddedHex(
      coordinates.length,
      4,
    )}${coordinates.toString('hex')}`;
    return result;
  }, '0x');

  // Reset coordinates, but keep color indexes
  Object.keys(coordinates).forEach(color => (coordinates[color] = []));

  return encoded;
};

const getAllEncodedImagesInFolder = async (
  folder: string,
  coordinates: ColorCoordinates = {},
) => {
  const images: ImageData[] = [];

  const files = await fs.readdir(folder);
  for (const file of files) {
    images.push({
      name: file.replace(/\.png$/, ''),
      data: await getEncodedImage(folder, file, coordinates),
    });
  }
  return images;
};

const getEncodedImagesForAllLayers = async (
  coordinates: ColorCoordinates = {},
) => {
  const layers: ImageData[][] = [];

  for (let i = 1; i <= LAYER_COUNT; i++) {
    const folder = getFolder(i);
    layers.push(await getAllEncodedImagesInFolder(folder, coordinates));
  }
  return layers;
};

const writeEncodedImagesToFile = async () => {
  const coordinates: ColorCoordinates = {};
  const layers = await getEncodedImagesForAllLayers(coordinates);
  const colors = Object.keys(coordinates).map(hex => {
    const { r, g, b } = hexToRgb(hex);
    return `${r},${g},${b}`;
  });
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify({ colors, layers }, null, 2),
  );
  console.log(`Encoded layers written to ${path.join(__dirname, OUTPUT_FILE)}`);
};

writeEncodedImagesToFile();
