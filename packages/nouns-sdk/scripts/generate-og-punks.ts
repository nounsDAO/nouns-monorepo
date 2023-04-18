import fs from 'fs'
import path from 'path'

import { parse } from 'csv-parse'
import nameDoc from '../../nouns-assets/src/config/punk_name.json'
import probDoc from '../../nouns-assets/src/config/probability.json'

import { ImageData as data, getPunkData } from '@nouns/assets'
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

const fileList = [
    '0-999.csv',
    '1000-1999.csv',
    '2000-2999.csv',
    '3000-3999.csv',
    '4000-4999.csv',
    '5000-5999.csv',
    '6000-6999.csv',
    '7000-7999.csv',
    '8000-8999.csv',
    '9000-9999.csv'
]

const getAllRowsFromCSV = (fileName: string) => {
    const rows: Array<any> = []
    const filePath = path.join(__dirname, `../../nouns-assets/src/config/og_punks/${fileName}`)
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row: any) {
                rows.push(row)
            })
            .on('end', () => {
                resolve(rows)
            });
    })
}

async function main() {
  const values = await Promise.all(fileList.map(getAllRowsFromCSV))
  const punks = values.flat() as Array<Array<string> >

  const accGroupByType = Object.keys(probDoc.acc_types).map(accType =>
    Object.entries(probDoc.accessories).filter(entry => entry[1].type === accType).map(entry => entry[0])
  )

  for (let i = 0; i < 10_000; i++) {
    // this part is the same as create-merkle
    const punk = punks[i]
    const punkObj = {
      id: Number(punk[0].trim()),
      type: punk[1].toLowerCase().trim(),
      gender: punk[2].toLowerCase().trim(),
      skinTone: punk[3].trim().toLowerCase(),
      accessories: punk[5].split("/").map(acc => acc.trim()).filter(acc => acc.length > 0),
    }

    const punkType =
      punkObj.type == "human"
        ? (punkObj.gender == "male" ? 0 : 1)
        : (punkObj.type == "alien"
          ? 2
          : punkObj.type == "ape" ? 3 : 4)

    const skinTone =
      punkObj.skinTone == "albino" ? 0
      : punkObj.skinTone == "light" ? 1
      : punkObj.skinTone == "medium" ? 2
      : punkObj.skinTone == "dark" ? 3
      : punkObj.skinTone == "green" ? 4
      : punkObj.skinTone == "brown" ? 5
      : punkObj.skinTone == "blue" ? 6
      : punkObj.type == "alien" ? 6
      : punkObj.type == "ape" ? 5
      : punkObj.type == "zombie" ? 4
      : 7

    const accessories = punkObj.accessories.map((accName => {
      const accEntry = Object.entries(nameDoc).find((entry: any) => entry[1].name == accName && entry[1].gender == punkObj.gender)
      if(!accEntry) throw new Error("Accessory name not found.")
      const accId = accEntry[0]
      const accTypeIndex = Object.keys(probDoc.acc_types).indexOf((probDoc.accessories as any)[accId].type)
      if(accTypeIndex < 0) throw new Error("Invalid accessory type.")
      const accIndex = accGroupByType[accTypeIndex].indexOf(accId)
      return { accType: accTypeIndex, accId: accIndex }
    }))
    const seed = { punkType, skinTone, accessories }
    // ------------------

    const { parts } = getPunkData(seed)
    const image = buildSVG(parts, data.palette)

    const formattedI = i.toString().padStart(5, "0")
    fs.writeFileSync(
      "./output/og_sdk/punk_" + formattedI + ".svg",
      image
    );
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})