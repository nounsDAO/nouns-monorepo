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
import { ETHString } from '../libs/ETHString.sol';

contract NounsClientTokenDescriptor is INounsClientTokenDescriptor {
    using Strings for uint256;
    using ETHString for uint96;

    string private constant _SVG_START_TAG =
        '<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#D5D7E1"/>';
    string private constant _SVG_END_TAG =
        '<path d="M75 340H45V345H75V340Z" fill="#D19A54"/><path d="M110 340H80V345H110V340Z" fill="#D19A54"/><path d="M50 345H45V350H50V345Z" fill="#D19A54"/><path d="M60 345H50V350H60V345Z" fill="white"/><path d="M70 345H60V350H70V345Z" fill="black"/><path d="M75 345H70V350H75V345Z" fill="#D19A54"/><path d="M85 345H80V350H85V345Z" fill="#D19A54"/><path d="M95 345H85V350H95V345Z" fill="white"/><path d="M105 345H95V350H105V345Z" fill="black"/><path d="M110 345H105V350H110V345Z" fill="#D19A54"/><path d="M50 350H30V355H50V350Z" fill="#D19A54"/><path d="M60 350H50V355H60V350Z" fill="white"/><path d="M70 350H60V355H70V350Z" fill="black"/><path d="M85 350H70V355H85V350Z" fill="#D19A54"/><path d="M95 350H85V355H95V350Z" fill="white"/><path d="M105 350H95V355H105V350Z" fill="black"/><path d="M110 350H105V355H110V350Z" fill="#D19A54"/><path d="M35 355H30V360H35V355Z" fill="#D19A54"/><path d="M50 355H45V360H50V355Z" fill="#D19A54"/><path d="M60 355H50V360H60V355Z" fill="white"/><path d="M70 355H60V360H70V355Z" fill="black"/><path d="M75 355H70V360H75V355Z" fill="#D19A54"/><path d="M85 355H80V360H85V355Z" fill="#D19A54"/><path d="M95 355H85V360H95V355Z" fill="white"/><path d="M105 355H95V360H105V355Z" fill="black"/><path d="M110 355H105V360H110V355Z" fill="#D19A54"/><path d="M35 360H30V365H35V360Z" fill="#D19A54"/><path d="M50 360H45V365H50V360Z" fill="#D19A54"/><path d="M60 360H50V365H60V360Z" fill="white"/><path d="M70 360H60V365H70V360Z" fill="black"/><path d="M75 360H70V365H75V360Z" fill="#D19A54"/><path d="M85 360H80V365H85V360Z" fill="#D19A54"/><path d="M95 360H85V365H95V360Z" fill="white"/><path d="M105 360H95V365H105V360Z" fill="black"/><path d="M110 360H105V365H110V360Z" fill="#D19A54"/><path d="M75 365H45V370H75V365Z" fill="#D19A54"/><path d="M110 365H80V370H110V365Z" fill="#D19A54"/><line x1="30" y1="314.5" x2="370" y2="314.5" stroke="black" stroke-opacity="0.5"/></svg>';
    string private constant TEXT_SPAN_END = '</tspan></text>';
    string private constant ETH = ' ETH';
    string private constant CLIENT_NAME_START =
        '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="43.4329">Client Name:</tspan></text><text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="62.4329">';
    string private constant STATUS_START =
        '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="99.4329">Status:</tspan></text><text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="118.433">';
    string private constant TOTAL_REWARDED_START =
        '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="155.433">Total Rewarded:</tspan></text><text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="174.433">';
    string private constant CLIENT_ID_START =
        '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="211.433">Client ID:</tspan></text><text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="230.433">';
    string private constant CLIENT_DESCRIPTION_START =
        '<text fill="black" fill-opacity="0.5" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="267.433">Client Description:</tspan></text><text fill="black" xml:space="preserve" style="white-space: pre" font-family="Courier" font-size="15" letter-spacing="0em"><tspan x="30" y="286.433">';

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
                    _clientNameSVG(metadata),
                    _clientStatusSVG(metadata),
                    _totalRewardedSVG(metadata),
                    _clientIdSVG(tokenId),
                    _clientDescriptionSVG(metadata)
                )
            );
    }

    function _clientNameSVG(
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return string(abi.encodePacked(CLIENT_NAME_START, metadata.name, TEXT_SPAN_END));
    }

    function _clientStatusSVG(
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return string(abi.encodePacked(STATUS_START, metadata.approved ? 'Approved' : 'Not Approved', TEXT_SPAN_END));
    }

    function _totalRewardedSVG(
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return string(abi.encodePacked(TOTAL_REWARDED_START, metadata.rewarded.toETHString(), ETH, TEXT_SPAN_END));
    }

    function _clientIdSVG(uint256 tokenId) private pure returns (string memory) {
        return string(abi.encodePacked(CLIENT_ID_START, tokenId.toString(), TEXT_SPAN_END));
    }

    function _clientDescriptionSVG(
        INounsClientTokenTypes.ClientMetadata memory metadata
    ) private pure returns (string memory) {
        return string(abi.encodePacked(CLIENT_DESCRIPTION_START, metadata.description, TEXT_SPAN_END));
    }
}
