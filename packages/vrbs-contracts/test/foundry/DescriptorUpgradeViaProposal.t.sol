// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { N00unsToken } from '../../contracts/N00unsToken.sol';
import { N00unsDescriptorV2 } from '../../contracts/N00unsDescriptorV2.sol';
import { N00unsDAOLogicV1 } from '../../contracts/governance/N00unsDAOLogicV1.sol';

contract DescriptorUpgradeViaProposalTest is Test, DeployUtils {
    N00unsToken vrbsToken;
    N00unsDAOLogicV1 dao;
    address minter = address(2);
    address tokenHolder = address(1337);

    function setUp() public {
        address n00undersDAO = address(42);
        (address tokenAddress, address daoAddress) = _deployTokenAndDAOAndPopulateDescriptor(
            n00undersDAO,
            n00undersDAO,
            minter
        );
        vrbsToken = N00unsToken(tokenAddress);
        dao = N00unsDAOLogicV1(daoAddress);

        vm.startPrank(minter);
        vrbsToken.mint();
        vrbsToken.transferFrom(minter, tokenHolder, 1);
        vm.stopPrank();
    }

    function testUpgradeToV2ViaProposal() public {
        N00unsDescriptorV2 descriptorV2 = _deployAndPopulateV2();

        address[] memory targets = new address[](1);
        targets[0] = address(vrbsToken);
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

        assertEq(address(vrbsToken.descriptor()), address(descriptorV2));
    }
}
