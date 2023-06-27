// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';

contract DescriptorUpgradeViaProposalTest is Test, DeployUtils {
    NounsToken nounsToken;
    NounsDAOLogicV1 dao;
    address minter = address(2);
    address tokenHolder = address(1337);

    function setUp() public {
        address noundersDAO = address(42);
        (address tokenAddress, address daoAddress) = _deployTokenAndDAOAndPopulateDescriptor(
            noundersDAO,
            noundersDAO,
            minter
        );
        nounsToken = NounsToken(tokenAddress);
        dao = NounsDAOLogicV1(daoAddress);

        vm.startPrank(minter);
        nounsToken.mint();
        nounsToken.transferFrom(minter, tokenHolder, 1);
        vm.stopPrank();
    }

    function testUpgradeToV2ViaProposal() public {
        NounsDescriptorV2 descriptorV2 = _deployAndPopulateV2();

        address[] memory targets = new address[](1);
        targets[0] = address(nounsToken);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        string[] memory signatures = new string[](1);
        signatures[0] = 'setDescriptor(address)';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encode(address(descriptorV2));

        uint256 blockNumber = block.number + 1;
        vm.roll(blockNumber);

        vm.startPrank(tokenHolder);
        dao.propose(targets, values, signatures, calldatas, 'upgrade descriptor');
        blockNumber += VOTING_DELAY + 1;
        vm.roll(blockNumber);
        dao.castVote(1, 1);
        vm.stopPrank();

        blockNumber += VOTING_PERIOD + 1;
        vm.roll(blockNumber);
        dao.queue(1);

        vm.warp(block.timestamp + TIMELOCK_DELAY + 1);
        dao.execute(1);

        assertEq(address(nounsToken.descriptor()), address(descriptorV2));
    }
}
