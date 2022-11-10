// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { NounsBRDescriptorV2 } from '../../../contracts/NounsBRDescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { NounsBRArt } from '../../../contracts/NounsBRArt.sol';
import { NounsBRDAOExecutor } from '../../../contracts/governance/NounsBRDAOExecutor.sol';
import { NounsBRDAOLogicV1 } from '../../../contracts/governance/NounsBRDAOLogicV1.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsBRDescriptor } from '../../../contracts/NounsBRDescriptor.sol';
import { NounsBRSeeder } from '../../../contracts/NounsBRSeeder.sol';
import { NounsBRToken } from '../../../contracts/NounsBRToken.sol';
import { NounsBRDAOProxy } from '../../../contracts/governance/NounsBRDAOProxy.sol';
import { Inflator } from '../../../contracts/Inflator.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 5_760; // About 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;

    function _deployAndPopulateDescriptor() internal returns (NounsBRDescriptor) {
        NounsBRDescriptor descriptor = new NounsBRDescriptor();
        _populateDescriptor(descriptor);
        return descriptor;
    }

    function _deployAndPopulateV2() internal returns (NounsBRDescriptorV2) {
        NounsBRDescriptorV2 descriptorV2 = _deployDescriptorV2();
        _populateDescriptorV2(descriptorV2);
        return descriptorV2;
    }

    function _deployDescriptorV2() internal returns (NounsBRDescriptorV2) {
        SVGRenderer renderer = new SVGRenderer();
        Inflator inflator = new Inflator();
        NounsBRDescriptorV2 descriptorV2 = new NounsBRDescriptorV2(NounsBRArt(address(0)), renderer);
        NounsBRArt art = new NounsBRArt(address(descriptorV2), inflator);
        descriptorV2.setArt(art);
        return descriptorV2;
    }

    function _deployTokenAndDAOAndPopulateDescriptor(
        address noundersbrDAO,
        address vetoer,
        address minter
    ) internal returns (address, address) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));

        NounsBRDAOExecutor timelock = new NounsBRDAOExecutor(address(1), TIMELOCK_DELAY);
        NounsBRDescriptor descriptor = new NounsBRDescriptor();
        NounsBRToken nounsbrToken = new NounsBRToken(noundersbrDAO, minter, descriptor, new NounsBRSeeder(), proxyRegistry);
        NounsBRDAOProxy proxy = new NounsBRDAOProxy(
            address(timelock),
            address(nounsbrToken),
            vetoer,
            address(timelock),
            address(new NounsBRDAOLogicV1()),
            VOTING_PERIOD,
            VOTING_DELAY,
            PROPOSAL_THRESHOLD,
            QUORUM_VOTES_BPS
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(proxy));
        vm.prank(address(proxy));
        timelock.acceptAdmin();

        nounsbrToken.transferOwnership(address(timelock));

        _populateDescriptor(descriptor);

        return (address(nounsbrToken), address(proxy));
    }
}
