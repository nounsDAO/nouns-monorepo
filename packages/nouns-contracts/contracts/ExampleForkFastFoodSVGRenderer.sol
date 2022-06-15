// SPDX-License-Identifier: GPL-3.0

/// @title A contract used to convert multi-part RLE compressed images to SVG

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

pragma solidity ^0.8.12;

import { ISVGRenderer } from './interfaces/ISVGRenderer.sol';
import { SSTORE2 } from './libs/SSTORE2.sol';

contract ExampleForkFastFoodSVGRenderer is ISVGRenderer {
    // prettier-ignore
    string private constant _SVG_START_TAG = '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">';
    string private constant _SVG_END_TAG = '</svg>';
    string private constant _FAST_FOOD_HAT =
        '<rect width="160" height="10" x="80" y="80" fill="#E11833"/><rect width="120" height="10" x="90" y="60" fill="#E11833"/><rect width="100" height="10" x="100" y="50" fill="#E11833"/><rect width="100" height="10" x="100" y="40" fill="#E11833"/><rect width="130" height="10" x="80" y="70" fill="#BD2D24"/><rect width="50" height="10" x="140" y="70" fill="#EED811"/><rect width="10" height="10" x="140" y="60" fill="#EED811"/><rect width="10" height="10" x="150" y="50" fill="#EED811"/><rect width="10" height="10" x="160" y="60" fill="#EED811"/><rect width="10" height="10" x="170" y="50" fill="#EED811"/><rect width="10" height="10" x="180" y="60" fill="#EED811"/>';

    ISVGRenderer private nounsRenderer;

    constructor(ISVGRenderer _nounsRenderer) {
        nounsRenderer = _nounsRenderer;
    }

    /**
     * @notice Given RLE image data and color palette pointers, merge to generate a single SVG image.
     */
    function generateSVG(SVGParams calldata params) external view returns (string memory svg) {
        // prettier-ignore
        return string(
                abi.encodePacked(
                    _SVG_START_TAG,
                    '<rect width="100%" height="100%" fill="#', params.background, '" />',
                    nounsRenderer.generateSVGParts(params.parts),
                    _FAST_FOOD_HAT,
                    _SVG_END_TAG
                )
            );
    }

    // these functions can be removed from the interface in a real fork, they aren't used by the descriptor

    function generateSVGPart(Part memory part) external view returns (string memory partialSVG) {
        return '';
    }

    function generateSVGParts(Part[] memory parts) external view returns (string memory partialSVG) {
        return '';
    }
}
