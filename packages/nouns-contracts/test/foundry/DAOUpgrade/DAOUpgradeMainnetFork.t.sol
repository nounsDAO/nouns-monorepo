// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { NounsDAOLogicV4 } from '../../../contracts/governance/NounsDAOLogicV4.sol';
import { ProposeDAOUpgradeMainnet } from '../../../script/DAOUpgrade/ProposeDAOUpgradeMainnet.s.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsDAOData } from '../../../contracts/governance/data/NounsDAOData.sol';

abstract contract DAOUpgradeMainnetForkBaseTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    address public constant WHALE = 0x83fCFe8Ba2FEce9578F0BbaFeD4Ebf5E915045B9;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    INounsDAOLogic public constant NOUNS_DAO_PROXY_MAINNET = INounsDAOLogic(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant CURRENT_DAO_IMPL = 0xe3caa436461DBa00CFBE1749148C9fa7FA1F5344;
    address public constant NOUNS_DAO_DATA_PROXY = 0xf790A5f59678dd733fb3De93493A91f472ca1365;

    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    address origin = makeAddr('origin');
    address newLogic;

    address[] targets;
    uint256[] values;
    string[] signatures;
    bytes[] calldatas;

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

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint32 clientId
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
        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets, values, signatures, calldatas, 'my proposal', clientId);
    }

    function voteAndExecuteProposal(uint256 proposalId) internal {
        NounsDAOTypes.ProposalCondensedV2 memory propInfo = NOUNS_DAO_PROXY_MAINNET.proposals(proposalId);

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
        newLogic = address(new NounsDAOLogicV4());

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
        NounsDAOTypes.ProposalCondensedV3 memory prop = NOUNS_DAO_PROXY_MAINNET.proposalsV3(493);

        assertEq(prop.id, 493);
        assertEq(prop.creationBlock, 19093670);
        assertEq(getProposalDataForRewards(493).creationTimestamp, 0);

        prop = NOUNS_DAO_PROXY_MAINNET.proposalsV3(474);

        assertEq(prop.id, 474);
        assertEq(prop.creationBlock, 18836862);
        assertEq(getProposalDataForRewards(474).creationTimestamp, 0);
    }

    function test_creationTimestampAndBlock_setOnNewProposals() public {
        assertTrue(block.timestamp > 0);
        assertTrue(block.number > 0);
        uint256 proposalId = propose(address(NOUNS_DAO_PROXY_MAINNET), 0, '', '');

        NounsDAOTypes.ProposalCondensedV3 memory prop = NOUNS_DAO_PROXY_MAINNET.proposalsV3(proposalId);

        assertEq(getProposalDataForRewards(proposalId).creationTimestamp, block.timestamp);
        assertEq(prop.creationBlock, block.number);
    }

    function test_adminFunctions_workUsingTheNewFallbackDesign() public {
        uint256 currentForkPeriod = NOUNS_DAO_PROXY_MAINNET.forkPeriod();
        uint256 expectedForkPeriod = currentForkPeriod + 1;

        uint256 proposalId = propose(
            address(NOUNS_DAO_PROXY_MAINNET),
            0,
            '_setForkPeriod(uint256)',
            abi.encode(expectedForkPeriod)
        );
        voteAndExecuteProposal(proposalId);

        assertEq(expectedForkPeriod, NOUNS_DAO_PROXY_MAINNET.forkPeriod());

        uint256 currentVotingDelay = NOUNS_DAO_PROXY_MAINNET.votingDelay();
        uint256 expectedVotingDelay = currentVotingDelay - 1;

        proposalId = propose(
            address(NOUNS_DAO_PROXY_MAINNET),
            0,
            '_setVotingDelay(uint256)',
            abi.encode(expectedVotingDelay)
        );
        voteAndExecuteProposal(proposalId);

        assertEq(expectedVotingDelay, NOUNS_DAO_PROXY_MAINNET.votingDelay());
    }

    function test_clientId_savedOnProposals() public {
        uint32 expectedClientId = 42;
        uint256 proposalId = propose(address(NOUNS_DAO_PROXY_MAINNET), 0, '', '', expectedClientId);

        NounsDAOTypes.ProposalForRewards memory propsData = getProposalDataForRewards(proposalId);
        assertEq(expectedClientId, propsData.clientId);
    }

    function getProposalDataForRewards(uint256 proposalId) internal returns (NounsDAOTypes.ProposalForRewards memory) {
        return NOUNS_DAO_PROXY_MAINNET.proposalDataForRewards(proposalId, proposalId, new uint32[](0))[0];
    }

    function test_clientId_savedOnVotes() public {
        uint256 proposalId = propose(address(NOUNS_DAO_PROXY_MAINNET), 0, '', '');
        NounsDAOTypes.ProposalCondensedV2 memory propInfo = NOUNS_DAO_PROXY_MAINNET.proposals(proposalId);
        vm.roll(propInfo.startBlock + 1);

        uint32 clientId1 = 42;
        uint32 clientId2 = 142;

        vm.prank(proposerAddr, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1, clientId1);
        vm.prank(WHALE, origin);
        NOUNS_DAO_PROXY_MAINNET.castRefundableVote(proposalId, 1, clientId2);

        uint32[] memory clientIds = new uint32[](2);
        clientIds[0] = clientId1;
        clientIds[1] = clientId2;

        NounsDAOTypes.ProposalForRewards[] memory propsData = NOUNS_DAO_PROXY_MAINNET.proposalDataForRewards(
            proposalId,
            proposalId,
            clientIds
        );
        NounsDAOTypes.ClientVoteData[] memory voteData = propsData[0].voteData;

        assertEq(voteData[0].txs, 1);
        assertEq(voteData[0].votes, nouns.getCurrentVotes(proposerAddr));
        assertEq(voteData[1].txs, 1);
        assertEq(voteData[1].votes, nouns.getCurrentVotes(WHALE));
    }

    function test_nounsCandidatesUsingProposalsV3GetterWorks() public {
        NounsDAOData d = NounsDAOData(NOUNS_DAO_DATA_PROXY);
        address[] memory targets = new address[](1);
        targets[0] = address(0);
        uint256[] memory values = new uint256[](1);
        values[0] = 0;
        string[] memory signatures = new string[](1);
        signatures[0] = '';
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = bytes('');
        vm.expectRevert(NounsDAOData.ProposalToUpdateMustBeUpdatable.selector);
        d.createProposalCandidate{ value: 0.1 ether }(targets, values, signatures, calldatas, 'desc', 'slug', 400);
    }
}
