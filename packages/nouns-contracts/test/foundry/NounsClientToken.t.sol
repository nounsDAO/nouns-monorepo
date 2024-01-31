// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsClientToken } from '../../contracts/client-incentives/NounsClientToken.sol';

contract NounsClientTokenTest is Test {
    function test_storageLocation() public {
        NounsClientToken token = new NounsClientToken(address(this), address(0));

        bytes32 expectedStorageLocation = keccak256(abi.encode(uint256(keccak256('nounsclienttoken')) - 1)) &
            ~bytes32(uint256(0xff));

        assertEq(token.STORAGE_LOCATION(), expectedStorageLocation);
    }
}
