export interface IEncoder {
  encodeImage(filename: string, image: unknown): string;
}

export interface Rect {
  length: number;
  colorIndex: number;
}

export interface LineBounds {
  left: number;
  right: number;
}

export interface ImageRow {
  rects: Rect[];
  bounds: LineBounds;
}

export type ImageRows = { [number: number]: ImageRow };

export interface ImageBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface DecodedImage {
  paletteIndex: number;
  bounds: ImageBounds;
  rects: [length: number, colorIndex: number][];
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface ImageData {
  palette: string[];
  images: Record<string, EncodedImage[]>;
}

export interface PngImage {
  width: number;
  height: number;
  rgbaAt(x: number, y: number): RGBAColor;
}
