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
        string memory rects;
        for (uint8 p = 0; p < params.parts.length; p++) {
            DecodedImage memory image = decodeRLEImage(params.parts[p]);
            bytes3[] storage palette = palettes[image.paletteIndex];
            uint256 currentX = image.bounds.left;
            uint256 currentY = image.bounds.top;
            uint256 boundWidth = image.bounds.right - image.bounds.left;

            for (uint256 i = 0; i < image.rects.length; i++) {
                Rect memory rect = image.rects[i];
                if (rect.colorIndex != 0) {
                    bytes3 color = palette[rect.colorIndex];

                    string memory width = (rect.length * 10).toString();
                    string memory x = (currentX * 10).toString();
                    string memory y = (currentY * 10).toString();
                    string memory r = uint8(color[0]).toString();
                    string memory g = uint8(color[1]).toString();
                    string memory b = uint8(color[2]).toString();

                    // prettier-ignore
                    rects = string(
                        abi.encodePacked(
                            rects,
                            '<rect width="', width, '" height="10" x="', x, '" y="', y, '" fill="rgb(', r, ',', g, ',', b, ')" />'
                        )
                    );
                }

                currentX += rect.length;
                if (currentX - image.bounds.left == boundWidth) {
                    currentX = image.bounds.left;
                    currentY++;
                }
            }
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

        uint256 counter;
        Rect[] memory rects = new Rect[]((image.length - 5) / 2);
        for (uint256 i = 5; i < image.length; i += 2) {
            rects[counter] = Rect({
                length: uint8(image[i]),
                colorIndex: uint8(image[i + 1])
            });
            counter++;
        }
        // prettier-ignore
        return DecodedImage({
            paletteIndex: paletteIndex,
            bounds: bounds,
            rects: rects
        });
    }
}
