// SPDX-License-Identifier: GPL-3.0

/// @title A library used to convert multi-part RLE compressed images to SVG

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

import { SSTORE2 } from './libs/SSTORE2.sol';

contract MultiPartRLEToSVG {
    bytes16 private constant _HEX_SYMBOLS = '0123456789abcdef';

    struct Part {
        bytes image;
        address palette;
    }

    struct SVGParams {
        Part[] parts;
        string background; // TODO: Optionalize?
    }

    struct ContentBounds {
        uint8 top;
        uint8 right;
        uint8 bottom;
        uint8 left;
    }

    struct Draw {
        uint8 length;
        uint8 colorIndex;
    }

    struct DecodedImage {
        uint8 paletteIndex;
        ContentBounds bounds;
        Draw[] draws;
    }

    /**
     * @notice Given RLE image parts and color palette pointers, merge to generate a single SVG image.
     */
    function generateSVG(SVGParams memory params, address[] memory palettes) internal view returns (string memory svg) {
        // prettier-ignore
        return string(
            abi.encodePacked(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">',
                '<rect width="100%" height="100%" fill="#', params.background, '" />',
                _generateSVGRects(params, palettes),
                '</svg>'
            )
        );
    }

    /**
     * @notice Given RLE image parts and color palettes, generate SVG rects.
     */
    // prettier-ignore
    function _generateSVGRects(SVGParams memory params, address[] memory palettes)
        private
        view
        returns (string memory svg)
    {
        string[33] memory lookup = [
            '0', '10', '20', '30', '40', '50', '60', '70', 
            '80', '90', '100', '110', '120', '130', '140', '150', 
            '160', '170', '180', '190', '200', '210', '220', '230', 
            '240', '250', '260', '270', '280', '290', '300', '310',
            '320'
        ];
        string memory rects;
        string[][] memory cache = new string[][](palettes.length);
        for (uint8 p = 0; p < params.parts.length; p++) {
            DecodedImage memory image = _decodeRLEImage(params.parts[p].image);
            bytes memory palette = _getPalette(params.parts[p].palette); // TODO: Cache?
            uint256 currentX = image.bounds.left;
            uint256 currentY = image.bounds.top;
            uint256 cursor;
            string[16] memory buffer;

            string memory part;
            for (uint256 i = 0; i < image.draws.length; i++) {
                Draw memory draw = image.draws[i];

                uint8 length = _getRectLength(currentX, draw.length, image.bounds.right);
                while (length > 0) {
                    if (draw.colorIndex != 0) {
                        buffer[cursor] = lookup[length];                                        // width
                        buffer[cursor + 1] = lookup[currentX];                                  // x
                        buffer[cursor + 2] = lookup[currentY];                                  // y
                        buffer[cursor + 3] = _getColor(palette, draw.colorIndex * 3, cache[i]); // color

                        cursor += 4;

                        if (cursor >= 16) {
                            part = string(abi.encodePacked(part, _getChunk(cursor, buffer)));
                            cursor = 0;
                        }
                    }

                    currentX += length;
                    if (currentX == image.bounds.right) {
                        currentX = image.bounds.left;
                        currentY++;
                    }

                    draw.length -= length;
                    length = _getRectLength(currentX, draw.length, image.bounds.right);
                }
            }

            if (cursor != 0) {
                part = string(abi.encodePacked(part, _getChunk(cursor, buffer)));
            }
            rects = string(abi.encodePacked(rects, part));
        }
        return rects;
    }

    /**
     * @notice Given an x-coordinate, draw length, and right bound, return the draw
     * length for a single SVG rectangle.
     */
    function _getRectLength(
        uint256 currentX,
        uint8 drawLength,
        uint8 rightBound
    ) internal pure returns (uint8) {
        uint8 remainingPixelsInLine = rightBound - uint8(currentX);
        return drawLength <= remainingPixelsInLine ? drawLength : remainingPixelsInLine;
    }

    /**
     * @notice Return a string that consists of all rects in the provided `buffer`.
     */
    // prettier-ignore
    function _getChunk(uint256 cursor, string[16] memory buffer) private pure returns (string memory) {
        string memory chunk;
        for (uint256 i = 0; i < cursor; i += 4) {
            chunk = string(
                abi.encodePacked(
                    chunk,
                    '<rect width="', buffer[i], '" height="10" x="', buffer[i + 1], '" y="', buffer[i + 2], '" fill="#', buffer[i + 3], '" />'
                )
            );
        }
        return chunk;
    }

    /**
     * @notice Decode a single RLE compressed image into a `DecodedImage`.
     */
    function _decodeRLEImage(bytes memory image) private pure returns (DecodedImage memory) {
        uint8 paletteIndex = uint8(image[0]);
        ContentBounds memory bounds = ContentBounds({
            top: uint8(image[1]),
            right: uint8(image[2]),
            bottom: uint8(image[3]),
            left: uint8(image[4])
        });

        uint256 cursor;
        Draw[] memory draws = new Draw[]((image.length - 5) / 2);
        for (uint256 i = 5; i < image.length; i += 2) {
            draws[cursor] = Draw({ length: uint8(image[i]), colorIndex: uint8(image[i + 1]) });
            cursor++;
        }
        return DecodedImage({ paletteIndex: paletteIndex, bounds: bounds, draws: draws });
    }

    /**
     * @notice Fetch the color palette stored at the provided `pointer`.
     */
    function _getPalette(address pointer) private view returns (bytes memory palette) {
        palette = SSTORE2.read(pointer);
    }

    /**
     * @notice Get the target hex color code from the cache. Populate the cache if
     * the color code does not yet exist.
     */
    function _getColor(
        bytes memory palette,
        uint256 index,
        string[] memory cache
    ) private pure returns (string memory) {
        if (bytes(cache[index]).length == 0) {
            cache[index] = _toHexString(palette[index]);
        }
        return cache[index];
    }

    /**
     * @dev Convert a `bytes3` to its 6 character ASCII `string` hexadecimal representation.
     */
    function _toHexString(bytes3 b) internal pure returns (string memory) {
        uint24 value = uint24(b);

        bytes memory buffer = new bytes(6);
        buffer[5] = _HEX_SYMBOLS[value & 0xf];
        buffer[4] = _HEX_SYMBOLS[(value >> 4) & 0xf];
        buffer[3] = _HEX_SYMBOLS[(value >> 8) & 0xf];
        buffer[2] = _HEX_SYMBOLS[(value >> 12) & 0xf];
        buffer[1] = _HEX_SYMBOLS[(value >> 16) & 0xf];
        buffer[0] = _HEX_SYMBOLS[(value >> 20) & 0xf];
        return string(buffer);
    }
}
