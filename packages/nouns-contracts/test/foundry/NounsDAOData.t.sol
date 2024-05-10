// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsV3 } from './helpers/DeployUtilsV3.sol';
import { AuctionHelpers } from './helpers/AuctionHelpers.sol';
import { INounsDAOLogic } from '../../contracts/interfaces/INounsDAOLogic.sol';
import { NounsTokenLike, NounsDAOTypes } from '../../contracts/governance/NounsDAOInterfaces.sol';
import { INounsAuctionHouse } from '../../contracts/interfaces/INounsAuctionHouse.sol';
import { NounsDAOData } from '../../contracts/governance/data/NounsDAOData.sol';
import { NounsDAODataEvents } from '../../contracts/governance/data/NounsDAODataEvents.sol';
import { NounsDAODataProxy } from '../../contracts/governance/data/NounsDAODataProxy.sol';
import { NounsDAOProposals } from '../../contracts/governance/NounsDAOProposals.sol';
import { SigUtils } from './helpers/SigUtils.sol';

abstract contract NounsDAODataBaseTest is DeployUtilsV3, SigUtils, NounsDAODataEvents, AuctionHelpers {
    NounsDAODataProxy proxy;
    NounsDAOData data;
    address dataAdmin = makeAddr('data admin');
    INounsDAOLogic nounsDao;
    INounsAuctionHouse auction;
    address feeRecipient = makeAddr('fee recipient');
    address otherProposer = makeAddr('other proposer');
    address notNouner = makeAddr('not nouner');

    function setUp() public virtual {
        nounsDao = INounsDAOLogic(address(_deployDAOV3()));
        auction = INounsAuctionHouse(nounsDao.nouns().minter());
        vm.prank(address(nounsDao.timelock()));
        auction.unpause();

        NounsDAOData logic = new NounsDAOData(address(nounsDao.nouns()), address(nounsDao));

        bytes memory initCallData = abi.encodeWithSignature(
            'initialize(address,uint256,uint256,address)',
            address(dataAdmin),
            0.01 ether,
            0.01 ether,
            feeRecipient
        );

        proxy = new NounsDAODataProxy(address(logic), initCallData);
        data = NounsDAOData(address(proxy));

        bidAndSettleAuction(auction, address(this));
        bidAndSettleAuction(auction, otherProposer);

        vm.roll(block.number + 1);
    }

    function createTxs(
        address target,
        uint256 value,
        string memory signature,
        bytes memory callData
    ) internal pure returns (NounsDAOProposals.ProposalTxs memory) {
        return createTxs(1, target, value, signature, callData);
    }

    function createTxs(
        uint256 count,
        address target,
        uint256 value,
        string memory signature,
        bytes memory callData
    ) internal pure returns (NounsDAOProposals.ProposalTxs memory) {
        address[] memory targets = new address[](count);
        uint256[] memory values = new uint256[](count);
        string[] memory signatures = new string[](count);
        bytes[] memory calldatas = new bytes[](count);
        for (uint256 i = 0; i < count; i++) {
            targets[i] = target;
            values[i] = value;
            signatures[i] = signature;
            calldatas[i] = callData;
        }
        return NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas);
    }
}

contract NounsDAOData_CreateCandidateTest is NounsDAODataBaseTest {
    function test_createProposalCandidate_revertsForNonNounerAndNoPayment() public {
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.MustBeNounerOrPaySufficientFee.selector));
        vm.prank(notNouner);
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(target, value, signature, callData);

        bytes memory encodedProp = NounsDAOProposals.calcProposalEncodeData(proposer, txs, description);
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

        txs = NounsDAOProposals.ProposalTxs(targets, values, signatures, calldatas);
        encodedProp = NounsDAOProposals.calcProposalEncodeData(proposer, txs, description);
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_worksForNonNounerWithEnoughPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, description))
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

    function test_createProposalCandidate_givenFeeRecipientZero_accumelatesETHFee() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

        vm.prank(dataAdmin);
        data.setFeeRecipient(payable(address(0)));

        uint256 contractBalanceBefore = address(data).balance;

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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, description))
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

        assertEq(address(data).balance - contractBalanceBefore, data.createCandidateCost());
    }

    function test_createProposalCandidate_worksForNonNounerWhenPaymentConfigIsZero() public {
        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0);

        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, description))
        );

        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_revertsOnSlugReuseBySameProposer() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugAlreadyUsed.selector));
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_worksWithSameSlugButDifferentProposers() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);

        vm.prank(otherProposer);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_updateProposalCandidate_revertsForNonNounerAndNoPayment() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
        vm.prank(notNouner);
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

    function test_createProposalCandidate_givenMoreThan10Txs_reverts() public {
        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0);

        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(11, address(0), 0, 'some signature', 'some data');

        vm.expectRevert(NounsDAOProposals.TooManyActions.selector);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_givenZeroTxs_reverts() public {
        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0);

        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(0, address(0), 0, 'some signature', 'some data');

        vm.expectRevert(NounsDAOProposals.MustProvideActions.selector);
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
    }

    function test_createProposalCandidate_givenArityMismatch_reverts() public {
        vm.prank(dataAdmin);
        data.setCreateCandidateCost(0);

        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(1, address(0), 0, 'some signature', 'some data');
        uint256[] memory values = new uint256[](2);

        vm.expectRevert(NounsDAOProposals.ProposalInfoArityMismatch.selector);
        data.createProposalCandidate(txs.targets, values, txs.signatures, txs.calldatas, description, slug, 0);
    }
}

contract NounsDAOData_UpdateCandidateTest is NounsDAODataBaseTest {
    function test_updateProposalCandidate_revertsOnUnseenSlug() public {
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');

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
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, updateDescription)),
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, updateDescription)),
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

    function test_updateProposalCandidate_givenFeeRecipientZero_accumelatesETHFee() public {
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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

        vm.prank(dataAdmin);
        data.setFeeRecipient(payable(address(0)));

        uint256 contractBalanceBefore = address(data).balance;

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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, updateDescription)),
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

        assertEq(address(data).balance - contractBalanceBefore, data.updateCandidateCost());
    }

    function test_updateProposalCandidate_worksForNonNounerWhenPaymentConfigIsZero() public {
        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
            keccak256(NounsDAOProposals.calcProposalEncodeData(address(this), txs, updateDescription)),
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

    function test_updateProposalCandidate_givenMoreThan10Txs_reverts() public {
        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
        txs = createTxs(11, address(0), 0, 'some signature', 'some data');

        vm.expectRevert(NounsDAOProposals.TooManyActions.selector);
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

    function test_updateProposalCandidate_givenZeroTxs_reverts() public {
        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
        txs = createTxs(0, address(0), 0, 'some signature', 'some data');

        vm.expectRevert(NounsDAOProposals.MustProvideActions.selector);
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

    function test_updateProposalCandidate_givenArityMismatch_reverts() public {
        vm.prank(dataAdmin);
        data.setUpdateCandidateCost(0);
        string memory description = 'some description';
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
        data.createProposalCandidate(txs.targets, txs.values, txs.signatures, txs.calldatas, description, slug, 0);
        uint256[] memory values = new uint256[](2);

        vm.expectRevert(NounsDAOProposals.ProposalInfoArityMismatch.selector);
        data.updateProposalCandidate(
            txs.targets,
            values,
            txs.signatures,
            txs.calldatas,
            description,
            slug,
            0,
            'reason'
        );
    }
}

contract NounsDAOData_CancelCandidateTest is NounsDAODataBaseTest {
    function test_cancelProposalCandidate_revertsOnUnseenSlug() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.SlugDoesNotExist.selector));
        data.cancelProposalCandidate('slug');
    }

    function test_cancelProposalCandidate_emitsACancelEvent() public {
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
}

contract NounsDAOData_AddSignatureTest is NounsDAODataBaseTest {
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
        bytes memory encodedProp = NounsDAOProposals.calcProposalEncodeData(address(this), txs, description);

        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.InvalidSignature.selector));
        vm.prank(makeAddr('not signer'));
        data.addSignature(sig, expiration, proposer, slug, 0, encodedProp, reason);
    }

    function test_addSignature_emitsEvent() public {
        string memory description = 'some description';
        string memory slug = 'slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
        address verifyingContract = address(nounsDao);
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
        bytes memory encodedProp = NounsDAOProposals.calcProposalEncodeData(address(this), txs, description);
        bytes32 sigDigest = NounsDAOProposals.sigDigest(
            NounsDAOProposals.PROPOSAL_TYPEHASH,
            encodedProp,
            expiration,
            verifyingContract
        );

        vm.expectEmit(true, true, true, true);
        emit SignatureAdded(signer, sig, expiration, proposer, slug, 0, keccak256(encodedProp), sigDigest, reason);

        vm.prank(signer);
        data.addSignature(sig, expiration, proposer, slug, 0, encodedProp, reason);
    }
}

contract NounsDAOData_SendFeedbackTest is NounsDAODataBaseTest {
    function test_sendFeedback_revertsWithBadSupportValue() public {
        vm.expectRevert(abi.encodeWithSelector(NounsDAOData.InvalidSupportValue.selector));
        data.sendFeedback(1, 3, 'some reason');
    }

    function test_sendFeedback_emitsEventForNouner() public {
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
        string memory slug = 'some slug';
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
        NounsDAOProposals.ProposalTxs memory txs = createTxs(address(0), 0, 'some signature', 'some data');
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
}

contract NounsDAOData_AdminFunctionsTest is NounsDAODataBaseTest {
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
}

contract NounsDAOData_CreateCandidateToUpdateProposalTest is NounsDAODataBaseTest {
    address signer;
    uint256 signerPK;
    uint256 proposalId;
    NounsDAOProposals.ProposalTxs updateTxs;
    string updateDescription = 'some description';

    function setUp() public override {
        super.setUp();
        (signer, signerPK) = makeAddrAndKey('signerWithVote1');
        bidAndSettleAuction(auction, signer);

        proposalId = proposeBySigs(
            notNouner,
            signer,
            signerPK,
            createTxs(makeAddr('target'), 0.142 ether, '', ''),
            'description',
            block.timestamp + 7 days
        );

        updateTxs = createTxs(makeAddr('target'), 4.2 ether, '', '');
    }

    function test_givenProposalInUpdatableStateAndSenderIsProposerAndSenderNotNounder_worksWithNoFee() public {
        bytes32 encodedProp = keccak256(
            abi.encodePacked(
                proposalId,
                NounsDAOProposals.calcProposalEncodeData(notNouner, updateTxs, updateDescription)
            )
        );

        vm.expectEmit(true, true, true, true);
        emit ProposalCandidateCreated(
            notNouner,
            updateTxs.targets,
            updateTxs.values,
            updateTxs.signatures,
            updateTxs.calldatas,
            updateDescription,
            'some slug',
            proposalId,
            encodedProp
        );

        vm.prank(notNouner);
        data.createProposalCandidate(
            updateTxs.targets,
            updateTxs.values,
            updateTxs.signatures,
            updateTxs.calldatas,
            updateDescription,
            'some slug',
            proposalId
        );
    }

    function test_givenProposalNotUpdatable_reverts() public {
        vm.roll(nounsDao.proposalsV3(proposalId).updatePeriodEndBlock + 1);

        vm.expectRevert(NounsDAOData.ProposalToUpdateMustBeUpdatable.selector);
        vm.prank(notNouner);
        data.createProposalCandidate(
            updateTxs.targets,
            updateTxs.values,
            updateTxs.signatures,
            updateTxs.calldatas,
            updateDescription,
            'some slug',
            proposalId
        );
    }

    function test_givenSenderIsntProposer_reverts() public {
        vm.expectRevert(NounsDAOData.OnlyProposerCanCreateUpdateCandidate.selector);
        vm.prank(makeAddr('not proposer'));
        data.createProposalCandidate(
            updateTxs.targets,
            updateTxs.values,
            updateTxs.signatures,
            updateTxs.calldatas,
            updateDescription,
            'some slug',
            proposalId
        );
    }

    function test_givenProposalNotBySigs_reverts() public {
        address nouner = makeAddr('nouner');
        bidAndSettleAuction(auction, nouner);
        proposalId = propose(nouner, makeAddr('target'), 0.142 ether, '', '', 'description');

        vm.expectRevert(NounsDAOData.UpdateProposalCandidatesOnlyWorkWithProposalsBySigs.selector);
        vm.prank(nouner);
        data.createProposalCandidate(
            updateTxs.targets,
            updateTxs.values,
            updateTxs.signatures,
            updateTxs.calldatas,
            updateDescription,
            'some slug',
            proposalId
        );
    }

    function propose(
        address proposer,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        string memory description
    ) internal returns (uint256) {
        vm.prank(proposer);
        address[] memory targets = new address[](1);
        targets[0] = target;
        uint256[] memory values = new uint256[](1);
        values[0] = value;
        string[] memory signatures = new string[](1);
        signatures[0] = signature;
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = data;
        return nounsDao.propose(targets, values, signatures, calldatas, description);
    }

    function proposeBySigs(
        address proposer,
        address signer_,
        uint256 signerPK_,
        NounsDAOProposals.ProposalTxs memory txs,
        string memory description,
        uint256 expirationTimestamp
    ) internal returns (uint256 proposalId_) {
        address[] memory signers = new address[](1);
        signers[0] = signer_;
        uint256[] memory signerPKs = new uint256[](1);
        signerPKs[0] = signerPK_;
        uint256[] memory expirationTimestamps = new uint256[](1);
        expirationTimestamps[0] = expirationTimestamp;

        return proposeBySigs(proposer, signers, signerPKs, expirationTimestamps, txs, description);
    }

    function proposeBySigs(
        address proposer,
        address[] memory signers,
        uint256[] memory signerPKs,
        uint256[] memory expirationTimestamps,
        NounsDAOProposals.ProposalTxs memory txs,
        string memory description
    ) internal returns (uint256 proposalId_) {
        NounsDAOTypes.ProposerSignature[] memory sigs = new NounsDAOTypes.ProposerSignature[](signers.length);
        for (uint256 i = 0; i < signers.length; ++i) {
            sigs[i] = NounsDAOTypes.ProposerSignature(
                signProposal(proposer, signerPKs[i], txs, description, expirationTimestamps[i], address(nounsDao)),
                signers[i],
                expirationTimestamps[i]
            );
        }

        vm.prank(proposer);
        proposalId_ = nounsDao.proposeBySigs(sigs, txs.targets, txs.values, txs.signatures, txs.calldatas, description);
    }
}
