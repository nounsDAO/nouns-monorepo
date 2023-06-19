// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { DescriptorV2 } from '../../../contracts/DescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { Art } from '../../../contracts/Art.sol';
import { DAOExecutor } from '../../../contracts/governance/DAOExecutor.sol';
import { DAOLogicV1 } from '../../../contracts/governance/DAOLogicV1.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { Descriptor } from '../../../contracts/Descriptor.sol';
import { Seeder } from '../../../contracts/Seeder.sol';
import { VrbsToken } from '../../../contracts/VrbsToken.sol';
import { DAOProxy } from '../../../contracts/governance/DAOProxy.sol';
import { Inflator } from '../../../contracts/Inflator.sol';

abstract contract DeployUtils is Test, DescriptorHelpers {
    uint256 constant TIMELOCK_DELAY = 2 days;
    uint256 constant VOTING_PERIOD = 5_760; // About 24 hours
    uint256 constant VOTING_DELAY = 1;
    uint256 constant PROPOSAL_THRESHOLD = 1;
    uint256 constant QUORUM_VOTES_BPS = 2000;

    function _deployAndPopulateDescriptor() internal returns (Descriptor) {
        Descriptor descriptor = new Descriptor();
        _populateDescriptor(descriptor);
        return descriptor;
    }

    function _deployAndPopulateV2() internal returns (DescriptorV2) {
        DescriptorV2 descriptorV2 = _deployDescriptorV2();
        _populateDescriptorV2(descriptorV2);
        return descriptorV2;
    }

    function _deployDescriptorV2() internal returns (DescriptorV2) {
        SVGRenderer renderer = new SVGRenderer();
        Inflator inflator = new Inflator();
        DescriptorV2 descriptorV2 = new DescriptorV2(Art(address(0)), renderer);
        Art art = new Art(address(descriptorV2), inflator);
        descriptorV2.setArt(art);
        return descriptorV2;
    }

    function _deployTokenAndDAOAndPopulateDescriptor(
        address vrbsDAO,
        address vetoer,
        address minter
    ) internal returns (address, address) {
        IProxyRegistry proxyRegistry = IProxyRegistry(address(3));

        DAOExecutor timelock = new DAOExecutor(address(1), TIMELOCK_DELAY);
        Descriptor descriptor = new Descriptor();
        VrbsToken vrbsToken = new VrbsToken(vrbsDAO, minter, descriptor, new Seeder(), proxyRegistry);
        DAOProxy proxy = new DAOProxy(
            address(timelock),
            address(vrbsToken),
            vetoer,
            address(timelock),
            address(new DAOLogicV1()),
            VOTING_PERIOD,
            VOTING_DELAY,
            PROPOSAL_THRESHOLD,
            QUORUM_VOTES_BPS
        );

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(proxy));
        vm.prank(address(proxy));
        timelock.acceptAdmin();

        vrbsToken.transferOwnership(address(timelock));

        _populateDescriptor(descriptor);

        return (address(vrbsToken), address(proxy));
    }
}
