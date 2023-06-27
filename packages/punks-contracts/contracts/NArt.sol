// SPDX-License-Identifier: GPL-3.0

/// @title The Punks art storage contract

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

import { IArt } from './interfaces/IArt.sol';
import { SSTORE2 } from './libs/SSTORE2.sol';
import { IInflator } from './interfaces/IInflator.sol';

contract NArt is IArt {
    /// @notice Current Punk Descriptor address
    address public override descriptor;

    /// @notice Current inflator address
    IInflator public override inflator;

    /// @notice Noun Backgrounds (Hex Colors)
//    string[] public override backgrounds;

    /// @notice Punk Color Palettes (Index => Hex Colors, stored as a contract using SSTORE2)
    mapping(uint8 => address) public palettesPointers;

    Trait public punkTypesTrait;
    Trait public hatsTrait;
    Trait public helmetsTrait;
    Trait public hairsTrait;
    Trait public beardsTrait;
    Trait public eyesesTrait;
    Trait public glassesesTrait;
    Trait public gogglesesTrait;
    Trait public mouthsTrait;
    Trait public teethsTrait;
    Trait public lipsesTrait;
    Trait public necksTrait;
    Trait public emotionsTrait;
    Trait public facesTrait;
    Trait public earsesTrait;
    Trait public nosesTrait;
    Trait public cheeksesTrait;

    /**
     * @notice Require that the sender is the descriptor.
     */
    modifier onlyDescriptor() {
        if (msg.sender != descriptor) {
            revert SenderIsNotDescriptor();
        }
        _;
    }

    constructor(address _descriptor, IInflator _inflator) {
        descriptor = _descriptor;
        inflator = _inflator;
    }

    /**
     * @notice Set the descriptor.
     * @dev This function can only be called by the current descriptor.
     */
    function setDescriptor(address _descriptor) external override onlyDescriptor {
        address oldDescriptor = descriptor;
        descriptor = _descriptor;

        emit DescriptorUpdated(oldDescriptor, descriptor);
    }

    /**
     * @notice Set the inflator.
     * @dev This function can only be called by the descriptor.
     */
    function setInflator(IInflator _inflator) external override onlyDescriptor {
        address oldInflator = address(inflator);
        inflator = _inflator;

        emit InflatorUpdated(oldInflator, address(_inflator));
    }

    /**
     * @notice Get the Trait struct for bodies.
     * @dev This explicit getter is needed because implicit getters for structs aren't fully supported yet:
     * https://github.com/ethereum/solidity/issues/11826
     * @return Trait the struct, including a total image count, and an array of storage pages.
     */
    function getPunkTypesTrait() external view override returns (Trait memory) {
        return punkTypesTrait;
    }
    function getHatsTrait() external view override returns (Trait memory) {
        return hatsTrait;
    }
    function getHelmetsTrait() external view override returns (Trait memory) {
        return helmetsTrait;
    }
    function getHairsTrait() external view override returns (Trait memory) {
        return hairsTrait;
    }
    function getBeardsTrait() external view override returns (Trait memory) {
        return beardsTrait;
    }
    function getEyesesTrait() external view override returns (Trait memory) {
        return eyesesTrait;
    }
    function getGlassesesTrait() external view override returns (Trait memory) {
        return glassesesTrait;
    }
    function getGogglesesTrait() external view override returns (Trait memory) {
        return gogglesesTrait;
    }
    function getMouthsTrait() external view override returns (Trait memory) {
        return mouthsTrait;
    }
    function getTeethsTrait() external view override returns (Trait memory) {
        return teethsTrait;
    }
    function getLipsesTrait() external view override returns (Trait memory) {
        return lipsesTrait;
    }
    function getNecksTrait() external view override returns (Trait memory) {
        return necksTrait;
    }
    function getEmotionsTrait() external view override returns (Trait memory) {
        return emotionsTrait;
    }
    function getFacesTrait() external view override returns (Trait memory) {
        return facesTrait;
    }
    function getEarsesTrait() external view override returns (Trait memory) {
        return earsesTrait;
    }
    function getNosesTrait() external view override returns (Trait memory) {
        return nosesTrait;
    }
    function getCheeksesTrait() external view override returns (Trait memory) {
        return cheeksesTrait;
    }

    /**
     * @notice Batch add Noun backgrounds.
     * @dev This function can only be called by the descriptor.
     */
    // function addManyBackgrounds(string[] calldata _backgrounds) external override onlyDescriptor {
    //     for (uint256 i = 0; i < _backgrounds.length; i++) {
    //         _addBackground(_backgrounds[i]);
    //     }

    //     emit BackgroundsAdded(_backgrounds.length);
    // }

    // /**
    //  * @notice Add a Noun background.
    //  * @dev This function can only be called by the descriptor.
    //  */
    // function addBackground(string calldata _background) external override onlyDescriptor {
    //     _addBackground(_background);

    //     emit BackgroundsAdded(1);
    // }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette.
     * @param paletteIndex the identifier of this palette
     * @param palette byte array of colors. every 4 bytes represent an RGBA color. max length: 256 * 4 = 1024
     * @dev This function can only be called by the descriptor.
     */
    function setPalette(uint8 paletteIndex, bytes calldata palette) external override onlyDescriptor {
        if (palette.length == 0) {
            revert EmptyPalette();
        }
        if (palette.length % 4 != 0 || palette.length > 1024) {
            revert BadPaletteLength();
        }
        palettesPointers[paletteIndex] = SSTORE2.write(palette);

        emit PaletteSet(paletteIndex);
    }

    /**
     * @notice Add a batch of body images.
     * @param encodedCompressed bytes created by taking a string array of RLE-encoded images, abi encoding it as a bytes array,
     * and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addPunkTypes(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(punkTypesTrait, encodedCompressed, decompressedLength, imageCount);

        emit PunkTypesAdded(imageCount);
    }
    function addHats(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(hatsTrait, encodedCompressed, decompressedLength, imageCount);

        emit HatsAdded(imageCount);
    }
    function addHelmets(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(helmetsTrait, encodedCompressed, decompressedLength, imageCount);

        emit HelmetsAdded(imageCount);
    }
    function addHairs(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(hairsTrait, encodedCompressed, decompressedLength, imageCount);

        emit HairsAdded(imageCount);
    }
    function addBeards(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(beardsTrait, encodedCompressed, decompressedLength, imageCount);

        emit BeardsAdded(imageCount);
    }
    function addEyeses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(eyesesTrait, encodedCompressed, decompressedLength, imageCount);

        emit EyesesAdded(imageCount);
    }
    function addGlasseses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(glassesesTrait, encodedCompressed, decompressedLength, imageCount);

        emit GlassesesAdded(imageCount);
    }
    function addGoggleses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(gogglesesTrait, encodedCompressed, decompressedLength, imageCount);

        emit GogglesesAdded(imageCount);
    }
    function addMouths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(mouthsTrait, encodedCompressed, decompressedLength, imageCount);

        emit MouthsAdded(imageCount);
    }
    function addTeeths(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(teethsTrait, encodedCompressed, decompressedLength, imageCount);

        emit TeethsAdded(imageCount);
    }
    function addLipses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(lipsesTrait, encodedCompressed, decompressedLength, imageCount);

        emit LipsesAdded(imageCount);
    }
    function addNecks(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(necksTrait, encodedCompressed, decompressedLength, imageCount);

        emit NecksAdded(imageCount);
    }
    function addEmotions(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(emotionsTrait, encodedCompressed, decompressedLength, imageCount);

        emit EmotionsAdded(imageCount);
    }
    function addFaces(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(facesTrait, encodedCompressed, decompressedLength, imageCount);

        emit FacesAdded(imageCount);
    }
    function addEarses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(earsesTrait, encodedCompressed, decompressedLength, imageCount);

        emit EarsesAdded(imageCount);
    }
    function addNoses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(nosesTrait, encodedCompressed, decompressedLength, imageCount);

        emit NosesAdded(imageCount);
    }
    function addCheekses(
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(cheeksesTrait, encodedCompressed, decompressedLength, imageCount);

        emit CheeksesAdded(imageCount);
    }

    /**
     * @notice Update a single color palette. This function can be used to
     * add a new color palette or update an existing palette. This function does not check for data length validity
     * (len <= 768, len % 3 == 0).
     * @param paletteIndex the identifier of this palette
     * @param pointer the address of the contract holding the palette bytes. every 3 bytes represent an RGB color.
     * max length: 256 * 3 = 768.
     * @dev This function can only be called by the descriptor.
     */
    function setPalettePointer(uint8 paletteIndex, address pointer) external override onlyDescriptor {
        palettesPointers[paletteIndex] = pointer;

        emit PaletteSet(paletteIndex);
    }

    /**
     * @notice Add a batch of body images from an existing storage contract.
     * @param pointer the address of a contract where the image batch was stored using SSTORE2. The data
     * format is expected to be like {encodedCompressed}: bytes created by taking a string array of
     * RLE-encoded images, abi encoding it as a bytes array, and finally compressing it using deflate.
     * @param decompressedLength the size in bytes the images bytes were prior to compression; required input for Inflate.
     * @param imageCount the number of images in this batch; used when searching for images among batches.
     * @dev This function can only be called by the descriptor.
     */
    function addPunkTypesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(punkTypesTrait, pointer, decompressedLength, imageCount);

        emit PunkTypesAdded(imageCount);
    }
    function addHatsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(hatsTrait, pointer, decompressedLength, imageCount);

        emit HatsAdded(imageCount);
    }
    function addHelmetsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(helmetsTrait, pointer, decompressedLength, imageCount);

        emit HelmetsAdded(imageCount);
    }
    function addHairsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(hairsTrait, pointer, decompressedLength, imageCount);

        emit HairsAdded(imageCount);
    }
    function addBeardsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(beardsTrait, pointer, decompressedLength, imageCount);

        emit BeardsAdded(imageCount);
    }
    function addEyesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(eyesesTrait, pointer, decompressedLength, imageCount);

        emit EyesesAdded(imageCount);
    }
    function addGlassesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(glassesesTrait, pointer, decompressedLength, imageCount);

        emit GlassesesAdded(imageCount);
    }
    function addGogglesesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(gogglesesTrait, pointer, decompressedLength, imageCount);

        emit GogglesesAdded(imageCount);
    }
    function addMouthsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(mouthsTrait, pointer, decompressedLength, imageCount);

        emit MouthsAdded(imageCount);
    }
    function addTeethsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(teethsTrait, pointer, decompressedLength, imageCount);

        emit TeethsAdded(imageCount);
    }
    function addLipsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(lipsesTrait, pointer, decompressedLength, imageCount);

        emit LipsesAdded(imageCount);
    }
    function addNecksFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(necksTrait, pointer, decompressedLength, imageCount);

        emit NecksAdded(imageCount);
    }
    function addEmotionsFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(emotionsTrait, pointer, decompressedLength, imageCount);

        emit EmotionsAdded(imageCount);
    }
    function addFacesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(facesTrait, pointer, decompressedLength, imageCount);

        emit FacesAdded(imageCount);
    }
    function addEarsesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(earsesTrait, pointer, decompressedLength, imageCount);

        emit EarsesAdded(imageCount);
    }
    function addNosesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(nosesTrait, pointer, decompressedLength, imageCount);

        emit NosesAdded(imageCount);
    }
    function addCheeksesFromPointer(
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) external override onlyDescriptor {
        addPage(cheeksesTrait, pointer, decompressedLength, imageCount);

        emit CheeksesAdded(imageCount);
    }

    /**
     * @notice Get the number of available Punk `backgrounds`.
     */
    // function backgroundsCount() public view override returns (uint256) {
    //     return backgrounds.length;
    // }

    /**
     * @notice Get a head image bytes (RLE-encoded).
     */
    function punkTypes(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(punkTypesTrait, index);
    }
    function hats(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(hatsTrait, index);
    }
    function helmets(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(helmetsTrait, index);
    }
    function hairs(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(hairsTrait, index);
    }
    function beards(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(beardsTrait, index);
    }
    function eyeses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(eyesesTrait, index);
    }
    function glasseses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(glassesesTrait, index);
    }
    function goggleses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(gogglesesTrait, index);
    }
    function mouths(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(mouthsTrait, index);
    }
    function teeths(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(teethsTrait, index);
    }
    function lipses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(lipsesTrait, index);
    }
    function necks(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(necksTrait, index);
    }
    function emotions(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(emotionsTrait, index);
    }
    function faces(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(facesTrait, index);
    }
    function earses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(earsesTrait, index);
    }
    function noses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(nosesTrait, index);
    }
    function cheekses(uint256 index) public view override returns (bytes memory) {
        return imageByIndex(cheeksesTrait, index);
    }

    /**
     * @notice Get a color palette bytes.
     */
    function palettes(uint8 paletteIndex) public view override returns (bytes memory) {
        address pointer = palettesPointers[paletteIndex];
        if (pointer == address(0)) {
            revert PaletteNotFound();
        }
        return SSTORE2.read(palettesPointers[paletteIndex]);
    }

    // function _addBackground(string calldata _background) internal {
    //     backgrounds.push(_background);
    // }

    function addPage(
        Trait storage trait,
        bytes calldata encodedCompressed,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        if (encodedCompressed.length == 0) {
            revert EmptyBytes();
        }
        address pointer = SSTORE2.write(encodedCompressed);
        addPage(trait, pointer, decompressedLength, imageCount);
    }

    function addPage(
        Trait storage trait,
        address pointer,
        uint80 decompressedLength,
        uint16 imageCount
    ) internal {
        if (decompressedLength == 0) {
            revert BadDecompressedLength();
        }
        if (imageCount == 0) {
            revert BadImageCount();
        }
        trait.storagePages.push(
            NArtStoragePage({ pointer: pointer, decompressedLength: decompressedLength, imageCount: imageCount })
        );
        trait.storedImagesCount += imageCount;
    }

    function imageByIndex(IArt.Trait storage trait, uint256 index) internal view returns (bytes memory) {
        (IArt.NArtStoragePage storage page, uint256 indexInPage) = getPage(trait.storagePages, index);
        bytes[] memory decompressedImages = decompressAndDecode(page);
        return decompressedImages[indexInPage];
    }

    /**
     * @dev Given an image index, this function finds the storage page the image is in, and the relative index
     * inside the page, so the image can be read from storage.
     * Example: if you have 2 pages with 100 images each, and you want to get image 150, this function would return
     * the 2nd page, and the 50th index.
     * @return IArt.NArtStoragePage the page containing the image at index
     * @return uint256 the index of the image in the page
     */
    function getPage(IArt.NArtStoragePage[] storage pages, uint256 index)
        internal
        view
        returns (IArt.NArtStoragePage storage, uint256)
    {
        uint256 len = pages.length;
        uint256 pageFirstImageIndex = 0;
        for (uint256 i = 0; i < len; i++) {
            IArt.NArtStoragePage storage page = pages[i];

            if (index < pageFirstImageIndex + page.imageCount) {
                return (page, index - pageFirstImageIndex);
            }

            pageFirstImageIndex += page.imageCount;
        }

        revert ImageNotFound();
    }

    function decompressAndDecode(IArt.NArtStoragePage storage page) internal view returns (bytes[] memory) {
        bytes memory compressedData = SSTORE2.read(page.pointer);
        (, bytes memory decompressedData) = inflator.puff(compressedData, page.decompressedLength);
        return abi.decode(decompressedData, (bytes[]));
    }
}
