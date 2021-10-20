import { Contract, Signer, BigNumber as BN } from 'ethers'
import * as hre from 'hardhat'
import { IWETH, WETH9,TellerToken,TellerAuctionHouse } from '../types/typechain'
import { use, should } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { solidity } from 'ethereum-waffle'
import { deploy } from '../utils/deploy-helpers'
import {setup} from './helpers/setup'

import web3utils from 'web3-utils'

use(chaiAsPromised)
use(solidity)
should()
 
const {
  contracts,
  tokens,
  deployments,
  getNamedSigner,
  ethers,
  network,
  evm,
  toBN,
} = hre


describe('WETH9', function () {
  let wethContract: WETH9
  let tellerTokenContract: TellerToken
  let tellerAuctionHouseContract: TellerAuctionHouse

  let deployer: Signer
  let user: Signer
  let filler: Signer
   

  before(async () => {
    const result = await setup()
    wethContract = result.weth 
    tellerTokenContract = result.tellerToken 
    tellerAuctionHouseContract = result.tellerAuctionHouse 
    
    deployer = result.deployer
    user = result.user
   
  })

    
  

  describe('Contract Deployments', () => {
    it('should have the WETH address set', async () => {
      const wethAddr = wethContract.address
      wethAddr.should.exist
    })

     
  })

   
 

  describe('Auctions', () => {
    it('user can not make a bid initially', async () => {

       await tellerAuctionHouseContract.connect(user)
            .createBid(0, {value: web3utils.toWei('0.1','ether')   })
            .should.be.revertedWith('Auction expired')
 


    })



    it('user can make a bid ', async () => {

      await tellerAuctionHouseContract.connect(deployer).unpause()


      let bidResult = await tellerAuctionHouseContract.connect(user)
            .createBid(0, {value: web3utils.toWei('0.1','ether')   }) 


      let auctionData = await tellerAuctionHouseContract.auction( )
  
      auctionData.should.exist 
      auctionData.tokenId.should.eql(0)

    })


    it('user can not settle a bid right away', async () => {

      await tellerAuctionHouseContract.connect(user)
            .settleCurrentAndCreateNewAuction( )
            .should.be.revertedWith('Auction hasn\'t completed')
 

    })

    it('user can settle a bid ', async () => {

      let auctionDuration  = await tellerAuctionHouseContract.duration()

      await evm.advanceTime( auctionDuration.toNumber(), true )

      await tellerAuctionHouseContract.connect(user)
            .settleCurrentAndCreateNewAuction( )   

      let auctionData = await tellerAuctionHouseContract.auction( )
  
      auctionData.should.exist 
      auctionData.tokenId.should.eql(1)
  

    })


     
  })



})
