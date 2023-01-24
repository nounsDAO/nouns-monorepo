// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { SignatureChecker } from '../../../contracts/governance/SignatureChecker.sol';

contract SignatureCheckerTest is Test {

    SignatureChecker checker = new SignatureChecker();

    function testMe() public {
        console.log('hello', address(checker));
        assertEq(address(checker), 0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f, 'contract address changed');
        console.log('chainId', block.chainid);

        address proposer = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

        address[] memory targets = new address[](2);
        targets[0] = 0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC;
        targets[1] = 0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa;

        uint256[] memory values = new uint256[](2);
        values[0] = 1000000000000000000;
        values[1] = 0;

        string[] memory signatures = new string[](2);
        signatures[0] = 'sendOrRegisterDebt(address,uint256)';
        signatures[1] = '';

        bytes[] memory calldatas = new bytes[](2);
        calldatas[0] = hex'0000000000000000000000002B63BC71926AD001BCAFD9DF55952CF8FAD4F1B20000000000000000000000000000000000000000000000000000002F49B40F00';
        calldatas[1] = '';

        string memory description = 'This is my awesome proposal';

        uint40 expiry = 1677625200;

        bytes memory signature = hex'586618161e0258fa438e572435d35a1c81c282be78eefa4873277e7739c982ae7987fc125871a05e7392967203a5b379347620b4c176bb7fc7b9eb2e13130a5f1b';

        address signer = checker.checkSig(proposer, targets, values, signatures, calldatas, description, expiry, signature);
        
        assertEq(signer, 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    }
}