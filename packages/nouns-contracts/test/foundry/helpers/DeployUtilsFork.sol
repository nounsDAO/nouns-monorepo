// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsV3 } from './DeployUtilsV3.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { NounsTokenFork } from '../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from '../../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { INounsDAOForkEscrow } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract DeployUtilsFork is DeployUtilsV3 {
    function _deployForkDAO(INounsDAOForkEscrow escrow)
        public
        returns (
            address treasury,
            address token,
            address dao
        )
    {
        ForkDAODeployer deployer = new ForkDAODeployer(
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

        (treasury, token) = deployer.deployForkDAO(block.timestamp + FORK_PERIOD, escrow);
        dao = NounsDAOExecutorV2(payable(treasury)).admin();
    }

    function _deployForkDAO()
        public
        returns (
            address treasury,
            address token,
            address dao
        )
    {
        NounsDAOLogicV3 originalDAO = _deployDAOV3();
        return _deployForkDAO(originalDAO.forkEscrow());
    }
}
