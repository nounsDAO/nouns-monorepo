import { Contract, Signer } from 'ethers'
import * as hre from 'hardhat'
import { WETH9, TellerToken, TellerAuctionHouse } from '../../types/typechain'

const { getNamedSigner, contracts, deployments, ethers } = hre

interface TestSetupResult {
  weth: WETH9
  tellerToken: TellerToken
  tellerAuctionHouse: TellerAuctionHouse
  
  deployer: Signer
  user: Signer
  filler: Signer
}

 
export const setup = deployments.createFixture<TestSetupResult, never>(async () => {
  await hre.deployments.fixture('primary', {
    keepExistingDeployments: false
  })

  const deployer = await getNamedSigner('deployer')
  const user = await getNamedSigner('borrower')
  const filler = await getNamedSigner('lender')

  const weth = await contracts.get<WETH9>('WETH9')
  const tellerToken = await contracts.get<TellerToken>('TellerToken')
  const tellerAuctionHouse = await contracts.get<TellerAuctionHouse>('TellerAuctionHouse')
   
  

  return {
    weth,
    tellerToken,
    tellerAuctionHouse,
    
    deployer,
    user,
    filler,
  }
})
