/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ColorRGBA, readPngFile } from 'node-libpng';
import { promises as fs } from 'fs';
import path from 'path';

// Format: Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].

interface ImageData {
  name: string;
  data: string;
}

interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface LineBounds {
  left: number;
  right: number;
}

interface Rect {
  length: number;
  colorIndex: number;
}

interface Line {
  rects: Rect[];
  bounds: LineBounds;
}

type Lines = { [number: number]: Line };

const LAYER_COUNT = 4;
const OUTPUT_FILE = 'encoded-layers.json';

const toPaddedHex = (c: number, pad = 2) => {
  return c.toString(16).padStart(pad, '0');
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `${toPaddedHex(r)}${toPaddedHex(g)}${toPaddedHex(b)}`;
};

const getFolder = (i: number) => path.join(__dirname, `../assets/layer-${i}`);

const colors: Map<string, number> = new Map([['', 0]]);

const addPixelToRect = (color: ColorRGBA, lines: Lines, y: number) => {
  const { r, g, b, a } = color;
  const hexColor = rgbToHex(r, g, b);

  if (!colors.has(hexColor)) {
    colors.set(hexColor, colors.size);
  }
  const colorIndex = a === 0 ? 0 : colors.get(hexColor)!;

  lines[y] ||= {
    rects: [],
    bounds: { left: 0, right: 0 },
  };
  const { rects } = lines[y];
  if (!rects.length || rects[rects.length - 1].colorIndex !== colorIndex) {
    rects.push({ length: 1, colorIndex }); // First pixel of line or different color than previous
  } else {
    rects[rects.length - 1].length++; // Same color as the pixel to the left
  }
};

// prettier-ignore
const updateBounds = (bounds: ImageBounds, lines: Lines, y: number) => {
  const { rects } = lines[y];
    if (!(rects[0].length === 32 && rects[0].colorIndex === 0) && bounds.top === 0) {
      bounds.top = y - 1; // shift top bound to `y - 1`
    }
    if (bounds.top !== 0) {
      if ((rects[0].length === 32 && rects[0].colorIndex === 0) || y === 31) {
        if (bounds.bottom === 0) {
          bounds.bottom = y; // Set bottom bound to `y`
        }
      } else {
        bounds.bottom = 0; // Reset bottom bound
      }
    }
    lines[y].bounds = {
      left: rects[0].length,
      right: 32 - rects[rects.length - 1].length,
    };
};

const getEncodedImage = async (folder: string, file: string) => {
  const image = await readPngFile(path.join(folder, file));

  const bounds: ImageBounds = { top: 0, bottom: 0, left: 0, right: 0 };
  const lines: Lines = {};
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      addPixelToRect(image.rgbaAt(x, y), lines, y);
    }
    updateBounds(bounds, lines, y);
  }

  for (let i = 0; i <= bounds.top; i++) {
    delete lines[i]; // Delete all rows above the top bound
  }
  for (let i = 31; i >= bounds.bottom; i--) {
    delete lines[i]; // Delete all rows below the bottom bound
  }

  bounds.left = Math.min(...Object.values(lines).map(l => l.bounds.left));
  bounds.right = Math.max(...Object.values(lines).map(l => l.bounds.right));

  const initial = `0x00${toPaddedHex(bounds.top, 2)}${toPaddedHex(
    bounds.right,
    2,
  )}${toPaddedHex(bounds.bottom, 2)}${toPaddedHex(bounds.left, 2)}`;
  const encoded = Object.values(lines).reduce((result, line) => {
    const lineBuffer = Buffer.from(
      line.rects.flatMap(({ length, colorIndex }, i) => {
        // Line only contains a single rect
        if (i === 0 && i === line.rects.length - 1) {
          return [bounds.right - bounds.left, colorIndex];
        }

        // Set left bound
        if (i === 0) {
          if (length > bounds.left) {
            return [length - bounds.left, colorIndex];
          } else if (length === bounds.left) {
            return [];
          }
        }

        // Set right bound
        if (i === line.rects.length - 1) {
          if (length > 32 - bounds.right) {
            return [length - (32 - bounds.right), colorIndex];
          } else if (length === 32 - bounds.right) {
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
