// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DeployUtils } from './helpers/DeployUtils.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { NounsDescriptorV2 } from '../../contracts/NounsDescriptorV2.sol';
import { NounsDAOLogicV1 } from '../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsAuctionHouse } from '../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHouseProxy } from '../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';


contract AuctionHouseUpgradeViaProposalTest is Test, DeployUtils {
    NounsDAOLogicV1 dao;
    NounsAuctionHouse nounsAuctionHouse;
    NounsAuctionHouseV2 nounsAuctionHouseV2;
    NounsAuctionHouseProxy nounsAuctionHouseProxy;
    NounsAuctionHouseProxyAdmin nounsAuctionHouseProxyAdmin;
    address minter = address(2);
    address tokenHolder = address(1337);
    address weth = address(1234);

    function setUp() public {
        address noundersDAO = address(42);
        (address tokenAddress, address daoAddress, address auctionHouseProxy, address auctionHouseProxyAdmin, address auctionHouseAddress) = _deployTokenAndDAOAndAndAuctionHouseAndPopulateDescriptor(
            noundersDAO,
            noundersDAO,
            minter,
            weth
        );

        (address nounsAuctionHouseV2Address) = _deployAuctionHouseV2();

        dao = NounsDAOLogicV1(daoAddress);
        nounsAuctionHouseProxy = NounsAuctionHouseProxy(auctionHouseProxy);
        nounsAuctionHouseProxyAdmin = NounsAuctionHouseProxyAdmin(auctionHouseProxyAdmin);
        nounsAuctionHouseV2 = NounsAuctionHouseV2(nounsAuctionHouseV2Address);

        vm.stopPrank();
    }

    function testUpgradeToV2ViaProposal() public {

        address[] memory targets = new address[](1);
        targets[0] = address(nounsAuctionHouseProxyAdmin);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        string[] memory signatures = new string[](1);
        signatures[0] = 'upgrade(address,address)';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encode(address(nounsAuctionHouseProxy), address(nounsAuctionHouseV2));

        uint256 blockNumber = block.number + 1;
        vm.roll(blockNumber);

        vm.startPrank(tokenHolder);
        dao.propose(targets, values, signatures, calldatas, 'upgrade auctionHouse to V2');
        blockNumber += VOTING_DELAY + 1;
        vm.roll(blockNumber);
        dao.castVote(1, 1);
        vm.stopPrank();

        blockNumber += VOTING_PERIOD + 1;
        vm.roll(blockNumber);
        dao.queue(1);

        vm.warp(block.timestamp + TIMELOCK_DELAY + 1);
        dao.execute(1);

        assertEq(address(nounsAuctionHouseProxy.implementation()), address(nounsAuctionHouseV2));
    }
}
