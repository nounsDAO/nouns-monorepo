

pragma solidity ^0.8.6;

 import "hardhat/console.sol";

 /*

This contract should be upgradeable 

 */


import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

import { ITellerAuctionHouse } from './interfaces/ITellerAuctionHouse.sol';
import { ITellerTreasury } from './interfaces/ITellerTreasury.sol';

contract TellerTreasury is ITellerTreasury, Ownable{

    // The address of the WETH contract
    address public weth;

     // ERC721 token contract
    ITellerToken public tellerTokens;

    // The address of the Auction House
    ITellerAuctionHouse public auctionHouse;

 

        //the amount of ETH escrowed for each Token that was auctioned
    mapping(uint256 => uint256) public personalEscrowAmount;



    /**
     * @notice Require that the sender is the auction house.
     */
    modifier onlyAuctionHouse() {
        require(msg.sender == address(auctionHouse), 'Sender is not the auctionHouse');
        _;
    }


    
    constructor( ){ 
    }
    

    //need to only allow the owner to call this !! (the deployer)
    function setAuctionHouse(ITellerAuctionHouse _auctionHouse) external onlyOwner  {
        auctionHouse = _auctionHouse; 
    }
    

 
 
    function setPersonalEscrowAmount(uint256 tokenId, uint256 amount) external override onlyAuctionHouse  {
        require(msg.sender == address(auctionHouse), 'Sender is not the auctionHouse');
        require(personalEscrowAmount[tokenId] == 0);
        personalEscrowAmount[tokenId] = amount;
        emit PersonalEscrowAmountUpdated(tokenId,amount);
    }

    /**
      @notice Burn your token, reclaiming your escrowed balance 
      @dev The token must be approved to this contract first 
    */
    function burnToken(uint256 tokenId) external {
        IERC721(tellerTokens).transferFrom(msg.sender,address(this),tokenId);
        IERC721(tellerTokens).burn(tokenId);

        _reclaimBalanceForTokenId(msg.sender, tokenId);
    }

    function _reclaimBalanceForTokenId(address to, uint256 tokenId) internal {
        IERC20(weth).transfer(to,personalEscrowAmount[tokenId]);  
    }
    
}