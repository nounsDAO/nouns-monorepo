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

        uint256 nonce = 1234;

        uint40 expiry = 1677625200;

        bytes memory signature = hex'f35c03a63181e13c0066721b1dce622653785ed5e6621d709608b1ddd14584bf17b9bfa1b784e958ec9dda55acc0660f0cc583f507e2480cf128f5063d87bb791b';

        address signer = checker.checkSig(targets, values, signatures, calldatas, description, nonce, expiry, signature);
        
        assertEq(signer, 0xaD36c32F3c28A9214ADCf50A09998de1d3b0EE06);
    }
}