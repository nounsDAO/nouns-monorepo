// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { NounsDAOLogicV3 } from '../../../contracts/governance/NounsDAOLogicV3.sol';
import { ProposeDAOUpgradeMainnet } from '../../../script/DAOUpgrade/ProposeDAOUpgradeMainnet.s.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsDAOLogicV3 } from '../../../contracts/interfaces/INounsDAOLogicV3.sol';
import { NounsDAOV3Types } from '../../../contracts/governance/NounsDAOInterfaces.sol';

abstract contract DAOUpgradeMainnetForkBaseTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    address public constant WHALE = 0x83fCFe8Ba2FEce9578F0BbaFeD4Ebf5E915045B9;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    INounsDAOLogicV3 public constant NOUNS_DAO_PROXY_MAINNET =
        INounsDAOLogicV3(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant CURRENT_DAO_IMPL = 0xe3caa436461DBa00CFBE1749148C9fa7FA1F5344;

    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    address origin = makeAddr('origin');
    address newLogic;

    function setUp() public virtual {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 19127187);

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
        NounsDAOV3Types.ProposalCondensedV2 memory propInfo = NOUNS_DAO_PROXY_MAINNET.proposals(proposalId);

        vm.roll(propInfo.startBlock + 1);
        vm.prank(proposerAddr, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1);
        vm.prank(WHALE, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1);

        vm.roll(propInfo.endBlock + 1);
        NOUNS_DAO_PROXY_MAINNET.queue(proposalId);

        propInfo = NOUNS_DAO_PROXY_MAINNET.proposals(proposalId);
        vm.warp(propInfo.eta + 1);
        NOUNS_DAO_PROXY_MAINNET.execute(proposalId);
    }
}

contract DAOUpgradeMainnetForkTest is DAOUpgradeMainnetForkBaseTest {
    function setUp() public override {
        super.setUp();

        // Deploy the latest DAO logic
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        newLogic = address(new NounsDAOLogicV3());

        // Propose the upgrade
        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(newLogic), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/DAOUpgrade/proposal-description.txt');
        uint256 proposalId = new ProposeDAOUpgradeMainnet().run();

        // Execute the upgrade
        voteAndExecuteProposal(proposalId);
    }

    function test_daoUpgradeWorked() public {
        assertTrue(CURRENT_DAO_IMPL != NOUNS_DAO_PROXY_MAINNET.implementation());
        assertEq(newLogic, NOUNS_DAO_PROXY_MAINNET.implementation());
    }

    function test_givenRecentBitPacking_creationBlockAndProposalIdValuesAreLegit() public {
        NounsDAOV3Types.ProposalCondensed memory prop = NOUNS_DAO_PROXY_MAINNET.proposalsV3(493);

        assertEq(prop.id, 493);
        assertEq(prop.creationBlock, 19093670);
        assertEq(prop.creationTimestamp, 0);

        prop = NOUNS_DAO_PROXY_MAINNET.proposalsV3(474);

        assertEq(prop.id, 474);
        assertEq(prop.creationBlock, 18836862);
        assertEq(prop.creationTimestamp, 0);
    }
}
