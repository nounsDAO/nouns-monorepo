// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { NounsArt } from '../../../contracts/NounsArt.sol';
import { NounsDAOExecutor } from '../../../contracts/governance/NounsDAOExecutor.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDescriptor } from '../../../contracts/NounsDescriptor.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { Inflator } from '../../../contracts/Inflator.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 5_760; // About 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;

    // Auction House Config
    uint256 constant TIME_BUFFER = 900; // 15 minutes in seconds
    uint256 constant RESERVE_PRICE = 2; // Whole number
    uint256 constant MIN_INCREMENT_BID_PERCENTAGE = 5; // Whole number
    uint256 constant DURATION = 86400; // 24 hours in seconds

    function _deployAndPopulateDescriptor() internal returns (NounsDescriptor) {
        NounsDescriptor descriptor = new NounsDescriptor();
        _populateDescriptor(descriptor);
        return descriptor;
    }

    function _deployAndPopulateV2() internal returns (NounsDescriptorV2) {
        NounsDescriptorV2 descriptorV2 = _deployDescriptorV2();
        _populateDescriptorV2(descriptorV2);
        return descriptorV2;
    }

    function _deployDescriptorV2() internal returns (NounsDescriptorV2) {
        SVGRenderer renderer = new SVGRenderer();
        Inflator inflator = new Inflator();
        NounsDescriptorV2 descriptorV2 = new NounsDescriptorV2(NounsArt(address(0)), renderer);
        NounsArt art = new NounsArt(address(descriptorV2), inflator);
        descriptorV2.setArt(art);
        return descriptorV2;
    }

    function _deployAuctionHouseV2() internal returns (address) {
        NounsAuctionHouseV2 auctionHouseV2 = new NounsAuctionHouseV2();
        return (address(auctionHouseV2));
    }

    function _deployTokenAndDAOAndPopulateDescriptor(
        address noundersDAO,
        address vetoer,
        address minter
    ) internal returns (address, address) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));

        NounsDAOExecutor timelock = new NounsDAOExecutor(address(1), TIMELOCK_DELAY);
        NounsDescriptor descriptor = new NounsDescriptor();
        NounsToken nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);
        NounsDAOProxy proxy = new NounsDAOProxy(
            address(timelock),
            address(nounsToken),
            vetoer,
            address(timelock),
            address(new NounsDAOLogicV1()),
            VOTING_PERIOD,
            VOTING_DELAY,
            PROPOSAL_THRESHOLD,
            QUORUM_VOTES_BPS
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(proxy));
        vm.prank(address(proxy));
        timelock.acceptAdmin();

        nounsToken.transferOwnership(address(timelock));

        _populateDescriptor(descriptor);

        return (address(nounsToken), address(proxy));
    }

    function _deployTokenAndDAOAndAndAuctionHouseAndPopulateDescriptor(
        address noundersDAO,
        address vetoer,
        address minter,
        address weth
    ) internal returns (address, address, address, address, address) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));

        NounsDAOExecutor timelock = new NounsDAOExecutor(address(1), TIMELOCK_DELAY);
        NounsDescriptor descriptor = new NounsDescriptor();
        NounsToken nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);
        NounsDAOProxy proxy = new NounsDAOProxy(
            address(timelock),
            address(nounsToken),
            vetoer,
            address(timelock),
            address(new NounsDAOLogicV1()),
            VOTING_PERIOD,
            VOTING_DELAY,
            PROPOSAL_THRESHOLD,
            QUORUM_VOTES_BPS
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(proxy));
        vm.prank(address(proxy));
        timelock.acceptAdmin();

        nounsToken.transferOwnership(address(timelock));

        // logic, admin, data
        NounsAuctionHouse auctionHouse = new NounsAuctionHouse();
        NounsAuctionHouseProxyAdmin auctionHouseProxyAdmin = new NounsAuctionHouseProxyAdmin();

        NounsAuctionHouseProxy auctionHouseProxy = new NounsAuctionHouseProxy(
            address(nounsToken),
            address(auctionHouseProxyAdmin),
            abi.encodeWithSignature(
                'initialize(address,address,uint256,uint256,uint8,uint256)',
                address(nounsToken),
                weth,
                TIME_BUFFER,
                RESERVE_PRICE,
                MIN_INCREMENT_BID_PERCENTAGE,
                DURATION
            )
        );

        _populateDescriptor(descriptor);

        return (
            address(nounsToken),
            address(proxy),
            address(auctionHouseProxy),
            address(auctionHouseProxyAdmin),
            address(auctionHouse)
        );
    }
}
