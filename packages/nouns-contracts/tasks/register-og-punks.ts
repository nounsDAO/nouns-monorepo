import { task } from 'hardhat/config'

task("register-og-punks", "Register original cryptopunks for duplication check")
    .setAction(async ({ nToken }, { ethers, run }) => {

        const punkHashes = await run("create-merkle")

        const sliceCount = 200
        let gasUsed = 0
        for(let i = 0; i < punkHashes.length; i += sliceCount) {
            const count = (i + sliceCount) > punkHashes.length ? (punkHashes.length - i) : sliceCount
            const regRes = await (await nToken.registerOGHashes(punkHashes.slice(0, count), {gasPrice: ethers.utils.parseUnits("14.26", "gwei")})).wait()
            gasUsed += Number(regRes.gasUsed)
            console.log(regRes.gasUsed, regRes.gasUsed.toString(), Number(regRes.gasUsed), count)
        }
        console.log(gasUsed, Number(ethers.utils.parseUnits("14.26", "gwei")), ethers.utils.formatEther(ethers.utils.parseUnits("14.26", "gwei")))
        console.log(Number(ethers.utils.formatEther(ethers.utils.parseUnits("14.26", "gwei"))) * gasUsed)
    })