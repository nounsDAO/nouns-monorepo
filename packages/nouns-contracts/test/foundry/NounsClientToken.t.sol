// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsClientToken } from '../../contracts/client-incentives/NounsClientToken.sol';
import { INounsClientTokenTypes } from '../../contracts/client-incentives/INounsClientTokenTypes.sol';

contract NounsClientTokenTest is Test {
    error OwnableUnauthorizedAccount(address account);

    NounsClientToken token;

    function setUp() public {
        token = new NounsClientToken(address(this), address(0));
    }

    function test_storageLocation() public {
        bytes32 expectedStorageLocation = keccak256(abi.encode(uint256(keccak256('nounsclienttoken')) - 1)) &
            ~bytes32(uint256(0xff));

        assertEq(token.STORAGE_LOCATION(), expectedStorageLocation);
    }

    function test_registerClient_firstIdIsOne() public {
        assertEq(token.registerClient('name', 'description'), 1);
        assertEq(token.registerClient('name', 'description'), 2);
    }

    function test_registerClient_storesMetadata() public {
        uint32 tokenId = token.registerClient('Camp', 'https://nouns.camp');
        INounsClientTokenTypes.ClientMetadata memory md = token.clientMetadata(tokenId);

        assertEq(md.name, 'Camp');
        assertEq(md.description, 'https://nouns.camp');

        tokenId = token.registerClient('Agora', 'https://nounsagora.com');
        md = token.clientMetadata(tokenId);

        assertEq(md.name, 'Agora');
        assertEq(md.description, 'https://nounsagora.com');
    }

    function test_updateClientMetadata_revertsForNonTokenOwner() public {
        uint32 tokenId = token.registerClient('name', 'description');

        address nonOwner = makeAddr('nonOwner');
        vm.expectRevert('NounsClientToken: not owner');
        vm.prank(nonOwner);
        token.updateClientMetadata(tokenId, 'newName', 'newDescription');
    }

    function test_updateClientMetadata_worksForTokenOwner() public {
        uint32 tokenId = token.registerClient('name', 'description');

        token.updateClientMetadata(tokenId, 'newName', 'newDescription');
        INounsClientTokenTypes.ClientMetadata memory md = token.clientMetadata(tokenId);

        assertEq(md.name, 'newName');
        assertEq(md.description, 'newDescription');
    }

    function test_setDescriptor_revertsForNonOwner() public {
        address nonOwner = makeAddr('nonOwner');
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, nonOwner));
        vm.prank(nonOwner);
        token.setDescriptor(address(0));
    }

    function test_setDescriptor_worksForOwner() public {
        address newDescriptor = makeAddr('newDescriptor');
        token.setDescriptor(newDescriptor);
        assertEq(token.descriptor(), newDescriptor);
    }
}
