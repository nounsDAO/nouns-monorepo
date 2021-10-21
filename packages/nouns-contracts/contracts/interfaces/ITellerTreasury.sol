// SPDX-License-Identifier: GPL-3.0

  

pragma solidity ^0.8.6;

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
 

interface ITellerTreasury {
 
    event PersonalEscrowAmountUpdated(uint256 indexed tokenId,uint256 amount);
 
   // function setPersonalEscrowAmount(uint256 tokenId, uint256 amount) external;
 
}