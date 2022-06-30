import { expect } from 'chai';
import { join } from 'path';
import { Image2 } from '../src/image/image2';
import { Image } from '../src/image/image';
import { readPngImage } from './lib';
import { buildSVG } from '../src';
import { glob } from 'glob';

async function encodeSingleLineRLE(filepath: string) {
  const transparent: [string, number] = ['', 0];
  const colors: Map<string, number> = new Map([transparent]);
  const pngImage = await readPngImage(filepath);
  const image = new Image(pngImage.width, pngImage.height);
  const rle = image.toRLE(pngImage.rgbaAt, colors);
  return { rle, colors };
}

async function encodeMultiLineRLE(filepath: string) {
  const transparent: [string, number] = ['', 0];
  const colors: Map<string, number> = new Map([transparent]);
  const pngImage = await readPngImage(filepath);
  const image = new Image2(pngImage.width, pngImage.height, pngImage.rgbaAt);
  const rle = image.toRLE(colors);
  return { rle, colors };
}

describe('Image2', () => {
  it('builds the same svg with both encoders', async () => {
    const filepath = join(__dirname, `./lib/images/head-cone.png`);
    const { rle: rle1, colors: colors1 } = await encodeSingleLineRLE(filepath);
    const { rle: rle2, colors: colors2 } = await encodeMultiLineRLE(filepath);

    const svg1 = buildSVG([{ data: rle1 }], Array.from(colors1.keys()), 'ffffff');
    const svg2 = buildSVG([{ data: rle2 }], Array.from(colors2.keys()), 'ffffff');

    expect(svg1).to.be.equal(svg2);
  });

  it('builds the same svg for all images', async () => {
    const transparent: [string, number] = ['', 0];

    const filepaths = glob.sync(join(__dirname, '../../nouns-assets/images/+(1|2|3|4)*/*.png'));

    for (const filepath of filepaths) {
      const { rle: rle1, colors: colors1 } = await encodeSingleLineRLE(filepath);
      const { rle: rle2, colors: colors2 } = await encodeMultiLineRLE(filepath);

      const svg1 = buildSVG([{ data: rle1 }], Array.from(colors1.keys()), 'ffffff');
      const svg2 = buildSVG([{ data: rle2 }], Array.from(colors2.keys()), 'ffffff');

      expect(svg1).to.be.equal(svg2);
    }
  });
});
