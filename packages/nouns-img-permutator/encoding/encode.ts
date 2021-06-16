/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { readPngFile } from 'node-libpng';
import { promises as fs } from 'fs';
import path from 'path';

// Format: Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].

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
  return `0x${toPaddedHex(r)}${toPaddedHex(g)}${toPaddedHex(b)}`;
};

const getFolder = (i: number) => `../assets/layer-${i}`;

const colors: Map<string, number> = new Map([['0x123456', 0]]);

const getEncodedImage = async (folder: string, file: string) => {
  const image = await readPngFile(path.join(folder, file));

  const bounds = { topY: 0, bottomY: 0, leftX: 0, rightX: 0 };
  const lineBounds: { [number: number]: { leftX: number; rightX: number } } =
    {};
  const lines: { [number: number]: [length: number, colorIndex: number][] } =
    {};
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const { r, g, b, a } = image.rgbaAt(x, y);
      const hexColor = rgbToHex(r, g, b);

      if (!colors.has(hexColor)) {
        colors.set(hexColor, colors.size);
      }
      const colorIndex = a === 0 ? 0 : colors.get(hexColor)!;

      lines[y] ||= [];
      if (!lines[y].length || lines[y][lines[y].length - 1][1] !== colorIndex) {
        lines[y].push([1, colorIndex]); // First pixel of line or different color than previous
      } else {
        lines[y][lines[y].length - 1][0]++; // Same color as the pixel to the left
      }
    }
    if (!(lines[y][0][0] === 32 && lines[y][0][1] === 0) && bounds.topY === 0) {
      bounds.topY = y - 1; // shift top bound to `y - 1`
    }
    if (bounds.topY !== 0) {
      if ((lines[y][0][0] === 32 && lines[y][0][1] === 0) || y === 31) {
        if (bounds.bottomY === 0) {
          bounds.bottomY = y; // Set bottom bound to `y`
        }
      } else {
        bounds.bottomY = 0; // Reset bottom bound
      }
    }
    lineBounds[y] = {
      leftX: lines[y][0][0],
      rightX: 32 - lines[y][lines[y].length - 1][0],
    };
  }
  for (let i = 0; i <= bounds.topY; i++) {
    delete lines[i]; // Delete all rows above the top bound
    delete lineBounds[i];
  }
  for (let i = 31; i >= bounds.bottomY; i--) {
    delete lines[i]; // Delete all rows below the bottom bound
    delete lineBounds[i];
  }
  bounds.leftX = Math.min(...Object.values(lineBounds).map(b => b.leftX));
  bounds.rightX = Math.max(...Object.values(lineBounds).map(b => b.rightX));

  const initial = `0x00${toPaddedHex(bounds.topY, 2)}${toPaddedHex(
    bounds.rightX,
    2,
  )}${toPaddedHex(bounds.bottomY, 2)}${toPaddedHex(bounds.leftX, 2)}`;
  const encoded = Object.values(lines).reduce((result, line) => {
    const lineBuffer = Buffer.from(
      line.flatMap(([length, colorIndex], i) => {
        if (i === 0 && i === line.length - 1) {
          return [bounds.rightX - bounds.leftX, colorIndex];
        }

        if (i === 0) {
          if (length > bounds.leftX) {
            return [length - bounds.leftX, colorIndex];
          } else if (length === bounds.leftX) {
            return [];
          }
        }
        if (i === line.length - 1) {
          if (length > 32 - bounds.rightX) {
            return [length - (32 - bounds.rightX), colorIndex];
          } else if (length === 32 - bounds.rightX) {
            return [];
          }
        }
        return [length, colorIndex];
      }),
    );

    result += lineBuffer.toString('hex');
    return result;
  }, initial);

  return encoded;
};

const getAllEncodedImagesInFolder = async (folder: string) => {
  const images: ImageData[] = [];

  const files = await fs.readdir(folder);
  for (const file of files) {
    images.push({
      name: file.replace(/\.png$/, ''),
      data: await getEncodedImage(folder, file),
    });
  }
  return images;
};

const getEncodedImagesForAllLayers = async () => {
  const layers: ImageData[][] = [];

  for (let i = 1; i <= LAYER_COUNT; i++) {
    const folder = getFolder(i);
    layers.push(await getAllEncodedImagesInFolder(folder));
  }
  return layers;
};

const writeEncodedImagesToFile = async () => {
  const layers = await getEncodedImagesForAllLayers();
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify({ colors: [...colors.keys()], layers }, null, 2),
  );
  console.log(`Encoded layers written to ${path.join(__dirname, OUTPUT_FILE)}`);
};

writeEncodedImagesToFile();
