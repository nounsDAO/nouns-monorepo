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
        }
        console.log("setSkinProbability")

        const accCountProbabilities = 
            probDoc.accessory_count_probabbilities
                .map((value: any) => Math.floor(value * 1000))
        const accResponse = await (await nSeeder.setAccCountProbability(accCountProbabilities)).wait()
        console.log("setAccCountProbability", accCountProbabilities)



        const accTypeCount = Object.keys(probDoc.acc_types).length
        const accTypeAvailabilities =
            Object.values(probDoc.probabilities)
                .map((probObj: any) => {
                    const binaryArray = probObj.accessories.reduce((prev: any, acc: any) => {
                        const typeIndex = Object.keys(probDoc.acc_types).indexOf(acc)
                        if(typeIndex < 0) throw new Error(`Unknown type found in type availability - ${acc}`)
                        prev[typeIndex] = 1
                        return prev
                    }, Array(accTypeCount).fill(0))
                    binaryArray.reverse()
                    return parseInt(binaryArray.join(""), 2)
                })
        const typeAvailabilityResponse = await (await nSeeder.setAccAvailability(accTypeCount, accTypeAvailabilities)).wait()
        console.log("setAccAvailability", accTypeCount, accTypeAvailabilities)

        const accCountPerType = probDoc.types.map((punkType: string) => 
            Object.keys(probDoc.acc_types).map(type => 
                Object.values(probDoc.accessories).filter((item: any) => item.type == type && item.punk.split("").includes(shortPunkType[punkType])).length
            )
        )
        console.log("accCountPerType", accCountPerType)
        const accCountSetResponse = await (await nSeeder.setAccCountPerTypeAndPunk(accCountPerType)).wait()

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