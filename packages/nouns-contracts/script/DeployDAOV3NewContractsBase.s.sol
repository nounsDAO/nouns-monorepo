// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOExecutorV2 } from '../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOExecutorV2Test } from '../contracts/test/NounsDAOExecutorHarness.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOExecutorProxy } from '../contracts/governance/NounsDAOExecutorProxy.sol';
import { INounsDAOExecutor } from '../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { NounsTokenFork } from '../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from '../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsDAOLogicV1Fork } from '../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';
import { ERC20Transferer } from '../contracts/utils/ERC20Transferer.sol';

contract DeployDAOV3NewContractsBase is Script {
    uint256 public constant DELAYED_GOV_DURATION = 30 days;
    uint256 public immutable forkDAOVotingPeriod;
    uint256 public immutable forkDAOVotingDelay;
    uint256 public constant FORK_DAO_PROPOSAL_THRESHOLD_BPS = 25; // 0.25%
    uint256 public constant FORK_DAO_QUORUM_VOTES_BPS = 1000; // 10%

    NounsDAOLogicV1 public immutable daoProxy;
    INounsDAOExecutor public immutable timelockV1;
    bool public immutable deployTimelockV2Harness; // should be true only for testnets

    constructor(
        address _daoProxy,
        address _timelockV1,
        bool _deployTimelockV2Harness,
        uint256 _forkDAOVotingPeriod,
        uint256 _forkDAOVotingDelay
    ) {
        daoProxy = NounsDAOLogicV1(payable(_daoProxy));
        timelockV1 = INounsDAOExecutor(_timelockV1);
        deployTimelockV2Harness = _deployTimelockV2Harness;
        forkDAOVotingPeriod = _forkDAOVotingPeriod;
        forkDAOVotingDelay = _forkDAOVotingDelay;
    }

    function run()
        public
        returns (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2,
            ERC20Transferer erc20Transferer
        )
    {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        (forkEscrow, forkDeployer, daoV3Impl, timelockV2, erc20Transferer) = deployNewContracts();

        vm.stopBroadcast();
    }

    function deployNewContracts()
        internal
        returns (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2,
            ERC20Transferer erc20Transferer
        )
    {
        NounsDAOExecutorV2 timelockV2Impl;
        if (deployTimelockV2Harness) {
            timelockV2Impl = new NounsDAOExecutorV2Test();
        } else {
            timelockV2Impl = new NounsDAOExecutorV2();
        }

        forkEscrow = new NounsDAOForkEscrow(address(daoProxy), address(daoProxy.nouns()));
        forkDeployer = new ForkDAODeployer(
            address(new NounsTokenFork()),
            address(new NounsAuctionHouseFork()),
            address(new NounsDAOLogicV1Fork()),
            address(timelockV2Impl),
            DELAYED_GOV_DURATION,
            forkDAOVotingPeriod,
            forkDAOVotingDelay,
            FORK_DAO_PROPOSAL_THRESHOLD_BPS,
            FORK_DAO_QUORUM_VOTES_BPS
        );
        daoV3Impl = new NounsDAOLogicV3();
        timelockV2 = deployAndInitTimelockV2(address(timelockV2Impl));
        erc20Transferer = new ERC20Transferer();
    }

    function deployAndInitTimelockV2(address timelockV2Impl) internal returns (NounsDAOExecutorV2 timelockV2) {
        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256)',
            address(daoProxy),
            timelockV1.delay()
        );

        timelockV2 = NounsDAOExecutorV2(payable(address(new NounsDAOExecutorProxy(timelockV2Impl, initCallData))));

        return timelockV2;
    }
}
