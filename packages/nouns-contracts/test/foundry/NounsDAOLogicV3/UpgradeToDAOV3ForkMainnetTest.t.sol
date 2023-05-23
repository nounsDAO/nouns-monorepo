// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ProposeDAOV3UpgradeScript } from '../../../script/ProposeDAOV3Upgrade.s.sol';
import { DeployDAOV3NewContractsScript } from '../../../script/DeployDAOV3NewContracts.s.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsDAOProxy } from '../../../contracts/governance/NounsDAOProxy.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { INounsDAOExecutor, INounsDAOForkEscrow, IForkDAODeployer } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { NounsDAOLogicV1Fork } from '../../../contracts/governance/fork/newdao/governance/NounsDAOLogicV1Fork.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { ERC20Transferer } from '../../../contracts/utils/ERC20Transferer.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IHasName {
    function NAME() external pure returns (string memory);
}

interface IOwnable {
    function owner() external view returns (address);
}

contract UpgradeToDAOV3ForkMainnetTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    uint256 proposalId;
    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    NounsDAOLogicV1 public constant NOUNS_DAO_PROXY_MAINNET =
        NounsDAOLogicV1(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    INounsDAOExecutor public constant NOUNS_TIMELOCK_V1_MAINNET =
        INounsDAOExecutor(0x0BC3807Ec262cB779b38D65b38158acC3bfedE10);
    address whaleAddr = 0xf6B6F07862A02C85628B3A9688beae07fEA9C863;
    uint256 public constant INITIAL_ETH_IN_TREASURY = 12919915363316446110962;
    uint256 public constant STETH_BALANCE = 14931432047776533741220;
    address public constant STETH_MAINNET = 0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84;
    address public constant TOKEN_BUYER_MAINNET = 0x4f2aCdc74f6941390d9b1804faBc3E780388cfe5;
    address public constant PAYER_MAINNET = 0xd97Bcd9f47cEe35c0a9ec1dc40C1269afc9E8E1D;

    NounsDAOExecutorV2 timelockV2;
    NounsDAOLogicV3 daoV3;

    function setUp() public {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 17315040);

        assertEq(address(NOUNS_TIMELOCK_V1_MAINNET).balance, INITIAL_ETH_IN_TREASURY);

        // give ourselves voting power
        vm.prank(NOUNDERS);
        nouns.delegate(proposerAddr);

        vm.roll(block.number + 1);

        // deploy contracts

        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        (
            NounsDAOForkEscrow forkEscrow,
            ForkDAODeployer forkDeployer,
            NounsDAOLogicV3 daoV3Impl,
            NounsDAOExecutorV2 timelockV2_,
            ERC20Transferer erc20Transferer_
        ) = new DeployDAOV3NewContractsScript().run();

        timelockV2 = timelockV2_;

        // propose upgrade

        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(address(daoV3Impl)), 20));
        vm.setEnv('TIMELOCK_V2', Strings.toHexString(uint160(address(timelockV2)), 20));
        vm.setEnv('FORK_ESCROW', Strings.toHexString(uint160(address(forkEscrow)), 20));
        vm.setEnv('FORK_DEPLOYER', Strings.toHexString(uint160(address(forkDeployer)), 20));
        vm.setEnv('ERC20_TRANSFERER', Strings.toHexString(uint160(address(erc20Transferer_)), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/NounsDAOLogicV3/proposal-description.txt');

        proposalId = new ProposeDAOV3UpgradeScript().run();

        // simulate vote & proposal execution
        executeUpgradeProposal();

        daoV3 = NounsDAOLogicV3(payable(address(NOUNS_DAO_PROXY_MAINNET)));
    }

    function executeUpgradeProposal() internal {
        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingDelay() + 1);
        vm.prank(proposerAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);
        vm.prank(whaleAddr);
        NOUNS_DAO_PROXY_MAINNET.castVote(proposalId, 1);

        vm.roll(block.number + NOUNS_DAO_PROXY_MAINNET.votingPeriod() + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        vm.warp(block.timestamp + NOUNS_TIMELOCK_V1_MAINNET.delay());
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }

    function test_transfersETHToNewTimelock() public {
        assertEq(address(daoV3.timelockV1()).balance, INITIAL_ETH_IN_TREASURY - 10_000 ether);
        assertEq(address(daoV3.timelock()).balance, 10_000 ether);
    }

    function test_timelockV2adminIsDAO() public {
        assertEq(timelockV2.admin(), address(NOUNS_DAO_PROXY_MAINNET));
    }

    function test_timelockV2delayIsCopiedFromTimelockV1() public {
        assertEq(timelockV2.delay(), NOUNS_TIMELOCK_V1_MAINNET.delay());
    }

    function test_forkEscrowConstructorParamsAreCorrect() public {
        INounsDAOForkEscrow forkEscrow = daoV3.forkEscrow();
        assertEq(address(forkEscrow.dao()), address(NOUNS_DAO_PROXY_MAINNET));
        assertEq(address(forkEscrow.nounsToken()), address(nouns));
    }

    function test_forkDeployerSetsImplementationContracts() public {
        IForkDAODeployer forkDeployer = daoV3.forkDAODeployer();
        assertEq(IHasName(forkDeployer.tokenImpl()).NAME(), 'NounsTokenFork');
        assertEq(IHasName(forkDeployer.auctionImpl()).NAME(), 'NounsAuctionHouseFork');
        assertEq(NounsDAOLogicV1Fork(forkDeployer.governorImpl()).name(), 'Nouns DAO');
        assertEq(IHasName(forkDeployer.treasuryImpl()).NAME(), 'NounsDAOExecutorV2');
    }

    function test_forkParams() public {
        address[] memory erc20TokensToIncludeInFork = daoV3.erc20TokensToIncludeInFork();
        assertEq(erc20TokensToIncludeInFork.length, 1);
        assertEq(erc20TokensToIncludeInFork[0], STETH_MAINNET);

        assertEq(daoV3.forkPeriod(), 7 days);
        assertEq(daoV3.forkThresholdBPS(), 2000);
    }

    function test_setsTimelockAndAdmin() public {
        assertEq(address(daoV3.timelock()), address(timelockV2));
        assertEq(address(daoV3.timelockV1()), address(NOUNS_TIMELOCK_V1_MAINNET));
        assertEq(NounsDAOProxy(payable(address(daoV3))).admin(), address(timelockV2));
    }

    function test_DAOV3Params() public {
        assertEq(daoV3.lastMinuteWindowInBlocks(), 0);
        assertEq(daoV3.objectionPeriodDurationInBlocks(), 0);
        assertEq(daoV3.proposalUpdatablePeriodInBlocks(), 0);
        // TODO: voteSnapshotBlockSwitchProposalId
    }

    function test_TokenBuyer_changedOwner() public {
        assertEq(IOwnable(TOKEN_BUYER_MAINNET).owner(), address(timelockV2));
    }

    function test_Payer_changedOwner() public {
        assertEq(IOwnable(PAYER_MAINNET).owner(), address(timelockV2));
    }

    function test_transfersAllstETH() public {
        assertEq(IERC20(STETH_MAINNET).balanceOf(address(NOUNS_TIMELOCK_V1_MAINNET)), 1);
        assertEq(IERC20(STETH_MAINNET).balanceOf(address(timelockV2)), STETH_BALANCE - 1);
    }
}
