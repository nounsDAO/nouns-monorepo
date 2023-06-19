export interface VrbSeed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface VrbData {
  parts: EncodedImage[];
  background: string;
}
