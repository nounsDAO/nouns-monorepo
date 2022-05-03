// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC721/extensions/ERC721URIStorage.sol)

pragma solidity ^0.8.0;

import './ERC721.sol';

/**
 * @dev ERC721 token with storage based token URI management.
 */
abstract contract ERC721URIStorage is ERC721 {
    using Strings for uint256;

    // Mapping for unique Nouns tokenURIs
    mapping(uint256 => string) private _tokenURIs;

    string private _tempNounsHash = 'QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX';

    /**
     * @notice Returns tokenURI for provided tokenId. tokenURI may not be set yet for a minted token in edge case where this
     * is requested before it's set by the minter, as it's an async job.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), 'ERC721URIStorage: URI query for nonexistent token');

        // Iff tokenId is empty in mapping yet exists in the contract, return the tempNounsHash
        string memory _tokenURI = _tokenURIs[tokenId];
        if (bytes(_tokenURI).length == 0) {
            return string(abi.encodePacked('ipfs://', _tempNounsHash));
        }

        return string(abi.encodePacked('ipfs://', _tokenURI));

        // TODO: consider including a flag for using baseURI in case we want to use IPNS
        // return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), 'ERC721URIStorage: URI set of nonexistent token');
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);

        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }
    }
}
