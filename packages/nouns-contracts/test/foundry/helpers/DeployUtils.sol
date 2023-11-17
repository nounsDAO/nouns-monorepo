// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { NounsArt } from '../../../contracts/NounsArt.sol';
import { NounsDAOExecutor } from '../../../contracts/governance/NounsDAOExecutor.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { NounsDAOStorageV2 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { Inflator } from '../../../contracts/Inflator.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 7_200; // 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;
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

    function get1967Implementation(address proxy) internal returns (address) {
        bytes32 slot = bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1);
        return address(uint160(uint256(vm.load(proxy, slot))));
    }
}
