// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { NounsDescriptorV3 } from '../../../contracts/NounsDescriptorV3.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { NounsArt } from '../../../contracts/NounsArt.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDescriptor } from '../../../contracts/NounsDescriptor.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { Inflator } from '../../../contracts/Inflator.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouseV3 } from '../../../contracts/NounsAuctionHouseV3.sol';
import { WETH } from '../../../contracts/test/WETH.sol';
import { StreamEscrow } from '../../../contracts/StreamEscrow.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 7_200; // 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;
    uint256 constant AUCTION_TIME_BUFFER = 5 minutes;
    uint256 constant AUCTION_RESERVE_PRICE = 1;
    uint8 constant AUCTION_MIN_BID_INCREMENT_PRCT = 2;
    uint256 constant AUCTION_DURATION = 24 hours;
    uint16 constant IMMEDIATE_TREASURY_BPS = 2000;
    uint16 constant STREAM_LENGTH_IN_AUCTIONS = 1500;

    function _deployAuctionHouseAndToken(
        address owner,
        address noundersDAO,
        address minter
    ) internal returns (NounsAuctionHouseProxy, NounsAuctionHouseProxyAdmin) {
        NounsToken token = deployToken(noundersDAO, minter);
        NounsAuctionHouseV3 logic = new NounsAuctionHouseV3(token, address(new WETH()), AUCTION_DURATION);
        NounsAuctionHouseProxyAdmin admin = new NounsAuctionHouseProxyAdmin();
        admin.transferOwnership(owner);

        address predictedAuctionHouseProxyAddress = computeCreateAddress(address(this), vm.getNonce(address(this)) + 1);

        StreamEscrow streamEscrow = new StreamEscrow(
            owner,
            owner,
            owner,
            address(token),
            predictedAuctionHouseProxyAddress,
            24 hours
        );

        bytes memory data = abi.encodeWithSelector(
            NounsAuctionHouseV3.initialize.selector,
            AUCTION_RESERVE_PRICE,
            AUCTION_TIME_BUFFER,
            AUCTION_MIN_BID_INCREMENT_PRCT,
            IMMEDIATE_TREASURY_BPS,
            STREAM_LENGTH_IN_AUCTIONS,
            streamEscrow
        );
        NounsAuctionHouseProxy proxy = new NounsAuctionHouseProxy(address(logic), address(admin), data);
        assertEq(predictedAuctionHouseProxyAddress, address(proxy), 'wrong address');
        NounsAuctionHouseV3 auction = NounsAuctionHouseV3(address(proxy));

        auction.transferOwnership(owner);
        token.setMinter(address(proxy));

        return (proxy, admin);
    }

    uint32 constant LAST_MINUTE_BLOCKS = 10;
    uint32 constant OBJECTION_PERIOD_BLOCKS = 10;
    uint32 constant UPDATABLE_PERIOD_BLOCKS = 10;
    uint256 constant DELAYED_GOV_DURATION = 30 days;
    uint256 constant FORK_PERIOD = 7 days;
    uint256 constant FORK_THRESHOLD_BPS = 2_000; // 20%
    uint256 public constant FORK_DAO_VOTING_PERIOD = 36000; // 5 days
    uint256 public constant FORK_DAO_VOTING_DELAY = 36000; // 5 days
    uint256 public constant FORK_DAO_PROPOSAL_THRESHOLD_BPS = 25; // 0.25%
    uint256 public constant FORK_DAO_QUORUM_VOTES_BPS = 1000; // 10%

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

    function _deployAndPopulateV3() internal returns (NounsDescriptorV3) {
        NounsDescriptorV3 descriptorV3 = _deployDescriptorV3();
        _populateDescriptorV3(descriptorV3);
        return descriptorV3;
    }

    function _deployDescriptorV3() internal returns (NounsDescriptorV3) {
        SVGRenderer renderer = new SVGRenderer();
        Inflator inflator = new Inflator();
        NounsDescriptorV3 descriptorV3 = new NounsDescriptorV3(NounsArt(address(0)), renderer);
        NounsArt art = new NounsArt(address(descriptorV3), inflator);
        descriptorV3.setArt(art);
        return descriptorV3;
    }

    function deployToken(address noundersDAO, address minter) internal returns (NounsToken nounsToken) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));
        NounsDescriptorV3 descriptor = _deployAndPopulateV3();

        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);
    }

    function get1967Implementation(address proxy) internal view returns (address) {
        bytes32 slot = bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1);
        return address(uint160(uint256(vm.load(proxy, slot))));
    }
}