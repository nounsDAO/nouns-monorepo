/**
 * Convert the provided number to a passed hex string
 * @param c
 * @param pad The desired number of chars in the hex string
 */
export const toPaddedHex = (c: number, pad = 2): string => {
  return c.toString(16).padStart(pad, '0');
};

/**
 * Convert an RGB color to hex (without `#` prefix)
 * @param r The red value
 * @param g The green value
 * @param b The blue value
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `${toPaddedHex(r)}${toPaddedHex(g)}${toPaddedHex(b)}`;
};
