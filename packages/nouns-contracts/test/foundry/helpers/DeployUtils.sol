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
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../../contracts/NounsAuctionHousePreV2Migration.sol';
import { WETH } from '../../../contracts/test/WETH.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 5_760; // About 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;
    uint256 constant AUCTION_TIME_BUFFER = 5 minutes;
    uint256 constant AUCTION_RESERVE_PRICE = 1;
    uint8 constant AUCTION_MIN_BID_INCREMENT_PRCT = 2;
    uint256 constant AUCTION_DURATION = 24 hours;

    function _deployAuctionHouseV1AndToken(
        address owner,
        address noundersDAO,
        address minter
    ) internal returns (NounsAuctionHouseProxy, NounsAuctionHouseProxyAdmin) {
        NounsAuctionHouse logic = new NounsAuctionHouse();
        NounsToken token = deployToken(noundersDAO, minter);
        WETH weth = new WETH();
        NounsAuctionHouseProxyAdmin admin = new NounsAuctionHouseProxyAdmin();
        admin.transferOwnership(owner);

        bytes memory data = abi.encodeWithSelector(
            NounsAuctionHouse.initialize.selector,
            address(token),
            address(weth),
            AUCTION_TIME_BUFFER,
            AUCTION_RESERVE_PRICE,
            AUCTION_MIN_BID_INCREMENT_PRCT,
            AUCTION_DURATION
        );
        NounsAuctionHouseProxy proxy = new NounsAuctionHouseProxy(address(logic), address(admin), data);
        NounsAuctionHouse auction = NounsAuctionHouse(address(proxy));

        auction.transferOwnership(owner);
        token.setMinter(address(proxy));

        return (proxy, admin);
    }

    function _upgradeAuctionHouse(
        address owner,
        NounsAuctionHouseProxyAdmin proxyAdmin,
        NounsAuctionHouseProxy proxy
    ) internal {
        NounsAuctionHouseV2 newLogic = new NounsAuctionHouseV2();
        NounsAuctionHousePreV2Migration migratorLogic = new NounsAuctionHousePreV2Migration();

        vm.startPrank(owner);

        // not using upgradeAndCall because the call must come from the auction house owner
        // which is owner, not the proxy admin

        proxyAdmin.upgrade(proxy, address(migratorLogic));
        NounsAuctionHousePreV2Migration migrator = NounsAuctionHousePreV2Migration(address(proxy));
        migrator.migrate();

        proxyAdmin.upgrade(proxy, address(newLogic));
        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(address(proxy));
        auctionV2.initializeOracle();

        vm.stopPrank();
    }

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

    function deployToken(address noundersDAO, address minter) internal returns (NounsToken nounsToken) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));
        NounsDescriptorV2 descriptor = _deployAndPopulateV2();

        nounsToken = new NounsToken(noundersDAO, minter, descriptor, new NounsSeeder(), proxyRegistry);
    }
}
