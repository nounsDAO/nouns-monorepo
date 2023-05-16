import { DecodedImage } from './types';

/**
 * Decode the RLE image data into a format that's easier to consume in `buildSVG`.
 * @param image The RLE image data
 */
export const decodeImage = (image: string): DecodedImage => {
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
        ?.match(/.{1,4}/g)
        ?.map(rect => [parseInt(rect.substring(0, 2), 16), parseInt(rect.substring(2, 4), 16)]) ??
      [],
  };
};

/**
 * @notice Given an x-coordinate, draw length, and right bound, return the draw
 * length for a single SVG rectangle.
 */
const getRectLength = (currentX: number, drawLength: number, rightBound: number): number => {
  const remainingPixelsInLine = rightBound - currentX;
  return drawLength <= remainingPixelsInLine ? drawLength : remainingPixelsInLine;
};

/**
 * Given RLE parts, palette colors, and a background color, build an SVG image.
 * @param parts The RLE part datas
 * @param paletteColors The hex palette colors
 * @param bgColor The hex background color
 */
export const buildSVG = (
  parts: { data: string }[],
  paletteColors: string[],
// bgColor: string,
): string => {
  const svgWithoutEndTag = parts.reduce((result, part) => {
    const svgRects: string[] = [];
    const { bounds, rects } = decodeImage(part.data);

    let currentX = bounds.left;
    let currentY = bounds.top;

    rects.forEach(draw => {
      let [drawLength, colorIndex] = draw;

      let length = getRectLength(currentX, drawLength, bounds.right);
      while (length > 0) {
        // Do not push rect if transparent
        if (colorIndex !== 0) {
          const hexColor = paletteColors[colorIndex].substring(0, 6);
          const hexOpacity = paletteColors[colorIndex].substring(6);
          if (hexOpacity == 'ff') {
            svgRects.push(
              `<rect width="${length * 4}" height="4" x="${currentX * 4}" y="${
                currentY * 4
              }" fill="#${hexColor}" />`,
            );
          } else {
            const opacity = Math.floor(parseInt(hexOpacity, 16) * 100 / 255)
            svgRects.push(
              `<rect width="${length * 4}" height="4" x="${currentX * 4}" y="${
                currentY * 4
              }" fill="#${hexColor}" opacity="0.${opacity}" />`,
            );
          }
        }

        currentX += length;
        if (currentX === bounds.right) {
          currentX = bounds.left;
          currentY++;
        }

        drawLength -= length;
        length = getRectLength(currentX, drawLength, bounds.right);
      }
    });
    result += svgRects.join('');
    return result;
  }, `<svg width="384" height="384" viewBox="0 0 384 384" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" fill="#597A8A"><rect width="100%" height="100%" />`);

  return `${svgWithoutEndTag}</svg>`;
};
