import { DecodedImage } from './types';

export class Decoder {
  public getImageData(image: string): DecodedImage {
    const data = image.replace(/^0x/, '');
    const paletteIndex = parseInt(data.substring(0, 2), 16);
    const bounds = {
      top: parseInt(data.substring(2, 4), 16),
      right: parseInt(data.substring(4, 6), 16),
      bottom: parseInt(data.substring(6, 8), 16),
      left: parseInt(data.substring(8, 10), 16),
    };
    const rects = data.substring(10);

    return {
      paletteIndex,
      bounds,
      rects:
        rects
          .match(/.{1,4}/g)
          ?.map(rect => [parseInt(rect.substring(0, 2), 16), parseInt(rect.substring(2, 4), 16)]) ||
        [],
    };
  }
}
