import fs from 'fs'
import path from 'path'

import { task } from 'hardhat/config'
import { parse } from 'csv-parse'
import nameDoc from '../../nouns-assets/src/config/punk_name.json'
import probDoc from '../../nouns-assets/src/config/probability.json'

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
            .on("data", function (row) {
                rows.push(row)
            })
            .on('end', () => {
                resolve(rows)
            });
    })
}

const toByteArray = (value: number, len: number, pad: number): Array<number> => {
    const arr = Array(pad).fill(0)
    for(let i = len - 1; i >= 0; i --) {
        arr[i] = value % 256
        value = Math.floor(value / 256)
    }
    return arr
}

task("create-merkle", "Create merkle tree")
    .setAction(async (_, { ethers, run }) => {
        const values = await Promise.all(fileList.map(getAllRowsFromCSV))
        const punks = values.flat() as Array<Array<string> >

        const accGroupByType = Object.keys(probDoc.acc_types).map(accType => 
            Object.entries(probDoc.accessory_types).filter(entry => entry[1] === accType).map(entry => entry[0])
        )

        const seedHashes = []
        for(let i in punks) {
            const punk = punks[i]
            const punkObj = {
                id: Number(punk[0].trim()),
                type: punk[1].toLowerCase().trim(),
                gender: punk[2].toLowerCase().trim(),
                skinTone: punk[3].trim().toLowerCase(),
                accessories: punk[5].split("/").map(acc => acc.trim()).filter(acc => acc.length > 0),
            }

            let seed: { id?: number, type?: number, skinTone?: number, accessories?: Array<any> } = {}
            seed.type =
                punkObj.type == "human"
                    ? (punkObj.gender == "male" ? 0 : 1)
                    : (punkObj.type == "alien" 
                        ? 2
                        : punkObj.type == "ape" ? 3 : 4)
            
            seed.skinTone =
                punkObj.skinTone == "albino" ? 0
                : punkObj.skinTone == "light" ? 1
                : punkObj.skinTone == "medium" ? 2
                : punkObj.skinTone == "dark" ? 3
                : punkObj.skinTone == "green" ? 4
                : punkObj.skinTone == "brown" ? 5
                : punkObj.skinTone == "blue" ? 6
                : 0

            seed.accessories = punkObj.accessories.map((accName => {
                const accEntry = Object.entries(nameDoc).find((entry: any) => entry[1].name == accName && entry[1].gender == punkObj.gender)
                if(!accEntry) throw new Error("Accessory name not found.")
                const accId = accEntry[0]
                const accTypeIndex = Object.keys(probDoc.acc_types).indexOf((probDoc.accessory_types as any)[accId])
                if(accTypeIndex < 0) throw new Error("Invalid accessory type.")
                const accIndex = accGroupByType[accTypeIndex].indexOf(accId)
                return { accType: accTypeIndex, accId: accIndex }
            }))

            let seedBuffer: Array<number> = []
            seedBuffer = seedBuffer.concat(toByteArray(seed.type, 1, 32))
            seedBuffer = seedBuffer.concat(toByteArray(seed.skinTone, 1, 32))
            seedBuffer = seedBuffer.concat(toByteArray(seed.accessories.length, 32, 32))
            seed.accessories.forEach(accessory => {
                seedBuffer = seedBuffer.concat(toByteArray(accessory.accType, 2, 32))
                seedBuffer = seedBuffer.concat(toByteArray(accessory.accId, 2, 32))
            })
            
            const seedHash = ethers.utils.keccak256(seedBuffer)
            seedHashes.push(seedHash)
        }

        return seedHashes
        
        // const queue = seedHashes.map(hash => ({ hash, parent: null, left: null, right: null }))
        // while(queue.length > 1) {
        //     let a: any, b: any
        //     let firstNode = queue.shift()
        //     let lastNode = queue.shift()
        //     if(queue[0] < queue[1]) {
        //         a = ethers.utils.arrayify(firstNode.hash)
        //         b = ethers.utils.arrayify(lastNode.hash)
        //     } else {
        //         b = ethers.utils.arrayify(firstNode.hash)
        //         a = ethers.utils.arrayify(lastNode.hash)
        //     }
        //     const aBuffer: number[] = Object.values(a), bBuffer: number[] = Object.values(b)
        //     const mergedHash = ethers.utils.keccak256(aBuffer.concat(bBuffer))
        //     const parentNode = { hash: mergedHash, left: firstNode, right: lastNode, parent: null }
        //     firstNode.parent = lastNode.parent = parentNode
        //     queue.push(parentNode)
        // }
        // const merkleRoot = queue[0];
        // console.log(merkleRoot.parent, merkleRoot.left, merkleRoot.right)
    })