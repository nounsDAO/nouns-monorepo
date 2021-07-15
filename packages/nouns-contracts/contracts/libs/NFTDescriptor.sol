// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.6;

import { Base64 } from 'base64-sol/base64.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { MultiPartRLEToSVG } from './MultiPartRLEToSVG.sol';

library NFTDescriptor {
    using Strings for uint256;

    struct ConstructTokenURIParams {
        uint256 tokenId;
        bytes[] parts;
        string background;
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(ConstructTokenURIParams memory params, mapping(uint8 => string[]) storage palettes)
        internal
        view
        returns (string memory)
    {
        string memory name = string(abi.encodePacked('Noun #', params.tokenId.toString()));
        string memory description = _generateDescription(params.tokenId);
        string memory image = generateSVGImage(params, palettes);

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
     * @notice Generate an SVG image for use in the ERC721 token URI.
     */
    function generateSVGImage(ConstructTokenURIParams memory params, mapping(uint8 => string[]) storage palettes)
        internal
        view
        returns (string memory svg)
    {
        MultiPartRLEToSVG.SVGParams memory svgParams = MultiPartRLEToSVG.SVGParams({
            parts: params.parts,
            background: params.background
        });
        return Base64.encode(bytes(MultiPartRLEToSVG.generateSVG(svgParams, palettes)));
    }

    /**
     * @notice Generate a description for use in the ERC721 token URI.
     */
    function _generateDescription(uint256 tokenId) private pure returns (string memory) {
        return string(abi.encodePacked('Noun #', tokenId.toString(), ' is a member of the NounsDAO'));
    }
}
