export interface NounBRSeed {
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

export interface NounBRData {
  parts: EncodedImage[];
  background: string;
}
