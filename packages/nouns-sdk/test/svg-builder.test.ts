import { expect } from 'chai';
import { promises as fs } from 'fs';
import { join } from 'path';
import { buildSVG } from '../src';
import { default as ImageData } from './lib/data/image-data.json';

describe('buildSVG', () => {
  it('should build a SVG vector image', async () => {
    const nounData = {
      background: "d5d7e1",
      parts: ImageData.images.root
    }

    const svg = buildSVG(nounData.parts, ImageData.palette, nounData.background);
    const expectedSVG = await fs.readFile(join(__dirname, `./lib/data/expected-noun.svg`), 'utf8');

    expect(svg).to.equal(expectedSVG);
  });
});
