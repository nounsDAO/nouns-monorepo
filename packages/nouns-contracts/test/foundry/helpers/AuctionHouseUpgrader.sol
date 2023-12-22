// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../../contracts/NounsAuctionHousePreV2Migration.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import 'forge-std/Vm.sol';

library AuctionHouseUpgrader {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256('hevm cheat code')))));

    function upgradeAuctionHouse(
        address owner,
        NounsAuctionHouseProxyAdmin proxyAdmin,
        NounsAuctionHouseProxy proxy
    ) internal {
        NounsAuctionHouse auctionV1 = NounsAuctionHouse(address(proxy));

        NounsAuctionHouseV2 newLogic = new NounsAuctionHouseV2(
            auctionV1.nouns(),
            auctionV1.weth(),
            auctionV1.duration()
        );
        NounsAuctionHousePreV2Migration migratorLogic = new NounsAuctionHousePreV2Migration();

        vm.startPrank(owner);

        // not using upgradeAndCall because the call must come from the auction house owner
        // which is owner, not the proxy admin

        proxyAdmin.upgrade(proxy, address(migratorLogic));
        NounsAuctionHousePreV2Migration migrator = NounsAuctionHousePreV2Migration(address(proxy));
        migrator.migrate();
        proxyAdmin.upgrade(proxy, address(newLogic));

        vm.stopPrank();
    }
}
