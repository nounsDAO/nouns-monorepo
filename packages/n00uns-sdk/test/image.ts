// /* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ImageBounds, ImageRow, ImageRows, Rect, RGBAColor } from '../src/image/types';
import { rgbToHex, toPaddedHex } from '../src/image/utils';

/**
 * A class used to convert an image into the following RLE format:
 * Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][].
 *
 * This is no longer in active use, here just for testing purposes
 */
export class Image {
  private _width: number;
  private _height: number;
  private _rows: ImageRows = {};
  private _bounds: ImageBounds = { top: 0, bottom: 0, left: 0, right: 0 };
  private _rle: string | undefined;

  /**
   * The image's pixel width
   */
  get width(): number {
    return this._width;
  }

  /**
   * The image's pixel height
   */
  get height(): number {
    return this._height;
  }

  /**
   * The number of rows to run-length encode
   */
  get rows(): ImageRows {
    return this._rows;
  }

  /**
   * The bounds of the inner rect to run-length encode
   */
  get bounds(): ImageBounds {
    return this._bounds;
  }

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  /**
   * Convert an image to a run-length encoded string using the provided RGBA
   * and color palette values.
   * @param getRgbaAt A function used to fetch the RGBA values at specific x-y coordinates
   * @param colors The color palette map
   */
  public toRLE(
    getRgbaAt: (x: number, y: number) => RGBAColor,
    colors: Map<string, number>,
  ): string {
    if (!this._rle) {
      this._rle = this.encode(getRgbaAt, colors);
    }
    return this._rle;
  }

  /**
   * Using the image pixel inforation, run-length encode an image.
   * @param getRgbaAt A function used to fetch the RGBA values at specific x-y coordinates
   * @param colors The color palette map
   */
  private encode(
    getRgbaAt: (x: number, y: number) => RGBAColor,
    colors: Map<string, number>,
  ): string {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const { r, g, b, a } = getRgbaAt(x, y);
        const hexColor = rgbToHex(r, g, b);

        // Insert the color if it does not yet exist
        if (!colors.has(hexColor)) {
          colors.set(hexColor, colors.size);
        }

        // If alpha is 0, use 'transparent' index, otherwise get color index
        const colorIndex = a === 0 ? 0 : colors.get(hexColor)!;

        this.appendPixelToRect(colorIndex, y);
      }
      this.updateImageBounds(y);
    }

    this.deleteEmptyRows();

    // Set the left and right bounds. Return early if empty
    const rowCount = Object.keys(this._rows).length;
    if (rowCount) {
      this._bounds.left = Math.min(...Object.values(this._rows).map(r => r.bounds.left));
      this._bounds.right = Math.max(...Object.values(this._rows).map(r => r.bounds.right));

      // Exit early if image is empty
      const [rect] = this._rows[0]?.rects || [];
      if (rowCount === 1 && this.isEmptyRow(rect)) {
        return '0x0000000000';
      }
    }

    const encodedBounds = this.getEncodedBounds(this._bounds);
    const encodedImage = Object.values(this._rows).reduce((result, row) => {
      result += this.getEncodedRow(row, this._bounds);
      return result;
    }, encodedBounds);

    return encodedImage;
  }

  /**
   * Append a single pixel to a new or existing rect
   * @param colorIndex The color array index
   * @param y The current `y` coordinate
   */
  private appendPixelToRect(colorIndex: number, y: number): void {
    // Create the row if it does not exist yet
    const { rects } = (this._rows[y] ||= {
      rects: [],
      bounds: { left: 0, right: 0 },
    });

    // First pixel of line or different color than previous
    if (!rects.length || rects[rects.length - 1].colorIndex !== colorIndex) {
      rects.push({ length: 1, colorIndex });
      return;
    }

    // Same color as the pixel to the left
    rects[rects.length - 1].length++;
  }

  /**
   * Update the bounds of the provided image
   * @param y The current `y` coordinate
   */
  private updateImageBounds(y: number): void {
    const { rects } = this._rows[y];

    // Shift top bound to `y` if row is not empty and top bound is 0
    if (!this.isEmptyRow(rects[0]) && this._bounds.top === 0) {
      this._bounds.top = y;
    }

    if (this._bounds.top !== 0) {
      // Set bottom bound to `y` if row is empty or we're on the last row.
      // Otherwise, reset the bottom bound
      if (this.isEmptyRow(rects[0])) {
        if (this._bounds.bottom === 0) {
          this._bounds.bottom = y - 1;
        }
      } else if (y === 31) {
        this._bounds.bottom = y;
      } else {
        this._bounds.bottom = 0;
      }
    }

    this._rows[y].bounds = {
      left: rects[0].length,
      right: this._width - rects[rects.length - 1].length,
    };
  }

  /**
   * Delete all empty rows. That is, all rows above the top bound or
   * below the lower bound
   */
  private deleteEmptyRows(): void {
    // Delete all rows above the top bound
    for (let i = 0; i < this._bounds.top; i++) {
      delete this._rows[i];
    }

    // Delete all rows below the bottom bound
    for (let i = this._height - 1; i > this._bounds.bottom; i--) {
      delete this._rows[i];
    }
  }

  /**
   * Get the encoded part bounds string
   * @param bounds The part bounds
   */
  private getEncodedBounds(bounds: ImageBounds) {
    const top = toPaddedHex(bounds.top, 2);
    const right = toPaddedHex(bounds.right, 2);
    const bottom = toPaddedHex(bounds.bottom, 2);
    const left = toPaddedHex(bounds.left, 2);
    return `0x00${top}${right}${bottom}${left}`;
  }

  /**
   * Get a single row encoded as a hex string
   * @param row The row data
   * @param bounds The image bounds
   */
  private getEncodedRow(row: ImageRow, bounds: ImageBounds) {
    const rowBuffer = Buffer.from(
      row.rects.flatMap(({ length, colorIndex }, i) => {
        // Row only contains a single rect
        if (i === 0 && i === row.rects.length - 1) {
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
        if (i === row.rects.length - 1) {
          if (length > this._width - bounds.right) {
            return [length - (this._width - bounds.right), colorIndex];
          } else if (length === this._width - bounds.right) {
            return [];
          }
        }
        return [length, colorIndex];
      }),
    );
    return rowBuffer.toString('hex');
  }

  /**
   * Determine if the provided rect fills the entire row and is transparent
   * @param rect The rect to inspect
   */
  private isEmptyRow(rect: Rect) {
    return rect?.length === this._width && rect?.colorIndex === 0;
  }
}
