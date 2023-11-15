// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { DeployDAOV3LogicMainnet } from '../../../script/DAOV3p1/DeployDAOV3LogicMainnet.s.sol';
import { ProposeDAOV3p1UpgradeMainnet } from '../../../script/DAOV3p1/ProposeDAOV3p1UpgradeMainnet.s.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsDAOShared } from '../helpers/INounsDAOShared.sol';
import { NounsDAOStorageV3 } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract UpgradeToDAOV3p1MainnetForkBaseTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    address public constant WHALE = 0x83fCFe8Ba2FEce9578F0BbaFeD4Ebf5E915045B9;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    INounsDAOShared public constant NOUNS_DAO_PROXY_MAINNET =
        INounsDAOShared(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant CURRENT_DAO_IMPL = 0xdD1492570beb290a2f309541e1fDdcaAA3f00B61;

    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    address origin = makeAddr('origin');
    address newLogic;

    function setUp() public virtual {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 18571818);

        // Get votes
        vm.prank(NOUNDERS);
        nouns.delegate(proposerAddr);
        vm.roll(block.number + 1);

        vm.deal(address(NOUNS_DAO_PROXY_MAINNET), 100 ether);
        vm.fee(50 gwei);
        vm.txGasPrice(50 gwei);
    }

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal returns (uint256 proposalId) {
        vm.prank(proposerAddr);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets, values, signatures, calldatas, 'my proposal');
    }

    function voteAndExecuteProposal(uint256 proposalId) internal {
        NounsDAOStorageV3.ProposalCondensed memory propInfo = NOUNS_DAO_PROXY_MAINNET.proposalsV3(proposalId);

        vm.roll(propInfo.startBlock + 1);
        vm.prank(proposerAddr, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1);
        vm.prank(WHALE, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1);

        vm.roll(propInfo.endBlock + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        propInfo = NOUNS_DAO_PROXY_MAINNET.proposalsV3(proposalId);
        vm.warp(propInfo.eta + 1);
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }
}

contract RefundBeforeTheUpgradeTo3p1MainnetForkTest is UpgradeToDAOV3p1MainnetForkBaseTest {
    function test_refundBeforeUpgrade_doesNotRefundOrigin() public {
        uint256 originBalanceBefore = origin.balance;

        uint256 proposalId = propose(WHALE, 1 ether, '', '');
        voteAndExecuteProposal(proposalId);

        assertEq(originBalanceBefore, origin.balance);
    }
}

contract UpgradeToDAOV3p1MainnetForkTest is UpgradeToDAOV3p1MainnetForkBaseTest {
    function setUp() public override {
        super.setUp();

        // Deploy the latest DAO logic
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        newLogic = address(new DeployDAOV3LogicMainnet().run());

        // Propose the upgrade
        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(newLogic), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/DAOUpgradeTo3p1/proposal-description.txt');
        uint256 proposalId = new ProposeDAOV3p1UpgradeMainnet().run();

        // Execute the upgrade
        voteAndExecuteProposal(proposalId);
    }

    function test_daoUpgradeWorked() public {
        assertTrue(CURRENT_DAO_IMPL != NOUNS_DAO_PROXY_MAINNET.implementation());
        assertEq(newLogic, NOUNS_DAO_PROXY_MAINNET.implementation());
    }

    function test_proposalExecutesAfterTheUpgrade_andRefundGoesToOrigin() public {
        uint256 recipientBalanceBefore = WHALE.balance;
        uint256 originBalanceBefore = origin.balance;

        uint256 proposalId = propose(WHALE, 1 ether, '', '');
        voteAndExecuteProposal(proposalId);

        assertEq(recipientBalanceBefore + 1 ether, WHALE.balance);
        assertGt(origin.balance, originBalanceBefore);
    }
}
