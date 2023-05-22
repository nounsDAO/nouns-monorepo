// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Script.sol';
import { NounsDAOExecutorV2 } from '../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1 } from '../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOExecutorProxy } from '../contracts/governance/NounsDAOExecutorProxy.sol';
import { INounsDAOExecutor } from '../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { NounsTokenFork } from '../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from '../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsDAOLogicV1Fork } from '../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { ForkDAODeployer } from '../contracts/governance/fork/ForkDAODeployer.sol';

contract DeployDAOV3NewContractsScript is Script {
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant NOUNS_TIMELOCK_V1_MAINNET = 0x0BC3807Ec262cB779b38D65b38158acC3bfedE10;
    uint256 public constant DELAYED_GOV_DURATION = 30 days;

    function run()
        public
        returns (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2
        )
    {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');

        vm.startBroadcast(deployerKey);

        (forkEscrow, forkDeployer, daoV3Impl, timelockV2) = deployNewContracts(
            NOUNS_DAO_PROXY_MAINNET,
            INounsDAOExecutor(NOUNS_TIMELOCK_V1_MAINNET)
        );

        vm.stopBroadcast();
    }

    function deployNewContracts(NounsDAOLogicV1 daoProxy, INounsDAOExecutor timelockV1)
        internal
        returns (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2
        )
    {
        forkEscrow = new NounsDAOForkEscrow(address(daoProxy), address(daoProxy.nouns()));
        forkDeployer = new ForkDAODeployer(
            address(new NounsTokenFork()),
            address(new NounsAuctionHouseFork()),
            address(new NounsDAOLogicV1Fork()),
            address(new NounsDAOExecutorV2()),
            DELAYED_GOV_DURATION
        );
        daoV3Impl = new NounsDAOLogicV3();
        (timelockV2, ) = deployAndInitTimelockV2(daoProxy, timelockV1);
    }

    function deployAndInitTimelockV2(NounsDAOLogicV1 daoProxy, INounsDAOExecutor timelockV1)
        internal
        returns (NounsDAOExecutorV2 timelockV2, address timelockV2Impl)
    {
        timelockV2Impl = address(new NounsDAOExecutorV2());

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256)',
            address(daoProxy),
            timelockV1.delay()
        );

        timelockV2 = NounsDAOExecutorV2(payable(address(new NounsDAOExecutorProxy(timelockV2Impl, initCallData))));

        return (timelockV2, timelockV2Impl);
    }
}
