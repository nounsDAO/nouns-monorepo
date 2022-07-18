// SPDX-License-Identifier: GPL-3.0

/// @title A library used to construct ERC721 token URIs and SVG images

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { Base64 } from 'base64-sol/base64.sol';
import { MultiPartRLEToSVGProperties } from './MultiPartRLEToSVGProperties.sol';
import { INounsDescriptor } from '../interfaces/INounsDescriptor.sol';

library NFTDescriptorProperties {
    struct TokenURIParams {
        string name;
        string description;
        bytes[] parts;
        string background;
    }

    function getProperties(TokenURIParams memory params) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                '"body": "',
                params.parts[4],
                '","accessory":"',
                params.parts[5],
                '","head":"',
                params.parts[6],
                '","glasses":"',
                params.parts[7],
                '","background":"',
                params.parts[8],
                '"'
            );
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(TokenURIParams memory params, INounsDescriptor lastDescriptor)
        public
        view
        returns (string memory)
    {
        string memory image = generateSVGImage(
            MultiPartRLEToSVGProperties.SVGParams({ parts: params.parts, background: params.background }),
            4,
            lastDescriptor
        );

        // prettier-ignore
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', params.name, '", "description":"', params.description, '", "image": "', 'data:image/svg+xml;base64,', image, '","properties":{',getProperties(params),'}}')
                    )
                )
            )
        );
    }

    /**
     * @notice Generate an SVG image for use in the ERC721 token URI.
     */
    function generateSVGImage(
        MultiPartRLEToSVGProperties.SVGParams memory params,
        uint256 paramsCount,
        INounsDescriptor lastDescriptor
    ) public view returns (string memory svg) {
        return Base64.encode(bytes(MultiPartRLEToSVGProperties.generateSVG(params, paramsCount, lastDescriptor)));
    }
}
