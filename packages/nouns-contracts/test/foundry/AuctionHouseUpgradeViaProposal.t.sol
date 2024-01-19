// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtilsV3 } from './helpers/DeployUtilsV3.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';

contract AuctionHouseUpgradeViaProposalTest is Test, DeployUtilsV3 {
    NounsDAOV3Deployment deployment;
    NounsAuctionHouseV2 nounsAuctionHouseV2;

    function setUp() public {
        deployment = _deployDAOV3ReturnAll();
        nounsAuctionHouseV2 = NounsAuctionHouseV2(_deployAuctionHouseV2());

        vm.prank(address(deployment.timelock));
        NounsAuctionHouse(address(deployment.auctionHouseProxy)).unpause();
    }

    function testUpgradeToV2ViaProposal() public {
        address[] memory targets = new address[](1);
        targets[0] = address(deployment.auctionHouseProxyAdmin);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        string[] memory signatures = new string[](1);
        signatures[0] = 'upgrade(address,address)';

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encode(address(deployment.auctionHouseProxy), address(nounsAuctionHouseV2));

        uint256 blockNumber = block.number + 1;
        vm.roll(blockNumber);
        vm.prank(deployment.noundersDAO);

        deployment.dao.propose(targets, values, signatures, calldatas, 'upgrade auctionHouse to V2');
        blockNumber += UPDATABLE_PERIOD_BLOCKS + VOTING_DELAY + 1;

        vm.roll(blockNumber);
        vm.prank(deployment.noundersDAO);

        deployment.dao.castVote(1, 1);

        blockNumber += VOTING_PERIOD + 1;
        vm.roll(blockNumber);
        deployment.dao.queue(1);

        vm.warp(block.timestamp + TIMELOCK_DELAY + 1);
        deployment.dao.execute(1);

        vm.prank(address(deployment.auctionHouseProxyAdmin));
        assertEq(address(deployment.auctionHouseProxy.implementation()), address(nounsAuctionHouseV2));
    }
}
