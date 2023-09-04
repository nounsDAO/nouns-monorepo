// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';

import { DeployUtilsFork } from '../../helpers/DeployUtilsFork.sol';
import { NounsTokenFork } from '../../../../contracts/governance/fork/newdao/token/NounsTokenFork.sol';
import { NounsDAOExecutorV2 } from '../../../../contracts/governance/NounsDAOExecutorV2.sol';
import { NounsDAOLogicV1Fork } from '../../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsAuctionHouseFork } from '../../../../contracts/governance/fork/newdao/NounsAuctionHouseFork.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol';

contract ForkDAODeployerTest is DeployUtilsFork {
    NounsDAOLogicV1Fork dao;
    NounsDAOExecutorV2 treasury;
    NounsTokenFork token;
    NounsAuctionHouseFork auction;

    function setUp() public {
        (address treasuryAddress, address tokenAddress, address daoAddress) = _deployForkDAO();

        token = NounsTokenFork(tokenAddress);
        auction = NounsAuctionHouseFork(token.minter());
        dao = NounsDAOLogicV1Fork(daoAddress);
        treasury = NounsDAOExecutorV2(payable(treasuryAddress));
    }

    function test_token_nonTreasuryCannotUpgrade() public {
        NounsTokenFork newLogic = new NounsTokenFork();

        vm.expectRevert('Ownable: caller is not the owner');
        token.upgradeTo(address(newLogic));
    }

    function test_token_treasuryCanUpgrade() public {
        NounsTokenFork newLogic = new NounsTokenFork();

        vm.prank(address(treasury));
        token.upgradeTo(address(newLogic));

        assertEq(get1967Implementation(address(token)), address(newLogic));
    }

    function test_auction_nonTreasuryCannotUpgrade() public {
        NounsAuctionHouseFork newLogic = new NounsAuctionHouseFork();

        vm.expectRevert('Ownable: caller is not the owner');
        auction.upgradeTo(address(newLogic));
    }

    function test_auction_treasuryCanUpgrade() public {
        NounsAuctionHouseFork newLogic = new NounsAuctionHouseFork();

        vm.prank(address(treasury));
        auction.upgradeTo(address(newLogic));

        assertEq(get1967Implementation(address(auction)), address(newLogic));
    }

    function test_dao_nonTreasuryCannotUpgrade() public {
        NounsDAOLogicV1Fork newLogic = new NounsDAOLogicV1Fork();

        vm.expectRevert('NounsDAO::_authorizeUpgrade: admin only');
        dao.upgradeTo(address(newLogic));
    }

    function test_dao_treasuryCanUpgrade() public {
        NounsDAOLogicV1Fork newLogic = new NounsDAOLogicV1Fork();

        vm.prank(address(treasury));
        dao.upgradeTo(address(newLogic));

        assertEq(get1967Implementation(address(dao)), address(newLogic));
    }

    function test_treasury_nonTreasuryCannotUpgrade() public {
        NounsDAOExecutorV2 newLogic = new NounsDAOExecutorV2();

        vm.expectRevert('NounsDAOExecutor::_authorizeUpgrade: Call must come from NounsDAOExecutor.');
        treasury.upgradeTo(address(newLogic));
    }

    function test_treasury_treasuryCanUpgrade() public {
        NounsDAOExecutorV2 newLogic = new NounsDAOExecutorV2();

        vm.prank(address(treasury));
        treasury.upgradeTo(address(newLogic));

        assertEq(get1967Implementation(address(treasury)), address(newLogic));
    }

    function test_govContractParams() public {
        assertEq(dao.votingPeriod(), FORK_DAO_VOTING_PERIOD);
        assertEq(dao.votingDelay(), FORK_DAO_VOTING_DELAY);
        assertEq(dao.proposalThresholdBPS(), FORK_DAO_PROPOSAL_THRESHOLD_BPS);
        assertEq(dao.quorumVotesBPS(), FORK_DAO_QUORUM_VOTES_BPS);
    }
}
