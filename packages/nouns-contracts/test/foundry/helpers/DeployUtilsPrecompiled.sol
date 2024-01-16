// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { Vm } from 'forge-std/Vm.sol';
import { LibString } from '../lib/LibString.sol';
import { StdCheats } from 'forge-std/StdCheats.sol';

interface IDeployUtilsV3 {
    function _deployDAOV3() external returns (address);
}

contract DeployUtilsPrecompiled is StdCheats {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256('hevm cheat code')))));

    function createDeployUtils() public returns (IDeployUtilsV3) {
        address admin = deployCode('NounsDAOV3Admin.sol:NounsDAOV3Admin');
        address dq = deployCode('NounsDAOV3DynamicQuorum.sol:NounsDAOV3DynamicQuorum');
        address proposals = deployCode('NounsDAOV3Proposals.sol:NounsDAOV3Proposals');
        address votes = deployCode('NounsDAOV3Votes.sol:NounsDAOV3Votes');
        address fork = deployCode('NounsDAOV3Fork.sol:NounsDAOV3Fork');
        address nftDescriptor = deployCode('NFTDescriptorV2.sol:NFTDescriptorV2');

        // address deployUtils = deployCode('DeployUtilsV3.sol:DeployUtilsV3');
        string memory json = vm.readFile('foundry-out/DeployUtilsV3.sol/DeployUtilsV3.json');
        string memory bytecodeStr = vm.parseJsonString(json, '.bytecode.object');
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$7233c33f2e1e35848c685b0eb24649959e$__',
            LibString.toHexStringNoPrefix(uint160(nftDescriptor))
        );
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$6b2c3c31209dc1063f71f99a4b846d2a48$__',
            LibString.toHexStringNoPrefix(uint160(admin))
        );
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$7c2b71830abfdb155746b49d6274a3e8a1$__',
            LibString.toHexStringNoPrefix(uint160(dq))
        );
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$ba0641d135fd5ce8e3b6f54b3cdb867be5$__',
            LibString.toHexStringNoPrefix(uint160(proposals))
        );
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$48ba7953212f65fdc19642291ad4e176dc$__',
            LibString.toHexStringNoPrefix(uint160(votes))
        );
        bytecodeStr = LibString.replace(
            bytecodeStr,
            '__$8d968f398818e8b64e76aef150982699ba$__',
            LibString.toHexStringNoPrefix(uint160(fork))
        );
        bytes memory bytecode = vm.parseBytes(bytecodeStr);
        address addr;
        // @solidity memory-safe-assembly
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
        }
        require(addr != address(0), 'DeployUtilsDeployer deploy failed.');

        return IDeployUtilsV3(addr);
    }
}
