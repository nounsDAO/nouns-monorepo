import fs from 'fs'
import path from 'path'

import { task, types } from 'hardhat/config'
import { parse } from 'csv-parse'
import nameDoc from '../../punks-assets/src/config/punk_name.json'
import probDoc from '../../punks-assets/src/config/probability.json'

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
    const filePath = path.join(__dirname, `../../punks-assets/src/config/og_punks/${fileName}`)
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

task("generate-og-punks", "Generate images of OG Punks with Punk-2 contracts")
    .addOptionalParam(
        'nToken',
        'The `NToken` contract address',
        '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
        types.string,
    )
    .setAction(async ({ nToken }, { ethers, run }) => {
        const nftFactory = await ethers.getContractFactory('NToken');
        const nftContract = nftFactory.attach(nToken);

        const nSeeder = await nftContract.seeder();
        const nSeederFactory = await ethers.getContractFactory('NSeeder');
        const nSeederContract = nSeederFactory.attach(nSeeder);

        const descriptor = await nftContract.descriptor();
        const descriptorFactory = await ethers.getContractFactory(
            'NDescriptorV2',
            { libraries: { NFTDescriptorV2: ethers.constants.AddressZero } }
        );
        const descriptorContract = descriptorFactory.attach(descriptor);

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
                : 0

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

            const tokenImage = await descriptorContract.generateSVGImage(
                seed,
                { gasLimit: 1_000_000_000 }
            );
            const image = Buffer.from(tokenImage, 'base64').toString()

            const formattedI = i.toString().padStart(5, "0")
            fs.writeFileSync(
                "./output/og_ours/punk_" + formattedI + ".svg",
                image
            );
        }
    })