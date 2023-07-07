// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

import 'forge-std/Test.sol';
import { NounsDAOData } from '../../contracts/governance/data/NounsDAOData.sol';
import { NounsDAODataEvents } from '../../contracts/governance/data/NounsDAODataEvents.sol';
import { NounsDAODataProxy } from '../../contracts/governance/data/NounsDAODataProxy.sol';
import { NounsTokenLikeMock } from './helpers/NounsTokenLikeMock.sol';
import { NounsDAOV3Proposals } from '../../contracts/governance/NounsDAOV3Proposals.sol';
import { SigUtils } from './helpers/SigUtils.sol';

contract NounsDAODataTest is Test, SigUtils, NounsDAODataEvents {
    NounsTokenLikeMock tokenLikeMock;
    NounsDAODataProxy proxy;
    NounsDAOData data;
    address dataAdmin = makeAddr('data admin');
    address nounsDao = makeAddr('nouns dao');
    address feeRecipient = makeAddr('fee recipient');

    function setUp() public {
        tokenLikeMock = new NounsTokenLikeMock();
        NounsDAOData logic = new NounsDAOData(address(tokenLikeMock), nounsDao);

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256,uint256,address)',
            address(dataAdmin),
            0.01 ether,
            0.01 ether,
            feeRecipient
        );

        proxy = new NounsDAODataProxy(address(logic), initCallData);

        data = NounsDAOData(address(proxy));

        vm.roll(block.number + 1);
    }

    function test_createProposalCandidate_revertsForNonNounerAndNoPayment() public {
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNounerOrPaySufficientFee.selector));
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, 'description', 'slug', 0);
    }

    function test_encodedPropDigest() public {
        // Used to compare values with the subgraph code generating the same thing
        // see calcEncodedProposalHash in helpers.ts
        string memory description = 'some description';
        address target = address(0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa);
        address proposer = address(0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB);
        uint256 value = 300;
        string memory signature = 'some signature';
        bytes memory callData = 'some data';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(target, value, signature, callData);

        bytes memory encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(proposer, txs, description);
        bytes32 digest = keccak256(encodedProp);

        assertEq(digest, 0xcf95b7d08d761ff0bf1223220f45b79baffbce6c8bcceb8df5399cbc6d22c40d);

        address[] memory targets = new address[](2);
        targets[0] = target;
        targets[1] = 0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC;
        uint256[] memory values = new uint256[](2);
        values[0] = value;
        values[1] = 500;
        string[] memory signatures = new string[](2);
        signatures[0] = signature;
        signatures[1] = 'hello()';
        bytes[] memory calldatas = new bytes[](2);
        calldatas[0] = callData;
        calldatas[1] = hex'aabbccdd';

        txs = NounsDAOV3Proposals.ProposalTxs(targets, values, signatures, calldatas);
        encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(proposer, txs, description);
        digest = keccak256(encodedProp);

        assertEq(digest, 0x5d6f3b870407fff8109c6c9469173eef879d0d2eaf3de0fb5770b7f48f760101);

        uint256 proposalIdToUpdate = 1;
        encodedProp = abi.encodePacked(proposalIdToUpdate, encodedProp);
        digest = keccak256(encodedProp);

        assertEq(digest, 0xdc10157349778884412d140419c22ab67aa7a84a4f23dead50533a9aca0fbb28);
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
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_worksForNonNounerWithEnoughPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        uint256 recipientBalanceBefore = feeRecipient.balance;

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCreated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0
        );

        assertEq(feeRecipient.balance - recipientBalanceBefore, data.createCandidateCost());
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
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_revertsOnSlugReuseBySameProposer() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugAlreadyUsed.selector));
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_worksWithSameSlugButDifferentProposers() public {
        address otherProposer = makeAddr('other proposer');
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        tokenLikeMock.setPriorVotes(otherProposer, block.number - 1, 1);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);

        vm.prank(otherProposer);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
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
            slug,
            0
        );

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNounerOrPaySufficientFee.selector));
        data.updateProposalCandidate(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0,
            'reason'
        );
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
            'slug',
            0,
            'reason'
        );
    }

    function test_updateProposalCandidate_worksForNouner() public {
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
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
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription)),
            'reason'
        );

        data.updateProposalCandidate(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            0,
            'reason'
        );
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
            slug,
            0
        );
        string memory updateDescription = 'new description';
        uint256 recipientBalanceBefore = feeRecipient.balance;

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateUpdated(
            address(this),
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription)),
            'reason'
        );

        data.updateProposalCandidate{ value: data.updateCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            0,
            'reason'
        );

        assertEq(feeRecipient.balance - recipientBalanceBefore, data.updateCandidateCost());
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
            slug,
            0
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
            0,
            keccak256(NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, updateDescription)),
            'reason'
        );

        data.updateProposalCandidate(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            updateDescription,
            slug,
            0,
            'reason'
        );
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
            'slug',
            0
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCanceled(address(this), 'slug');

        data.cancelProposalCandidate('slug');
    }

    function test_addSignature_revertsOnUnseenSlug() public {
        address signer = makeAddr('signer');
        bytes memory sig = new bytes(0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugDoesNotExist.selector));
        vm.prank(signer);
        data.addSignature(sig, 1234, address(this), 'slug', 0, 'encoded proposal', 'reason');
    }

    function test_addSignature_revertsWhenSenderIsntSigner() public {
        string memory description = 'some description';
        string memory slug = 'slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0
        );

        (, uint256 signerKey) = makeAddrAndKey('signer');
        address proposer = address(this);
        uint256 expiration = 1234;
        address verifyingContract = address(data);
        string memory reason = 'reason';
        bytes memory sig = signProposal(
            proposer,
            signerKey,
            txs,
            description,
            expiration,
            verifyingContract,
            'Nouns DAO'
        );
        bytes memory encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.InvalidSignature.selector));
        vm.prank(makeAddr('not signer'));
        data.addSignature(sig, expiration, proposer, slug, 0, encodedProp, reason);
    }

    function test_addSignature_emitsEvent() public {
        string memory description = 'some description';
        string memory slug = 'slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0
        );

        (address signer, uint256 signerKey) = makeAddrAndKey('signer');
        address proposer = address(this);
        uint256 expiration = 1234;
        address verifyingContract = nounsDao;
        string memory reason = 'reason';
        bytes memory sig = signProposal(
            proposer,
            signerKey,
            txs,
            description,
            expiration,
            verifyingContract,
            'Nouns DAO'
        );
        bytes memory encodedProp = NounsDAOV3Proposals.calcProposalEncodeData(address(this), txs, description);
        bytes32 sigDigest = NounsDAOV3Proposals.sigDigest(
            NounsDAOV3Proposals.PROPOSAL_TYPEHASH,
            encodedProp,
            expiration,
            verifyingContract
        );

        vm.expectEmit(true, true, true, true);
        emit SignatureAdded(signer, sig, expiration, proposer, slug, 0, keccak256(encodedProp), sigDigest, reason);

        vm.prank(signer);
        data.addSignature(sig, expiration, proposer, slug, 0, encodedProp, reason);
    }

    function test_sendFeedback_revertsWithBadSupportValue() public {
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 1);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.InvalidSupportValue.selector));
        data.sendFeedback(1, 3, 'some reason');
    }

    function test_sendFeedback_emitsEventForNouner() public {
        tokenLikeMock.setPriorVotes(address(this), block.number - 1, 3);

        vm.expectEmit(true, true, true, true);
        emit FeedbackSent(address(this), 1, 1, 'some reason');

        data.sendFeedback(1, 1, 'some reason');
    }

    function test_sendFeedback_emitsEventForNonNouner() public {
        vm.expectEmit(true, true, true, true);
        emit FeedbackSent(address(this), 1, 1, 'some reason');

        data.sendFeedback(1, 1, 'some reason');
    }

    function test_sendCandidateFeedback_revertsWhenCandidateDoesntExist() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugDoesNotExist.selector));
        data.sendCandidateFeedback(address(this), 'some slug', 1, 'some reason');
    }

    function test_sendCandidateFeedback_revertsWithBadSupportValue() public {
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'some description',
            slug,
            0
        );
        string memory reason = 'some reason';
        uint8 support = 3;

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.InvalidSupportValue.selector));
        data.sendCandidateFeedback(address(this), 'some slug', support, reason);
    }

    function test_sendCandidateFeedback_emitsEventForNouner() public {
        address nouner = makeAddr('nouner');
        tokenLikeMock.setPriorVotes(nouner, block.number - 1, 3);
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'some description',
            slug,
            0
        );
        string memory reason = 'some reason';
        uint8 support = 1;

        vm.expectEmit(true, true, true, true);
        emit CandidateFeedbackSent(nouner, address(this), slug, support, reason);

        vm.prank(nouner);
        data.sendCandidateFeedback(address(this), 'some slug', support, reason);
    }

    function test_sendCandidateFeedback_emitsEventForNonNouner() public {
        address nonNouner = makeAddr('non nouner');
        string memory slug = 'some slug';
        NounsDAOV3Proposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate{ value: data.createCandidateCost() }(
            txs.targets,
            txs.values,
            txs.signatures,
            txs.calldatas,
            'some description',
            slug,
            0
        );
        string memory reason = 'some reason';
        uint8 support = 1;

        vm.expectEmit(true, true, true, true);
        emit CandidateFeedbackSent(nonNouner, address(this), slug, support, reason);

        vm.prank(nonNouner);
        data.sendCandidateFeedback(address(this), 'some slug', support, reason);
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

    function test_setFeeRecipient_revertsForNonAdmin() public {
        vm.expectRevert('Ownable: caller is not the owner');
        data.setFeeRecipient(payable(makeAddr('new fee recipient')));
    }

    function test_setFeeRecipient_worksForAdmin() public {
        address payable newFeeRecipient = payable(makeAddr('new fee recipient'));

        vm.expectEmit(true, true, true, true);
        emit FeeRecipientSet(feeRecipient, newFeeRecipient);

        vm.prank(dataAdmin);
        data.setFeeRecipient(newFeeRecipient);

        assertEq(data.feeRecipient(), newFeeRecipient);
    }

    function test_withdrawETH_revertsForNonAdmin() public {
        address recipient = makeAddr('recipient');
        assertEq(recipient.balance, 0);
        vm.deal(address(data), 1.42 ether);

        vm.expectRevert('Ownable: caller is not the owner');
        data.withdrawETH(recipient, 1.42 ether);
    }

    function test_withdrawETH_revertsIfAmountExceedsBalance() public {
        address recipient = makeAddr('recipient');
        assertEq(recipient.balance, 0);
        vm.deal(address(data), 1.42 ether);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.AmountExceedsBalance.selector));
        vm.prank(dataAdmin);
        data.withdrawETH(recipient, 1.69 ether);
    }

    function test_withdrawETH_sendsBalanceAndEmits() public {
        address recipient = makeAddr('recipient');
        assertEq(recipient.balance, 0);
        vm.deal(address(data), 1.42 ether);

        vm.expectEmit(true, true, true, true);
        emit ETHWithdrawn(recipient, 1.42 ether);

        vm.prank(dataAdmin);
        data.withdrawETH(recipient, 1.42 ether);

        assertEq(recipient.balance, 1.42 ether);
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
