import { task } from 'hardhat/config'

task("register-og-punks", "Register original cryptopunks for duplication check")
    .setAction(async ({ nToken }, { ethers, run }) => {

        const punkHashes = await run("create-merkle")
        console.log("register-og-punks:", punkHashes.length)

        const sliceCount = 200
        let gasUsed = 0
        let gasCost = ethers.constants.Zero
        //for(let i = 0; i < punkHashes.length; i += sliceCount) {
        for(let i = 0; i < punkHashes.length; i += sliceCount) {
            const count = (i + sliceCount) > punkHashes.length ? (punkHashes.length - i) : sliceCount
            const regRes = await (await nToken.registerOGHashes(punkHashes.slice(i, i + count))).wait()
            gasUsed += Number(regRes.gasUsed)
            gasCost = gasCost.add(regRes.effectiveGasPrice.mul(regRes.gasUsed))
            console.log(regRes.gasUsed, regRes.effectiveGasPrice, count)
        }
        console.log("register-og-punks: total gasUsed", gasUsed)
        console.log("register-og-punks: total gasCost", gasCost)
    })