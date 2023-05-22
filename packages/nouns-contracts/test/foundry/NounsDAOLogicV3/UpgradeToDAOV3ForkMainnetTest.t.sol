// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { ProposeDAOV3UpgradeScript } from '../../../script/ProposeDAOV3Upgrade.s.sol';
import { DeployDAOV3NewContractsScript } from '../../../script/DeployDAOV3NewContracts.s.sol';
import { NounsDAOLogicV1 } from '../../../contracts/governance/NounsDAOLogicV1.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { NounsDAOExecutorV2 } from '../../../contracts/governance/NounsDAOExecutorV2.sol';
import { INounsDAOExecutor } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOForkEscrow } from '../../../contracts/governance/fork/NounsDAOForkEscrow.sol';
import { ForkDAODeployer } from '../../../contracts/governance/fork/ForkDAODeployer.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';

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
            NounsDAOExecutorV2 timelockV2
        ) = new DeployDAOV3NewContractsScript().run();

        // propose upgrade

        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(address(daoV3Impl)), 20));
        vm.setEnv('TIMELOCK_V2', Strings.toHexString(uint160(address(timelockV2)), 20));
        vm.setEnv('FORK_ESCROW', Strings.toHexString(uint160(address(forkEscrow)), 20));
        vm.setEnv('FORK_DEPLOYER', Strings.toHexString(uint160(address(forkDeployer)), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/NounsDAOLogicV3/proposal-description.txt');

        proposalId = new ProposeDAOV3UpgradeScript().run();
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

    function test_proposalIsExecutable() public {
        executeUpgradeProposal();
    }

    function test_transfersETHToNewTimelock() public {
        executeUpgradeProposal();

        NounsDAOLogicV3 daoV3 = NounsDAOLogicV3(payable(address(NOUNS_DAO_PROXY_MAINNET)));
        assertEq(address(daoV3.timelockV1()).balance, INITIAL_ETH_IN_TREASURY - 10_000 ether);
        assertEq(address(daoV3.timelock()).balance, 10_000 ether);
    }
}
