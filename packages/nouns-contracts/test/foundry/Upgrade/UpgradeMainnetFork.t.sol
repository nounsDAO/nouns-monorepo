// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { DeployDataContractsMainnet } from '../../../script/Data/DeployDataContractsMainnet.s.sol';
import { NounsDAOData } from '../../../contracts/governance/data/NounsDAOData.sol';

abstract contract UpgradeMainnetForkBaseTest is Test {
    address public constant NOUNDERS = 0x2573C60a6D127755aA2DC85e342F7da2378a0Cc5;
    address public constant WHALE = 0x83fCFe8Ba2FEce9578F0BbaFeD4Ebf5E915045B9;
    NounsToken public nouns = NounsToken(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);
    INounsDAOLogic public constant NOUNS_DAO_PROXY_MAINNET = INounsDAOLogic(0x6f3E6272A167e8AcCb32072d08E0957F9c79223d);
    address public constant CURRENT_DAO_IMPL = 0xe3caa436461DBa00CFBE1749148C9fa7FA1F5344;
    address public constant NOUNS_DAO_DATA_PROXY = 0xf790A5f59678dd733fb3De93493A91f472ca1365;
    address public constant AUCTION_HOUSE_PROXY_MAINNET = 0x830BD73E4184ceF73443C15111a1DF14e495C706;
    address public constant AUCTION_HOUSE_PROXY_ADMIN_MAINNET = 0xC1C119932d78aB9080862C5fcb964029f086401e;

    address proposerAddr = vm.addr(0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb);
    address origin = makeAddr('origin');
    address newLogic;

    address[] targets;
    uint256[] values;
    string[] signatures;
    bytes[] calldatas;

    function setUp() public virtual {
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 21473045);

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
        address[] memory targets_ = new address[](1);
        targets_[0] = target;
        uint256[] memory values_ = new uint256[](1);
        values_[0] = value;
        string[] memory signatures_ = new string[](1);
        signatures_[0] = signature;
        bytes[] memory calldatas_ = new bytes[](1);
        calldatas_[0] = data;
        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(targets_, values_, signatures_, calldatas_, 'my proposal');
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

contract DataContractUpgradeMainnetForkTest is UpgradeMainnetForkBaseTest {
    event VoterMessageToDunaAdminPosted(string message, uint256[] relatedProposals);
    event DunaAdminMessagePosted(string message, uint256[] relatedProposals);
    event ProposalComplianceSignaled(uint256 indexed proposalId, uint8 signal, string reason);

    address public constant DATA_PROXY_ADDRESS = 0xf790A5f59678dd733fb3De93493A91f472ca1365;
    NounsDAOData public constant dataProxy = NounsDAOData(DATA_PROXY_ADDRESS);

    address public dunaAdmin = makeAddr('DUNA admin');

    address public originalFeeRecipient;
    uint256 public originalCreateCandidateCost;

    uint256[] public relatedProposals;

    function setUp() public override {
        super.setUp();

        relatedProposals.push(142);

        originalFeeRecipient = dataProxy.feeRecipient();
        originalCreateCandidateCost = dataProxy.createCandidateCost();

        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

        DeployDataContractsMainnet logicDeployScript = new DeployDataContractsMainnet();
        NounsDAOData newDataLogic = logicDeployScript.run();

        // Propose upgrade
        uint256 txCount = 2;
        address[] memory targets = new address[](txCount);
        uint256[] memory values = new uint256[](txCount);
        string[] memory signatures = new string[](txCount);
        bytes[] memory calldatas = new bytes[](txCount);

        // dataProxy.upgradeTo(address(newLogic));
        targets[0] = DATA_PROXY_ADDRESS;
        signatures[0] = 'upgradeTo(address)';
        calldatas[0] = abi.encode(address(newDataLogic));

        // dataProxy.setDunaAdmin(dunaAdmin);
        targets[1] = DATA_PROXY_ADDRESS;
        signatures[1] = 'setDunaAdmin(address)';
        calldatas[1] = abi.encode(dunaAdmin);
        vm.prank(proposerAddr);
        uint256 proposalId = NOUNS_DAO_PROXY_MAINNET.propose(
            targets,
            values,
            signatures,
            calldatas,
            'Upgrading Data to support DUNA admin comms'
        );
        voteAndExecuteProposal(proposalId);
    }

    function test_stateSurvivedUpgrade_andDunaAdminSet() public {
        assertEq(dataProxy.feeRecipient(), originalFeeRecipient);
        assertEq(dataProxy.createCandidateCost(), originalCreateCandidateCost);
        assertEq(dataProxy.dunaAdmin(), dunaAdmin);
    }

    function test_postVoterMessageToDunaAdmin_works() public {
        vm.expectEmit(true, true, true, true);
        emit VoterMessageToDunaAdminPosted('some message', relatedProposals);

        vm.prank(proposerAddr);
        dataProxy.postVoterMessageToDunaAdmin('some message', relatedProposals);
    }

    function test_postDunaAdminMessage_works() public {
        vm.expectEmit(true, true, true, true);
        emit DunaAdminMessagePosted('some admin message', relatedProposals);

        vm.prank(dunaAdmin);
        dataProxy.postDunaAdminMessage('some admin message', relatedProposals);
    }

    function test_signalProposalCompliance_works() public {
        vm.expectEmit(true, true, true, true);
        emit ProposalComplianceSignaled(142, 1, 'some admin reason');

        vm.prank(dunaAdmin);
        dataProxy.signalProposalCompliance(142, 1, 'some admin reason');
    }
}
