export const svg2png = (
  svgString: string,
  width: number = 320,
  height: number = 320,
): Promise<string | null> => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const DOMURL = window.URL || window.webkitURL || window;
    const img = new Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svg);
    img.onload = () => {
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      DOMURL.revokeObjectURL(png);
      try {
        resolve(png);
      } catch (e) {
        resolve(null);
      }
    };
    img.src = url;
  });
};
