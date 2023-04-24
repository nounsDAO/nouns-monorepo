import { task, types } from 'hardhat/config'

const shortPunkType: any = {
    male: "m",
    female: "f",
    alien: "l",
    ape: "p",
    zombie: "z",
}
task("populate-seeder", "Initialize deployed smart contracts")
    // .addOptionalParam('nToken', 'The NToken contract address')
    // .addOptionalParam('nSeeder', 'The NSeeder contract address')
    // .addOptionalParam('probDoc', 'The Probability config')
    .setAction(async({ nSeeder, probDoc }, { ethers, run, network }) => {

        const typeProbabilities =
        Object.values(probDoc.probabilities)
            .map((probObj: any) => Math.floor(probObj.probability * 1000))
        const typeResponse = await (await nSeeder.setTypeProbability(typeProbabilities)).wait()
        console.log("setTypeProbability", typeProbabilities)
                                                          
        for(let [i, type] of Object.keys(probDoc.probabilities).entries()) {
            const skinProbabilities = 
                probDoc.probabilities[type].skin
                    .map((value: any) => Math.floor(value * 1000))
            const skinResponse = await (await nSeeder.setSkinProbability(i, skinProbabilities)).wait()
            console.log("setSkinProbability", skinProbabilities)
        }

        for(let [i, type] of Object.keys(probDoc.probabilities).entries()) {
            const accCountProbabilities =
                probDoc.probabilities[type].accessory_count_probabbilities
                    .map((value: any) => Math.floor(value * 1000))
            const accCountResponse = await (await nSeeder.setAccCountProbability(i, accCountProbabilities)).wait()
            console.log("setAccCountProbability", accCountProbabilities)
        }

        const accTypeCount = Object.keys(probDoc.acc_types).length

        const accCountPerType = probDoc.types.map((punkType: string) =>
            Object.keys(probDoc.acc_types).map(type => 
                Object.values(probDoc.accessories).filter((item: any) => item.type == type && item.punk.split("").includes(shortPunkType[punkType])).length
            )
        )
        console.log("accCountPerType", accCountPerType)
        const accCountSetResponse = await (await nSeeder.setAccCountPerTypeAndPunk(accCountPerType)).wait()

        // a check
        for (const [punkType, probObj] of Object.entries(probDoc.probabilities)) {
            const punkTypeIndex = Object.values(probDoc.types).indexOf(punkType)
            for (const acc of (probObj as any).accessories) {
                const typeIndex = Object.keys(probDoc.acc_types).indexOf(acc)
                if (typeIndex < 0)
                    throw new Error(`Unknown type found in type availability - ${punkType} ${acc}`)
                if (accCountPerType[punkTypeIndex][typeIndex] == 0)
                    throw new Error(`Zero count of an available accessory - ${punkType} ${acc}`)
            }
            for (const typeIndex in accCountPerType[punkTypeIndex]) {
                if (accCountPerType[punkTypeIndex][typeIndex] > 0) {
                    const acc = Object.keys(probDoc.acc_types)[~~typeIndex]
                    if (Object.values((probObj as any).accessories).indexOf(acc) < 0) {
                        throw new Error(`Non zero count of an unavailable accessory - ${punkType} ${acc}`)
                    }
                }
            }
        }

        const accIdPerType = probDoc.types.map((punkType: string) =>
            Object.keys(probDoc.acc_types).map(type =>
                Object.values(probDoc.accessories).filter((item: any) => item.type == type)
                    .map((item: any, idx: number) => [item.punk.split("").includes(shortPunkType[punkType]), idx])
                    .filter((entry: any) => entry[0])
                    .map((entry: any) => entry[1])
            )
        )
        console.log("accIdPerType", accIdPerType);
        const accIdSetResponse = await (await nSeeder.setAccIdByType(accIdPerType)).wait()

        const exclusives = probDoc.exclusive_groups.reduce((prev: any, group: any, groupIndex: number) => {
            group.forEach((item: any) => {
                const typeIndex = Object.keys(probDoc.acc_types).indexOf(item)
                if(typeIndex < 0) throw new Error(`Unknown type found in exclusive groups - ${item}`)
                prev[typeIndex] = groupIndex
            })
            return prev
        }, Array(accTypeCount).fill(-1))
        let curExclusive = probDoc.exclusive_groups.length;
        for(let i in exclusives)
            if(exclusives[i] < 0)
                exclusives[i] = curExclusive ++
        const exclusiveResponse = await (await nSeeder.setExclusiveAcc(curExclusive, exclusives)).wait()
        console.log("setExclusiveAcc", curExclusive, exclusives)

        

        // for(let i = 0; i < 100; i ++) {
        //     const seed = await nSeeder.generateSeed(i)
        //     console.log(seed)
        //     console.log("---")
        // }

    })