// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {INounsERC721} from './interfaces/INounsERC721.sol';

contract NounsERC721 is INounsERC721, ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _nounIdTracker;
    address public auction;

    constructor(address _auction) ERC721('Nouns', 'NOUN') Ownable() {
        auction = _auction;
    }

    modifier onlyAuction(){
        require(msg.sender == auction, 'NounsERC721: Unauthorized; Only auction allowed');
        _;
    }

    function setAuction(address _auction) public onlyOwner returns (bool) {
        auction = _auction;
    }

    /**
     * @dev Base URI for computing {tokenURI}. Empty by default, can be overriden
     * in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return 'ipfs://';
    }

    /**
     * @notice Create an new Noun.
     * @dev Call ERC721 _mint with the current noun id and increment.
     * TODO randomness, de-dup
     */
        uint256 nounId = _nounIdTracker.current();
        _nounIdTracker.increment();
    function mint() public override onlyAuction returns (uint256) {

        _mint(auction, nounId);
        emit NounCreated(nounId);

        return nounId;
    }
}
