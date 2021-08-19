/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PngImage } from 'node-libpng';
import { promises as fs } from 'fs';
import { EncodedImage, IEncoder } from './types';
import { Image } from './image';

/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export class PNGCollectionEncoder implements IEncoder {
  private readonly _transparent: [string, number] = ['', 0];
  private _colors: Map<string, number> = new Map([this._transparent]);
  private _images: Map<string, string> = new Map();

  /**
   * The run-length encoded image data and file names
   */
  public get parts(): EncodedImage[] {
    return [...this._images.entries()].map(([filename, data]) => ({
      filename,
      data,
    }));
  }

  /**
   * Decode a PNG image and re-encode using a custom run-length encoding
   * @param image The PNG image data
   */
  public encodeImage(filename: string, png: PngImage): string {
    const image = new Image(png.width, png.height);
    const rle = image.toRLE((x, y) => png.rgbaAt(x, y), this._colors);

    this._images.set(filename, rle);

    return rle;
  }

  /**
   * Write the color palette and encoded part information to a JSON file
   * @param outputFile The output file path and name
   */
  public async writeToFile(outputFile = 'encoded-images.json'): Promise<void> {
    await fs.writeFile(
      outputFile,
      JSON.stringify({ partcolors: [...this._colors.keys()], parts: this.parts }, null, 2),
    );
  }
}
