// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import {Base64} from 'base64-sol/base64.sol';
import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';
import {MultiPartRLEToSVG} from './MultiPartRLEToSVG.sol';

library NFTDescriptor {
    using Strings for uint256;

    struct ConstructTokenURIParams {
        uint256 tokenId;
        bytes[] parts;
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(
        ConstructTokenURIParams memory params,
        mapping(uint8 => string[]) storage palettes
    ) public view returns (string memory) {
        string memory name = string(
            abi.encodePacked('Noun #', params.tokenId.toString())
        );
        string memory description = _generateDescription(params.tokenId);
        string memory image = Base64.encode(
            bytes(_generateSVGImage(params, palettes))
        );

        // prettier-ignore
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', name, '", "description":"', description, '", "image": "', 'data:image/svg+xml;base64,', image, '"}')
                    )
                )
            )
        );
    }

    /**
     * @notice Generate a description for use in the ERC721 token URI.
     */
    function _generateDescription(uint256 tokenId)
        private
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    'This unique Noun was bought in auction #',
                    tokenId.toString()
                )
            );
    }

    /**
     * @notice Generate an SVG image for use in the ERC721 token URI.
     */
    function _generateSVGImage(
        ConstructTokenURIParams memory params,
        mapping(uint8 => string[]) storage palettes
    ) private view returns (string memory svg) {
        // prettier-ignore
        MultiPartRLEToSVG.SVGParams memory svgParams = MultiPartRLEToSVG.SVGParams({
            parts: params.parts
        });
        return MultiPartRLEToSVG.generateSVG(svgParams, palettes);
    }
}
