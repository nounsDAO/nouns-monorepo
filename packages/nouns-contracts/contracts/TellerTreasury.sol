

pragma solidity ^0.8.6;

 
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import { ITellerAuctionHouse } from './interfaces/ITellerAuctionHouse.sol';
import { ITellerTreasury } from './interfaces/ITellerTreasury.sol';

contract TellerTreasury is ITellerTreasury,  ReentrancyGuardUpgradeable, OwnableUpgradeable{

    // The address of the WETH contract
    address public weth;

    // The address of the Auction House
    ITellerAuctionHouse public auctionHouse;

        //the amount of ETH escrowed for each Token that was auctioned
    mapping(uint256 => uint256) public personalEscrowAmount;



    /**
     * @notice Require that the sender is the auction house.
     */
    /*modifier onlyAuctionHouse() {
        require(msg.sender == address(auctionHouse), 'Sender is not the auctionHouse');
        _;
    }*/


    
    constructor(){ 
    }

    function setAuctionHouse(ITellerAuctionHouse _auctionHouse) external   {
        require(msg.sender == owner(), 'Sender is not the owner');
        auctionHouse = _auctionHouse; 
    }
    

 
/*
    function setPersonalEscrowAmount(uint256 tokenId, uint256 amount) external override   {
        require(msg.sender == address(auctionHouse), 'Sender is not the auctionHouse');
        require(personalEscrowAmount[tokenId] == 0);
        personalEscrowAmount[tokenId] = amount;
        emit PersonalEscrowAmountUpdated(tokenId,amount);
    }  */
    
}