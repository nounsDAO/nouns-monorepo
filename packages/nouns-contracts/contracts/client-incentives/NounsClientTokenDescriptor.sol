// SPDX-License-Identifier: GPL-3.0

/// @title The client incentives NFT descriptor

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
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';

contract NounsClientTokenDescriptor is INounsClientTokenDescriptor {
    using Strings for uint256;

    string private constant _SVG_START_TAG =
        '<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#D5D7E1"/>';
    string private constant _SVG_END_TAG =
        '<path d="M75 104H45V109H75V104Z" fill="#D19A54"/><path d="M110 104H80V109H110V104Z" fill="#D19A54"/><path d="M50 109H45V114H50V109Z" fill="#D19A54"/><path d="M60 109H50V114H60V109Z" fill="white"/><path d="M70 109H60V114H70V109Z" fill="black"/><path d="M75 109H70V114H75V109Z" fill="#D19A54"/><path d="M85 109H80V114H85V109Z" fill="#D19A54"/><path d="M95 109H85V114H95V109Z" fill="white"/><path d="M105 109H95V114H105V109Z" fill="black"/><path d="M110 109H105V114H110V109Z" fill="#D19A54"/><path d="M50 114H30V119H50V114Z" fill="#D19A54"/><path d="M60 114H50V119H60V114Z" fill="white"/><path d="M70 114H60V119H70V114Z" fill="black"/><path d="M85 114H70V119H85V114Z" fill="#D19A54"/><path d="M95 114H85V119H95V114Z" fill="white"/><path d="M105 114H95V119H105V114Z" fill="black"/><path d="M110 114H105V119H110V114Z" fill="#D19A54"/><path d="M35 119H30V124H35V119Z" fill="#D19A54"/><path d="M50 119H45V124H50V119Z" fill="#D19A54"/><path d="M60 119H50V124H60V119Z" fill="white"/><path d="M70 119H60V124H70V119Z" fill="black"/><path d="M75 119H70V124H75V119Z" fill="#D19A54"/><path d="M85 119H80V124H85V119Z" fill="#D19A54"/><path d="M95 119H85V124H95V119Z" fill="white"/><path d="M105 119H95V124H105V119Z" fill="black"/><path d="M110 119H105V124H110V119Z" fill="#D19A54"/><path d="M35 124H30V129H35V124Z" fill="#D19A54"/><path d="M50 124H45V129H50V124Z" fill="#D19A54"/><path d="M60 124H50V129H60V124Z" fill="white"/><path d="M70 124H60V129H70V124Z" fill="black"/><path d="M75 124H70V129H75V124Z" fill="#D19A54"/><path d="M85 124H80V129H85V124Z" fill="#D19A54"/><path d="M95 124H85V129H95V124Z" fill="white"/><path d="M105 124H95V129H105V124Z" fill="black"/><path d="M110 124H105V129H110V124Z" fill="#D19A54"/><path d="M75 129H45V134H75V129Z" fill="#D19A54"/><path d="M110 129H80V134H110V129Z" fill="#D19A54"/><line x1="30" y1="201.5" x2="370" y2="201.5" stroke="black" stroke-opacity="0.5"/></svg>';

    function tokenURI(
        uint256 tokenId,
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) external pure returns (string memory) {
        string memory name = string(abi.encodePacked('Nouns Client ', tokenId.toString(), ': ', metadata.name));
        string memory image = Base64.encode(
            bytes(abi.encodePacked(_SVG_START_TAG, _generateSVGText(tokenId, metadata), _SVG_END_TAG))
        );

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
        uint256 tokenId,
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="20" font-weight="bold" letter-spacing="0em"><tspan x="30" y="165.822">VERIFIED NOUNS CLIENT</tspan></text>',
                    '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="346.492">Client URL:</tspan></text>',
                    '<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="365.492">',
                    metadata.description,
                    '</tspan></text>',
                    '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="295.492">Client ID:</tspan></text>',
                    '<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="314.492">',
                    tokenId.toString(),
                    '</tspan></text>',
                    '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="244.492">Client Name:</tspan></text>',
                    '<text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier New" font-size="15" font-weight="bold" letter-spacing="0em"><tspan x="30" y="263.492">',
                    metadata.name,
                    '</tspan></text>'
                )
            );
    }
}
