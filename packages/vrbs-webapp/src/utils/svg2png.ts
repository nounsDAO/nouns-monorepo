/**
 * Converts an svg string to a base64 encoded png
 * @param svgString string representation of svg
 * @param newWidth width to scale the png to
 * @param newHeight height to scale the png to
 */
export const svg2png = (
  svgString: string,
  newWidth = 320,
  newHeight = 320,
): Promise<string | null> => {
  return new Promise(resolve => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const modSvg = doc.documentElement;
    const width = Number(modSvg.getAttribute('width'));
    const height = Number(modSvg.getAttribute('height'));

    if (!canScale(width, newWidth) || !canScale(height, newHeight)) {
      throw new Error(`Unable to scale canvas without unwanted pixel gap`);
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext('2d');
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([modSvg.outerHTML], { type: 'image/svg+xml' });
    const url = DOMURL.createObjectURL(svg);
    img.onload = () => {
      if (!ctx) return;
      ctx.scale(newWidth / width, newHeight / height);
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      DOMURL.revokeObjectURL(png);
      try {
        resolve(png);
      } catch (e) {
        console.log('Error converting SVG to PNG:', e);
        resolve(null);
      }
    };
    img.src = url;
  });
};

/**
 * Determine if the image can be scaled without creating a pixel gap.
 * This will occur if the `desired` pixel length divided by the `current`
 * pixel length has more than one decimal place.
 * @param current The current pixel length
 * @param desired The desired pixel length
 */
const canScale = (current: number, desired: number) => {
  const result = desired / current;
  const decimals = result.toString().split('.')?.[1]?.length ?? 0;
  return decimals <= 1;
};
