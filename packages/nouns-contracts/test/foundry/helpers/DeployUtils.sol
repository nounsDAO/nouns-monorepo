// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import 'forge-std/Test.sol';
import { DescriptorHelpers } from './DescriptorHelpers.sol';
import { NounsDescriptorV2 } from '../../../contracts/NounsDescriptorV2.sol';
import { SVGRenderer } from '../../../contracts/SVGRenderer.sol';
import { NounsArt } from '../../../contracts/NounsArt.sol';
import { NounsDAOExecutor } from '../../../contracts/governance/NounsDAOExecutor.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV2 } from '../../../contracts/governance/NounsDAOLogicV2.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { IProxyRegistry } from '../../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDescriptor } from '../../../contracts/NounsDescriptor.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { NounsDAOStorageV2, NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOProxyV2 } from '../../../contracts/governance/NounsDAOProxyV2.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { Inflator } from '../../../contracts/Inflator.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { ProxyRegistryMock } from './ProxyRegistryMock.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { NounsTokenFork } from '../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from '../../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { ERC1967Proxy } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';

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

    function _createDAOV3Proxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal returns (NounsDAOLogicV1 dao) {
        uint256 nonce = vm.getNonce(address(this));
        address predictedForkEscrowAddress = computeCreateAddress(address(this), nonce + 2);
        dao = NounsDAOLogicV1(
            payable(
                new NounsDAOProxyV3(
                    timelock,
                    nounsToken,
                    predictedForkEscrowAddress,
                    address(0),
                    vetoer,
                    timelock,
                    address(new NounsDAOLogicV3()),
                    NounsDAOStorageV3.NounsDAOParams({
                        votingPeriod: VOTING_PERIOD,
                        votingDelay: VOTING_DELAY,
                        proposalThresholdBPS: PROPOSAL_THRESHOLD,
                        lastMinuteWindowInBlocks: 0,
                        objectionPeriodDurationInBlocks: 0,
                        proposalUpdatablePeriodInBlocks: 0
                    }),
                    NounsDAOStorageV3.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    })
                )
            )
        );
        address(new NounsDAOForkEscrow(address(dao)));
    }

    function _createDAOV2Proxy(
        address timelock,
        address nounsToken,
        address vetoer
    ) internal returns (NounsDAOLogicV1) {
        return
            NounsDAOLogicV1(
                payable(
                    new NounsDAOProxyV2(
                        timelock,
                        nounsToken,
                        vetoer,
                        timelock,
                        address(new NounsDAOLogicV2()),
                        VOTING_PERIOD,
                        VOTING_DELAY,
                        PROPOSAL_THRESHOLD,
                        NounsDAOStorageV2.DynamicQuorumParams({
                            minQuorumVotesBPS: 200,
                            maxQuorumVotesBPS: 2000,
                            quorumCoefficient: 10000
                        })
                    )
                )
            );
    }

    function _deployDAOV3() internal returns (NounsDAOLogicV3) {
        address noundersDAO = makeAddr('noundersDAO');
        address vetoer = makeAddr('vetoer');

        NounsDAOExecutorV2 timelock = NounsDAOExecutorV2(
            payable(address(new ERC1967Proxy(address(new NounsDAOExecutorV2()), '')))
        );
        timelock.initialize(address(1), TIMELOCK_DELAY);

        NounsAuctionHouse auctionLogic = new NounsAuctionHouse();
        NounsAuctionHouseProxyAdmin auctionAdmin = new NounsAuctionHouseProxyAdmin();
        NounsAuctionHouseProxy auctionProxy = new NounsAuctionHouseProxy(
            address(auctionLogic),
            address(auctionAdmin),
            ''
        );
        auctionAdmin.transferOwnership(address(timelock));

        NounsToken nounsToken = new NounsToken(
            noundersDAO,
            address(auctionProxy),
            _deployAndPopulateV2(),
            new NounsSeeder(),
            new ProxyRegistryMock()
        );
        nounsToken.transferOwnership(address(timelock));
        address daoLogicImplementation = address(new NounsDAOLogicV3());

        uint256 nonce = vm.getNonce(address(this));
        address predictedForkEscrowAddress = computeCreateAddress(address(this), nonce + 6);

        ForkDAODeployer forkDeployer = new ForkDAODeployer(
            address(new NounsTokenFork()),
            address(new NounsAuctionHouseFork()),
            address(new NounsDAOLogicV1Fork()),
            address(new NounsDAOExecutorV2()),
            predictedForkEscrowAddress,
            DELAYED_GOV_DURATION
        );

        NounsDAOLogicV3 dao = NounsDAOLogicV3(
            payable(
                new NounsDAOProxyV3(
                    address(timelock),
                    address(nounsToken),
                    predictedForkEscrowAddress,
                    address(forkDeployer),
                    vetoer,
                    address(timelock),
                    daoLogicImplementation,
                    NounsDAOStorageV3.NounsDAOParams({
                        votingPeriod: VOTING_PERIOD,
                        votingDelay: VOTING_DELAY,
                        proposalThresholdBPS: PROPOSAL_THRESHOLD,
                        lastMinuteWindowInBlocks: LAST_MINUTE_BLOCKS,
                        objectionPeriodDurationInBlocks: OBJECTION_PERIOD_BLOCKS,
                        proposalUpdatablePeriodInBlocks: UPDATABLE_PERIOD_BLOCKS
                    }),
                    NounsDAOStorageV3.DynamicQuorumParams({
                        minQuorumVotesBPS: 200,
                        maxQuorumVotesBPS: 2000,
                        quorumCoefficient: 10000
                    })
                )
            )
        );

        address(new NounsDAOForkEscrow(address(dao)));

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(dao));
        vm.prank(address(dao));
        timelock.acceptAdmin();

        return dao;
    }
}
