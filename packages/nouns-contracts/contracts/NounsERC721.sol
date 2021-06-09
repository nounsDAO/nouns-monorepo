// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721Enumerable, Ownable {

    // The address of the auction house contract.
    address public auctionHouse;

    /**
     * @notice Require that the sender is `auctionHouse`
     */
    modifier onlyAuctionHouse(){
        require(msg.sender == auctionHouse, 'NounsERC721: caller is not auctionHouse');
        _;
    }

    /**
     * @notice sets the auction contract and immediatly transfers
     * ownership to a governance address.
     */
    constructor() ERC721('Nouns', 'NOUN') Ownable() {}

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return 'ipfs://';
    }

    /**
     * @notice Set the auctionHouse address.
     * @dev Only callable by the `owner`.
     */
    function setAuctionHouse(address newAuctionHouse) public override onlyOwner {
        require(newAuctionHouse != address(0), "NounsERC721: new auctionHouse is the zero address");

        emit AuctionHouseChanged(auctionHouse, newAuctionHouse);

        auctionHouse = newAuctionHouse;
    }

    /**
     * @notice Mint a Noun.
     * @dev Call ERC721 _mint with the next noun id.
     * Only callable by the `auctionHouse`.
     * TODO randomness, de-dup
     */
    function mint() public override onlyAuctionHouse returns (uint256) {
        uint256 nounId = totalSupply();

        _mint(auctionHouse, nounId);
        emit NounCreated(nounId);

        return nounId;
    }

    /**
     * @notice Burn a noun.
     */
    function burn(uint256 nounId) public override onlyAuctionHouse {
        _burn(nounId);
        emit NounBurned(nounId);
    }
}
