export interface N00unSeed {
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

export interface N00unData {
  parts: EncodedImage[];
  background: string;
}
