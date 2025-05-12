import { Image } from './image';
import { EncodedImage, IEncoder, ImageData, PngImage } from './types';

/**
 * A class used to convert PNG images into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 */
export class PNGCollectionEncoder implements IEncoder {
  private readonly _transparent: [string, number] = ['', 0];
  private _colors: Map<string, number> = new Map([this._transparent]);
  private _images: Map<string, string> = new Map();
  private _folders: { [name: string]: string[] } = {};
  private _fs: any | null = null;
  private _isNode: boolean;

  constructor(colors?: string[]) {
    // Determine environment
    this._isNode = typeof window === 'undefined';

    // Dynamically import fs only in Node environment
    if (this._isNode) {
      try {
        // Use dynamic import to avoid bundler issues
        import('fs').then(fs => (this._fs = fs.promises));
      } catch (e) {
        console.warn('File system module not available');
      }
    }

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
   * Node.js environment only
   * @param outputFile The output file path and name
   */
  public async writeToFile(outputFile = 'encoded-images.json'): Promise<void> {
    if (!this._isNode || !this._fs) {
      throw new Error('writeToFile is only available in Node.js environments');
    }

    await this._fs.writeFile(outputFile, JSON.stringify(this.data, null, 2));
  }

  /**
   * Get the encoded data as a JSON string
   * Works in both Node.js and browser environments
   */
  public toJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Download the encoded data as a JSON file (browser only)
   * @param filename The name of the file to download
   */
  public downloadJSON(filename = 'encoded-images.json'): void {
    if (this._isNode) {
      throw new Error('downloadJSON is only available in browser environments');
    }

    const jsonData = this.toJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
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
