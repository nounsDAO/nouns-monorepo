// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtils } from './DeployUtils.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxyV3 } from '../../../contracts/governance/NounsDAOProxyV3.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { ERC1967Proxy } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';
import { NounsAuctionHouseProxy } from '../../../contracts/proxies/NounsAuctionHouseProxy.sol';
import { NounsAuctionHouseProxyAdmin } from '../../../contracts/proxies/NounsAuctionHouseProxyAdmin.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsSeeder } from '../../../contracts/NounsSeeder.sol';
import { ProxyRegistryMock } from './ProxyRegistryMock.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { NounsTokenFork } from '../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from '../../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract DeployUtilsV3 is DeployUtils {
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
                        lastMinuteWindowInBlocks: LAST_MINUTE_BLOCKS,
                        objectionPeriodDurationInBlocks: OBJECTION_PERIOD_BLOCKS,
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
        address(new NounsDAOForkEscrow(address(dao), address(nounsToken)));
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
            DELAYED_GOV_DURATION,
            FORK_DAO_VOTING_PERIOD,
            FORK_DAO_VOTING_DELAY,
            FORK_DAO_PROPOSAL_THRESHOLD_BPS,
            FORK_DAO_QUORUM_VOTES_BPS
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

        address(new NounsDAOForkEscrow(address(dao), address(nounsToken)));

        vm.prank(address(timelock));
        NounsAuctionHouse(address(auctionProxy)).initialize(nounsToken, makeAddr('weth'), 2, 0, 1, 10 minutes);

        vm.prank(address(timelock));
        timelock.setPendingAdmin(address(dao));
        vm.prank(address(dao));
        timelock.acceptAdmin();

        vm.startPrank(address(timelock));
        dao._setForkPeriod(FORK_PERIOD);
        dao._setForkThresholdBPS(FORK_THRESHOLD_BPS);
        vm.stopPrank();

        return dao;
    }
}
