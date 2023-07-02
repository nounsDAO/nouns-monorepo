import fs from 'fs'
import path from 'path'

import { parse } from 'csv-parse'
import nameDoc from '../../punks-assets/src/config/punk_name.json'
import probDoc from '../../punks-assets/src/config/probability.json'

import { ImageData as data, getPunkData } from '@punks/assets'
import { buildSVG } from '../src'

interface Accessory {
  accType: number;
  accId: number;
}

interface ISeed {
  punkType: number;
  skinTone: number;
  accessories: Array<Accessory>;
}


async function main() {
//   const seed: ISeed = {
//     punkType: 1,
//     skinTone: 0,
//     accessories: [
//       {accType: 10, accId: 29},
//       {accType: 11, accId: 6},
//       {accType: 14, accId: 6}
//     ]
//   }
  const seed: ISeed = {
    punkType: 1,
    skinTone: 1,
    accessories: [
      {accType: 3, accId: 2},
      {accType: 8, accId: 18},
      {accType: 11, accId: 7},
      {accType: 12, accId: 13}
    ]
  }
  const { parts } = getPunkData(seed)
  const image = buildSVG(parts, data.palette)
  console.log(image)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})