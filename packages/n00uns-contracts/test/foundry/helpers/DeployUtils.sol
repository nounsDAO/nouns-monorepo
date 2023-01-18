// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { N00unsDescriptorV2 } from '../../../contracts/N00unsDescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { N00unsArt } from '../../../contracts/N00unsArt.sol';
import { N00unsDAOExecutor } from '../../../contracts/governance/N00unsDAOExecutor.sol';
import { N00unsDAOLogicV1 } from '../../../contracts/governance/N00unsDAOLogicV1.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { N00unsDescriptor } from '../../../contracts/N00unsDescriptor.sol';
import { N00unsSeeder } from '../../../contracts/N00unsSeeder.sol';
import { N00unsToken } from '../../../contracts/N00unsToken.sol';
import { N00unsDAOProxy } from '../../../contracts/governance/N00unsDAOProxy.sol';
import { Inflator } from '../../../contracts/Inflator.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 5_760; // About 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;

    function _deployAndPopulateDescriptor() internal returns (N00unsDescriptor) {
        N00unsDescriptor descriptor = new N00unsDescriptor();
        _populateDescriptor(descriptor);
        return descriptor;
    }

    function _deployAndPopulateV2() internal returns (N00unsDescriptorV2) {
        N00unsDescriptorV2 descriptorV2 = _deployDescriptorV2();
        _populateDescriptorV2(descriptorV2);
        return descriptorV2;
    }

    function _deployDescriptorV2() internal returns (N00unsDescriptorV2) {
        SVGRenderer renderer = new SVGRenderer();
        Inflator inflator = new Inflator();
        N00unsDescriptorV2 descriptorV2 = new N00unsDescriptorV2(N00unsArt(address(0)), renderer);
        N00unsArt art = new N00unsArt(address(descriptorV2), inflator);
        descriptorV2.setArt(art);
        return descriptorV2;
    }

    function _deployTokenAndDAOAndPopulateDescriptor(
        address n00undersDAO,
        address vetoer,
        address minter
    ) internal returns (address, address) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));

        N00unsDAOExecutor timelock = new N00unsDAOExecutor(address(1), TIMELOCK_DELAY);
        N00unsDescriptor descriptor = new N00unsDescriptor();
        N00unsToken n00unsToken = new N00unsToken(n00undersDAO, minter, descriptor, new N00unsSeeder(), proxyRegistry);
        N00unsDAOProxy proxy = new N00unsDAOProxy(
            address(timelock),
            address(n00unsToken),
            vetoer,
            address(timelock),
            address(new N00unsDAOLogicV1()),
            VOTING_PERIOD,
            VOTING_DELAY,
            PROPOSAL_THRESHOLD,
            QUORUM_VOTES_BPS
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(proxy));
        vm.prank(address(proxy));
        timelock.acceptAdmin();

        n00unsToken.transferOwnership(address(timelock));

        _populateDescriptor(descriptor);

        return (address(n00unsToken), address(proxy));
    }
}
