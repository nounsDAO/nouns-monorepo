// SPDX-License-Identifier: GPL-3.0

/// @title A library used to construct ERC721 token URIs and SVG images
 

pragma solidity ^0.8.6;

import { Base64 } from 'base64-sol/base64.sol'; 

library NFTDescriptor {
    struct TokenURIParams {
        string name;
        string description;
        
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(TokenURIParams memory params, mapping(uint8 => string[]) storage palettes)
        public
        view
        returns (string memory)
    {
       
        // prettier-ignore
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', params.name, '", "description":"', params.description,  '"}')
                    )
                )
            )
        );
    }

 
}
