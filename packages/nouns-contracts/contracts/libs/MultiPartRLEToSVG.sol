// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';

/**
 * @title A library used to convert multi-part RLE compressed images to SVG.
 */
library MultiPartRLEToSVG {
    using Strings for uint8;
    using Strings for uint256;

    struct SVGParams {
        bytes[] parts;
    }

    struct ContentBounds {
        uint8 top;
        uint8 right;
        uint8 bottom;
        uint8 left;
    }

    struct Rect {
        uint8 length;
        uint8 colorIndex;
    }

    struct DecodedImage {
        uint8 paletteIndex;
        ContentBounds bounds;
        Rect[] rects;
    }


    /**
     * @notice Given RLE image parts and color palettes, merge to generate a single SVG image.
     */
    // prettier-ignore
    function generateSVG(
        SVGParams memory params,
        mapping(uint8 => bytes3[]) storage palettes
    ) internal view returns (string memory svg) {
        return string(
            abi.encodePacked(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">',
                generateSVGRects(params, palettes),
                '</svg>'
            )
        );
    }

    /**
     * @notice Given RLE image parts and color palettes, generate SVG rects.
     */
    function generateSVGRects(
        SVGParams memory params,
        mapping(uint8 => bytes3[]) storage palettes
    ) private view returns (string memory svg) {
        string[33] memory lookup = [
            "0", "10", "20", "30", "40", "50", "60", "70", 
            "80", "90", "100", "110", "120", "130", "140", "150", 
            "160", "170", "180", "190", "200", "210", "220", "230", 
            "240", "250", "260", "270", "280", "290", "300", "310",
            "320"
        ];
        string memory rects;
        for (uint8 p = 0; p < params.parts.length; p++) {
            DecodedImage memory image = decodeRLEImage(params.parts[p]);
            bytes3[] storage palette = palettes[image.paletteIndex];
            uint256 currentX = image.bounds.left;
            uint256 currentY = image.bounds.top;
            uint256 boundWidth = image.bounds.right - image.bounds.left;
            uint256 cursor;
            string[16] memory buffer;

            for (uint256 i = 0; i < image.rects.length; i++) {
                Rect memory rect = image.rects[i];
                if (rect.colorIndex != 0) {
                    string memory color = "#FF0000"; // TODO: pull this from palette
                    string memory width = lookup[rect.length];
                    string memory x = lookup[currentX];
                    string memory y = lookup[currentY];
                    

                    // prettier-ignore
                    if (cursor >= 16) {
                        rects = string(
                            abi.encodePacked(
                                rects,
                                string(abi.encodePacked(
                                    '<rect width="', buffer[0], '" height="10" x="', buffer[1], '" y="', buffer[2], '" fill="', buffer[3], ')" />',
                                    '<rect width="', buffer[4], '" height="10" x="', buffer[5], '" y="', buffer[6], '" fill="', buffer[7], ')" />'
                                )),
                                string(abi.encodePacked(
                                    '<rect width="', buffer[8], '" height="10" x="', buffer[9], '" y="', buffer[10], '" fill="', buffer[11], ')" />',
                                    '<rect width="', buffer[12], '" height="10" x="', buffer[13], '" y="', buffer[14], '" fill="', buffer[15], ')" />'
                                ))
                            )
                        );
                        cursor = 0;
                    }

                    buffer[cursor] = width;
                    buffer[cursor + 1] = x;
                    buffer[cursor + 2] = y;
                    buffer[cursor + 3] = color;

                    cursor += 4;
                }

                currentX += rect.length;
                if (currentX - image.bounds.left == boundWidth) {
                    currentX = image.bounds.left;
                    currentY++;
                }
            }

            // TODO: Write out anything left in the buffer
        }
        return rects;
    }

    /**
     * @notice Decode a single RLE compressed image into a `DecodedImage`.
     */
    function decodeRLEImage(bytes memory image)
        private
        pure
        returns (DecodedImage memory)
    {
        uint8 paletteIndex = uint8(image[0]);
        ContentBounds memory bounds = ContentBounds({
            top: uint8(image[1]),
            right: uint8(image[2]),
            bottom: uint8(image[3]),
            left: uint8(image[4])
        });

        uint256 cursor;
        Rect[] memory rects = new Rect[]((image.length - 5) / 2);
        for (uint256 i = 5; i < image.length; i += 2) {
            rects[cursor] = Rect({
                length: uint8(image[i]),
                colorIndex: uint8(image[i + 1])
            });
            cursor++;
        }
        // prettier-ignore
        return DecodedImage({
            paletteIndex: paletteIndex,
            bounds: bounds,
            rects: rects
        });
    }
}
