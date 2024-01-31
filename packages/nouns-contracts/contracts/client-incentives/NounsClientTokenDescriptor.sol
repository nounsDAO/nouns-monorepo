// SPDX-License-Identifier: GPL-3.0

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

pragma solidity ^0.8.19;

import { INounsClientTokenDescriptor } from './INounsClientTokenDescriptor.sol';
import { INounsClientTokenTypes } from './INounsClientTokenTypes.sol';
import { Base64 } from 'base64-sol/base64.sol';

contract NounsClientTokenDescriptor is INounsClientTokenDescriptor {
    string private constant _SVG_START_TAG =
        '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><rect x="10" y="10" rx="20" ry="20" height="100" width="300"  style="fill:white;stroke:black;stroke-width:5;opacity:0.8" />';
    string private constant _SVG_END_TAG = '</svg>';

    function tokenURI(
        uint256 tokenId,
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) external pure returns (string memory) {
        string memory name = string(abi.encodePacked('Nouns Client ', tokenId, ' ', metadata.name));
        string memory image = string(abi.encodePacked(_SVG_START_TAG, _generateSVGText(metadata), _SVG_END_TAG));

        return
            string(
                abi.encodePacked(
                    'data:application/json;base64,',
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                metadata.description,
                                '", "image": "',
                                'data:image/svg+xml;base64,',
                                image,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function _generateSVGText(
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<text font-size="18px" font-family="\'Courier New\', monospace" x="20" y="45" fill="black">',
                    metadata.name,
                    '</text>',
                    '<text font-size="12px" font-family="\'Courier New\', monospace" x="20" y="80" fill="black">',
                    metadata.description,
                    '</text>'
                )
            );
    }
}
