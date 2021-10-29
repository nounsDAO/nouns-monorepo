/**
 * Converts an svg string to a base64 encoded png
 * @param svgString string representation of svg
 * @param newWidth width to scale the png to
 * @param newHeight height to scale the png to
 */
export const svg2png = (
  svgString: string,
  newWidth: number = 320,
  newHeight: number = 320,
): Promise<string | null> => {
  return new Promise(resolve => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgString, 'image/svg+xml');
    const modSvg = doc.documentElement;
    const width = Number(modSvg.getAttribute('width'));
    const height = Number(modSvg.getAttribute('height'));

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
        console.log('error converting svg to png: ', e);
        resolve(null);
      }
    };
    img.src = url;
  });
};
