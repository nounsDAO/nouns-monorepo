/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PNG } from 'pngjs';
import { RGBAColor } from './types';
import { rgbToHex, toPaddedHex } from './utils';

/**
 * A class used to convert an image into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export class Image {
  private _rle: string | undefined;

  /**
   * Convert an image to a run-length encoded string using the provided RGBA
   * and color palette values.
   * @param png The PNG image data
   * @param getRgbaAt A function used to fetch the RGBA values at specific x-y coordinates
   * @param colors The color palette map
   */
  public toRLE(
    png: Buffer,
    getRgbaAt: (x: number, y: number) => RGBAColor,
    colors: Map<string, number>,
  ): string {
    if (!this._rle) {
      this._rle = this.encode(png, getRgbaAt, colors);
    }
    return this._rle;
  }

  /**
   * Using the image pixel inforation, run-length encode an image.
   * @param png The PNG image data
   * @param png A function used to fetch the RGBA values at specific x-y coordinates
   * @param getRgbaAt A function used to fetch the RGBA values at specific x-y coordinates
   * @param colors The color palette map
   */
  private encode(
    png: Buffer,
    getRgbaAt: (x: number, y: number) => RGBAColor,
    colors: Map<string, number>,
  ): string {
    const indexes: number[] = [];

    const bounds = this.getContentBounds(png);
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        const { r, g, b, a } = getRgbaAt(x, y);
        const hexColor = rgbToHex(r, g, b);

        // Insert the color if it does not yet exist
        if (!colors.has(hexColor)) {
          colors.set(hexColor, colors.size);
        }

        // If alpha is 0, use 'transparent' index, otherwise get color index
        indexes.push(a === 0 ? 0 : colors.get(hexColor)!);
      }
    }

    console.log(indexes);

    const encode = (data: number[]) => {
      const encoding: string[] = [];
      let previous = data[0];
      let count = 1;
    
      for (let i = 1; i < data.length; i++) {
        if (data[i] !== previous) {
          encoding.push(toPaddedHex(count), toPaddedHex(previous));
          count = 1;
          previous = data[i];
        } else {
          count++;
        }
      }
      return encoding.join('');
    }

    const paletteIndex = toPaddedHex(0, 2);
    const top = toPaddedHex(bounds.y, 2);
    const right = toPaddedHex(bounds.x + bounds.width, 2);
    const bottom = toPaddedHex(bounds.y + bounds.height, 2);
    const left = toPaddedHex(bounds.x, 2);

    return `0x${paletteIndex}${top}${right}${bottom}${left}${encode(indexes)}`
  }

  private getContentBounds(buffer: Buffer) {
    const png = PNG.sync.read(buffer);
    const { width, height, data } = png;
    const bound = {
      x: 0,
      y: 0,
      width,
      height,
    };

    const getOffset = (x: number, y: number) => {
      return y * width * 4 + x * 4;
    };

    const isTransparent = (x: number, y: number) => {
      const from = getOffset(x, y);

      return data[from + 3] === 0;
    };

    const getBorders = (isVertical: boolean, x0: number, x1: number, y0: number, y1: number) => {
      let i, j, transparentLine;
      const borders: { p: number; transparent: boolean }[] = [];

      const fromJ = isVertical ? y0 : x0;
      const toJ = isVertical ? y1 : x1;
      const fromI = isVertical ? x0 : y0;
      const toI = isVertical ? x1 : y1;
      for (j = fromJ; j < toJ; j++) {
        transparentLine = true;
        for (i = fromI; i < toI; i++) {
          const transparent = isVertical ? isTransparent(i, j) : isTransparent(j, i);
          if (!transparent) {
            transparentLine = false;
          }
        }

        const last = borders[borders.length - 1];
        if (borders.length === 0 || last.transparent !== transparentLine) {
          borders.push({
            p: j,
            transparent: transparentLine,
          });
        }
      }

      return borders;
    };

    const h = getBorders(false, 0, width, 0, height);
    const v = getBorders(true, 0, width, 0, height);

    if (h.length > 1) {
      if (h[0].transparent) {
        bound.x = h[1].p;
      }
      const lh = h.length - 1;
      bound.width = (h[lh].transparent ? h[lh].p : width) - bound.x;
    } else if (h[0].transparent) {
      bound.width = 0;
    }
    if (v.length > 1) {
      if (v[0].transparent) {
        bound.y = v[1].p;
      }
      const lv = v.length - 1;
      bound.height = (v[lv].transparent ? v[lv].p : height) - bound.y;
    } else if (v[0].transparent) {
      bound.height = 0;
    }

    return bound;
  }
}
