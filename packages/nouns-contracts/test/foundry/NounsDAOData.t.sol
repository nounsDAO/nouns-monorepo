// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOData } from '../../contracts/governance/data/NounsDAOData.sol';
import { NounsDAODataProxy } from '../../contracts/governance/data/NounsDAODataProxy.sol';
import { NounsDAODataProxyAdmin } from '../../contracts/governance/data/NounsDAODataProxyAdmin.sol';
import { NounsTokenLikeMock } from './helpers/NounsTokenLikeMock.sol';
import { NounsDAOV3Proposals } from '../../contracts/governance/NounsDAOV3Proposals.sol';

contract NounsDAODataTest is Test {
    event ProposalCandidateCreated(
        address indexed msgSender,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string slug,
        bytes32 encodedProposalHash
    );
    event ProposalCandidateUpdated(
        address indexed msgSender,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        string description,
        string slug,
        bytes32 encodedProposalHash
    );
    event ProposalCandidateCanceled(address indexed msgSender, string slug);
    event SignatureAdded(
        address indexed msgSender,
        address indexed signer,
        bytes sig,
        uint256 expirationTimestamp,
        bytes32 encodedPropHash,
        string reason
    );
    event FeedbackSent(address indexed msgSender, uint256 proposalId, uint8 support, string reason);
    event CreateCandidateCostSet(uint256 oldCreateCandidateCost, uint256 newCreateCandidateCost);
    event UpdateCandidateCostSet(uint256 oldUpdateCandidateCost, uint256 newUpdateCandidateCost);

    NounsTokenLikeMock tokenLikeMock;
    NounsDAODataProxyAdmin proxyAdmin;
    NounsDAODataProxy proxy;
    NounsDAOData data;
    address dataAdmin = makeAddr('data admin');

    function setUp() public {
        tokenLikeMock = new NounsTokenLikeMock();
        NounsDAOData logic = new NounsDAOData();
        proxyAdmin = new NounsDAODataProxyAdmin();

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256,uint256,address)',
            address(dataAdmin),
            0.01 ether,
            0.01 ether,
            address(tokenLikeMock)
        );

        proxy = new NounsDAODataProxy(address(logic), address(proxyAdmin), initCallData);

        data = NounsDAOData(address(proxy));

        vm.roll(block.number + 1);
    }

    function test_createProposalCandidate_revertsForNonNounerAndNoPayment() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNounerOrPaySufficientFee.selector));
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, 'description', 'slug');
    }

    function test_createProposalCandidate_worksForNouner() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCreated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
    }

    function test_createProposalCandidate_worksForNonNounerWithEnoughPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCreated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug
        );
    }

    function test_createProposalCandidate_worksForNonNounerWhenPaymentConfigIsZero() public {
        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0);

        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCreated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
    }

    function test_createProposalCandidate_revertsOnSlugReuseBySameProposer() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugAlreadyUsed.selector));
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
    }

    function test_createProposalCandidate_worksWithSameSlugButDifferentProposers() public {
        address otherProposer = makeAddr('other proposer');
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        tokenLikeMock.setPriorVotes(otherProposer, block.number - 1, 1);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);

        vm.prank(otherProposer);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
    }

    function test_updateProposalCandidate_revertsForNonNounerAndNoPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNounerOrPaySufficientFee.selector));
        data.updateProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
    }

    function test_updateProposalCandidate_revertsOnUnseenSlug() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        uint256 value = data.updateCandidateCost();
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugDoesNotExist.selector));
        data.updateProposalCandidate{ value: value }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'description',
            'slug'
        );
    }

    function test_updateProposalCandidate_worksForNouner() public {
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug);
        string memory updateDescription = 'new description';

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateUpdated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription))
        );

        data.updateProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, updateDescription, slug);
    }

    function test_updateProposalCandidate_worksForNonNounerWithEnoughPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug
        );
        string memory updateDescription = 'new description';

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateUpdated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription))
        );

        data.updateProposalCandidate{ value: data.updateCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug
        );
    }

    function test_updateProposalCandidate_worksForNonNounerWhenPaymentConfigIsZero() public {
        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug
        );
        string memory updateDescription = 'new description';

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateUpdated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription))
        );

        data.updateProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, updateDescription, slug);
    }

    function test_cancelProposalCandidate_revertsOnUnseenSlug() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugDoesNotExist.selector));
        data.cancelProposalCandidate('slug');
    }

    function test_cancelProposalCandidate_emitsACancelEvent() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'description',
            'slug'
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCanceled(address(this), 'slug');

        data.cancelProposalCandidate('slug');
    }

    function test_addSignature_emitsEvent() public {
        address signer = makeAddr('signer');
        bytes memory sig = new bytes(0);
        uint256 expiration = 1234;
        bytes32 encodedPropHash = keccak256('prop content');
        string memory reason = 'reason';

        vm.expectEmit(true, true, true, true);
        emit SignatureAdded(address(this), signer, sig, expiration, encodedPropHash, reason);

        data.addSignature(signer, sig, expiration, encodedPropHash, reason);
    }

    function test_sendFeedback_revertsForNonNouner() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNouner.selector));
        data.sendFeedback(1, 1, 'reason');
    }

    function test_sendFeedback_emitsEventForNouner() public {
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);

        vm.expectEmit(true, true, true, true);
        emit FeedbackSent(address(this), 1, 1, 'some reason');

        data.sendFeedback(1, 1, 'some reason');
    }

    function test_setCreateCandidateCost_revertsForNonAdmin() public {
        vm.expectRevert('Ownable: caller is not the owner');
        data.setCreateCandidateCost(0.42 ether);
    }

    function test_setCreateCandidateCost_worksForAdmin() public {
        vm.expectEmit(true, true, true, true);
        emit CreateCandidateCostSet(0.01 ether, 0.42 ether);

        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0.42 ether);

        assertEq(data.createCandidateCost(), 0.42 ether);
    }

    function test_setUpdateCandidateCost_revertsForNonAdmin() public {
        vm.expectRevert('Ownable: caller is not the owner');
        data.setUpdateCandidateCost(0.42 ether);
    }

    function test_setUpdateCandidateCost_worksForAdmin() public {
        vm.expectEmit(true, true, true, true);
        emit UpdateCandidateCostSet(0.01 ether, 0.42 ether);

        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0.42 ether);

        assertEq(data.updateCandidateCost(), 0.42 ether);
    }

    function createTxs(
        address target,
        uint256 value,
        string memory signature,
        bytes memory callData
    ) internal pure returns (NounsDAOV3Proposals.ProposalTxs memory) {
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = callData;

        return NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas);
    }
}
