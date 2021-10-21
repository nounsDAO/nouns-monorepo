

pragma solidity ^0.8.6;


import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import { ITellerAuctionHouse } from './interfaces/ITellerAuctionHouse.sol';
import { ITellerTreasury } from './interfaces/ITellerTreasury.sol';

contract TellerTreasury is ITellerTreasury, PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable{

    // The address of the WETH contract
    address public weth;

    // The address of the Auction House
    ITellerAuctionHouse public auctionHouse;

        //the amount of ETH escrowed for each Token that was auctioned
    mapping(uint256 => uint256) public personalEscrowAmount;
    

   
 /**
     * @notice Initialize the auction house and base contracts,
     * populate configuration values, and pause the contract.
     * @dev This function can only be called once.
     */
    function initialize(
        ITellerAuctionHouse _auctionHouse, 
        address _weth  
    ) external initializer {
        __Pausable_init();
        __ReentrancyGuard_init();
        __Ownable_init();

        _pause();

        auctionHouse = _auctionHouse; 
        weth = _weth; 
    }


    /**
     * @notice Require that the sender is the auction house.
     */
    modifier onlyAuctionHouse() {
        require(msg.sender == address(auctionHouse), 'Sender is not the auctionHouse');
        _;
    }

    function setPersonalEscrowAmount(uint256 tokenId, uint256 amount) external override onlyAuctionHouse {
        require(personalEscrowAmount[tokenId] == 0);
        personalEscrowAmount[tokenId] = amount;
        emit PersonalEscrowAmountUpdated(tokenId,amount);
    }  
    
}