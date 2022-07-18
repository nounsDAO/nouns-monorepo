import { promises as fs } from 'fs';
import { EncodedImage, IEncoder, ImageData, PngImage } from './types';
import { Image } from './image';

/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export class PNGCollectionEncoder implements IEncoder {
  private readonly _transparent: [string, number] = ['', 0];
  private _colors: Map<string, number> = new Map([this._transparent]);
  private _images: Map<string, string> = new Map();
  private _folders: { [name: string]: string[] } = {};

  constructor(colors?: string[]) {
    // Optionally pre-populate colors with an existing palette
    colors?.forEach((color, index) => this._colors.set(color, index));
  }

  /**
   * The flattened run-length encoded image data
   */
  public get images(): EncodedImage[] {
    return this.format(true).root;
  }

  /**
   * The run-length encoded image data and file names in their respective folders
   */
  public get data(): ImageData {
    return { palette: [...this._colors.keys()], images: this.format() };
  }

  /**
   * Decode a PNG image and re-encode using a custom run-length encoding
   * @param image The image name
   * @param png The png image data
   * @param folder An optional containing folder name
   */
  public encodeImage(name: string, png: PngImage, folder?: string): string {
    const image = new Image(png.width, png.height, png.rgbaAt);
    const rle = image.toRLE(this._colors);

    this._images.set(name, rle);

    if (folder) {
      (this._folders[folder] ||= []).push(name);
    }

    return rle;
  }

  /**
   * Write the color palette and encoded part information to a JSON file
   * @param outputFile The output file path and name
   */
  public async writeToFile(outputFile = 'encoded-images.json'): Promise<void> {
    await fs.writeFile(outputFile, JSON.stringify(this.data, null, 2));
  }

  /**
   * Return an object that contains all encoded images in their respective folders.
   * @param flatten Whether all image data should be flattened (no sub-folders)
   */
  private format(flatten = false) {
    const images = new Map(this._images);
    const folders = Object.entries(this._folders);

    let data: Record<string, EncodedImage[]> = {};
    if (!flatten && folders.length) {
      data = folders.reduce<Record<string, EncodedImage[]>>((result, [folder, filenames]) => {
        result[folder] = [];

        // Write all files to the folder, delete from the Map once written.
        filenames.forEach(filename => {
          result[folder].push({
            filename,
            data: images.get(filename) as string,
          });
          images.delete(filename);
        });

        return result;
      }, {});
    }

    // Write all remaining files to `root`
    if (images.size) {
      data.root = [...images.entries()].map(([filename, data]) => ({
        filename,
        data,
      }));
    }
    return data;
  }
}
