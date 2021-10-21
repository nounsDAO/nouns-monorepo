

pragma solidity ^0.8.6;


import { ITellerTreasury } from './interfaces/ITellerTreasury.sol';

contract TellerTreasury is ITellerTreasury {



    address public auctionHouse;

        //the amount of ETH escrowed for each Token that was auctioned
    mapping(uint256 => uint256) public personalEscrowAmount;
    

    constructor(
        address _auctionHouse
    ){
        auctionHouse = _auctionHouse;
    }


    /**
     * @notice Require that the sender is the auction house.
     */
    modifier onlyAuctionHouse() {
        require(msg.sender == auctionHouse, 'Sender is not the auctionHouse');
        _;
    }

    function setPersonalEscrowAmount(uint256 tokenId, uint256 amount) external override onlyAuctionHouse {
        require(personalEscrowAmount[tokenId] == 0);
        personalEscrowAmount[tokenId] = amount;
        emit PersonalEscrowAmountUpdated(tokenId,amount);
    }  
    
}