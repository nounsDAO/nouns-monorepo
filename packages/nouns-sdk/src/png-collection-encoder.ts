/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PngImage } from 'node-libpng';
import { Encoder } from './types';
import { rgbToHex } from './utils';
import { Image } from './image';

/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export class PNGCollectionEncoder implements Encoder {
  private readonly _transparent: [string, number] = ['', 0];
  private _colors: Map<string, number> = new Map([this._transparent]);

  /**
   * Decode a PNG image and re-encode using a custom run-length encoding
   * @param image The PNG image data
   */
  public encodeImage(png: PngImage): string {
    const image = new Image(png.width, png.height);

    // Extract pixel and bounding box data
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const { r, g, b, a } = png.rgbaAt(x, y);
        const hexColor = rgbToHex(r, g, b);

        // Insert the color if it does not yet exist
        if (!this._colors.has(hexColor)) {
          this._colors.set(hexColor, this._colors.size);
        }

        // If alpha is 0, use 'transparent' index, otherwise get color index
        const colorIndex = a === 0 ? 0 : this._colors.get(hexColor)!;

        image.appendPixelToRect(colorIndex, y);
      }
      image.updateImageBounds(y);
    }
    return image.getRLE();
  }
}
