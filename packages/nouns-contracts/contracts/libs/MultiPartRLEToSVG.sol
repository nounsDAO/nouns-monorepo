// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.5;

/**
 * @title A library used to convert multi-part RLE compressed images to SVG.
 */
library MultiPartRLEToSVG {
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
        uint256 width;
        Rect[] rects;
    }

    /**
     * @notice Given RLE image parts and color palettes, merge to generate a single SVG image.
     */
    // prettier-ignore
    function generateSVG(
        SVGParams memory params,
        mapping(uint8 => string[]) storage palettes
    ) internal view returns (string memory svg) {
        return string(
            abi.encodePacked(
                '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">',
                _generateSVGRects(params, palettes),
                '</svg>'
            )
        );
    }

    /**
     * @notice Given RLE image parts and color palettes, generate SVG rects.
     */
    function _generateSVGRects(
        SVGParams memory params,
        mapping(uint8 => string[]) storage palettes
    ) private view returns (string memory svg) {
        string[33] memory lookup = [
            '0', '10', '20', '30', '40', '50', '60', '70', 
            '80', '90', '100', '110', '120', '130', '140', '150', 
            '160', '170', '180', '190', '200', '210', '220', '230', 
            '240', '250', '260', '270', '280', '290', '300', '310',
            '320' 
        ];
        string memory rects;
        for (uint8 p = 0; p < params.parts.length; p++) {
            DecodedImage memory image = _decodeRLEImage(params.parts[p]);
            string[] storage palette = palettes[image.paletteIndex];
            uint256 currentX = image.bounds.left;
            uint256 currentY = image.bounds.top;
            uint256 cursor;
            string[16] memory buffer;

            string memory part;
            for (uint256 i = 0; i < image.rects.length; i++) {
                Rect memory rect = image.rects[i];
                if (rect.colorIndex != 0) {
                    buffer[cursor] = lookup[rect.length];          // width
                    buffer[cursor + 1] = lookup[currentX];         // x
                    buffer[cursor + 2] = lookup[currentY];         // y
                    buffer[cursor + 3] = palette[rect.colorIndex]; // color

                    cursor += 4;

                    // prettier-ignore
                    if (cursor >= 16) {
                        part = string(
                            abi.encodePacked(
                                part,
                                string(abi.encodePacked(
                                    '<rect width="', buffer[0], '" height="10" x="', buffer[1], '" y="', buffer[2], '" fill="#', buffer[3], '" />',
                                    '<rect width="', buffer[4], '" height="10" x="', buffer[5], '" y="', buffer[6], '" fill="#', buffer[7], '" />'
                                )),
                                string(abi.encodePacked(
                                    '<rect width="', buffer[8], '" height="10" x="', buffer[9], '" y="', buffer[10], '" fill="#', buffer[11], '" />',
                                    '<rect width="', buffer[12], '" height="10" x="', buffer[13], '" y="', buffer[14], '" fill="#', buffer[15], '" />'
                                ))
                            )
                        );
                        cursor = 0;
                    }
                }

                currentX += rect.length;
                if (currentX - image.bounds.left == image.width) {
                    currentX = image.bounds.left;
                    currentY++;
                }
            }

            if (cursor != 0) {
                part = string(abi.encodePacked(part, _getRemainder(cursor, buffer)));
            }
            rects = string(abi.encodePacked(rects, part));
        }
        return rects;
    }

    /**
     * @notice Return all rects that remain in the buffer after looping over all part rects.
     */
    function _getRemainder(uint256 cursor, string[16] memory buffer) internal pure returns (string memory) {
        string memory remainder;
        for (uint256 i = 0; i < cursor; i += 4) {
            remainder = string(
                abi.encodePacked(
                    remainder,
                    '<rect width="', buffer[i], '" height="10" x="', buffer[i + 1], '" y="', buffer[i + 2], '" fill="#', buffer[i + 3], '" />'
                )
            );
        }
        return remainder;
    }

    /**
     * @notice Decode a single RLE compressed image into a `DecodedImage`.
     */
    function _decodeRLEImage(bytes memory image)
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
        uint256 width = bounds.right - bounds.left;

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
            width: width,
            rects: rects
        });
    }
}
