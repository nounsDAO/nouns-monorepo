/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { promises as fs } from 'fs';
import path from 'path';

// Format: Color Index (2 bytes), Length (2 bytes), X-Y Coordinate Tuples [1 Byte, 1 Byte].

interface ImageData {
  name: string;
  data: string;
}

interface EncodedData {
  colors: string[];
  layers: ImageData[][];
}

interface ColorCoordinates {
  colorIndex: number;
  coordinates: [number, number][];
}

const OUTPUT_FILE = 'random-noun.svg';

const decodeImage = (image: string) => {
  const colorCoordinates: ColorCoordinates[] = [];

  let remaining = image.replace(/^0x/, '');
  while (remaining.length > 0) {
    const colorIndex = parseInt(remaining.substring(0, 4), 16);
    const coordinateLength = parseInt(remaining.substring(4, 8), 16);
    const coordinates = remaining.substring(8, 8 + coordinateLength * 2);

    colorCoordinates.push({
      colorIndex,
      coordinates: coordinates
        .match(/.{1,4}/g)!
        .map(set => [
          parseInt(set.substring(0, 2), 16),
          parseInt(set.substring(2, 4), 16),
        ]),
    });
    remaining = remaining.substring(8 + coordinateLength * 2);
  }
  return colorCoordinates;
};

const getRandom = (array: ImageData[]) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomNoun = async () => {
  const fileJSON = await fs.readFile('encoded-layers.json', 'utf8');
  const data: EncodedData = JSON.parse(fileJSON);

  const [bodies, accessories, heads, glasses, arms] = data.layers;
  const parts = [
    getRandom(bodies),
    getRandom(accessories),
    getRandom(heads),
    getRandom(glasses),
    getRandom(arms),
  ];

  const svgWithoutEndTag = parts.reduce((result, part) => {
    const rects: string[] = [];

    const color = decodeImage(part.data);
    color.forEach(color => {
      const rgbColor = data.colors[color.colorIndex];
      color.coordinates.forEach(coordinate => {
        const [x, y] = coordinate;
        rects.push(
          `<rect width="10" height="10" x="${x * 10}" y="${
            y * 10
          }" fill="rgb(${rgbColor})" />`,
        );
      });
    });
    result += rects.join('');
    return result;
  }, '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="320" height="320">');

  return `${svgWithoutEndTag}</svg>`;
};

const createRandomNoun = async () => {
  const svg = await getRandomNoun();
  await fs.writeFile(OUTPUT_FILE, svg);
  console.log(`Random Noun written to ${path.join(__dirname, OUTPUT_FILE)}`);
};

createRandomNoun();
