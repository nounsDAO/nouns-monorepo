export interface Accessory {
  accType: number;
  accId: number;
}
export interface ISeed {
  punkType: number;
  skinTone: number;
  accessories: Array<Accessory>;
}

export interface EncodedImage {
  filename: string;
  data: string;
}

export interface PunkData {
  parts: EncodedImage[];
//  background: string;
}
