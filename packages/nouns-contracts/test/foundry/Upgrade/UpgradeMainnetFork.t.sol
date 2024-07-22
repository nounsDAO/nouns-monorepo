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
import { DeployAuctionHouseV2Mainnet } from '../../../script/AuctionHouseV2/DeployAuctionHouseV2Mainnet.s.sol';
import { NounsAuctionHouseV2 } from '../../../contracts/NounsAuctionHouseV2.sol';
import { NounsAuctionHousePreV2Migration } from '../../../contracts/NounsAuctionHousePreV2Migration.sol';
import { NounsAuctionHouse } from '../../../contracts/NounsAuctionHouse.sol';

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

    function propose(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint32 clientId
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
        proposalId = NOUNS_DAO_PROXY_MAINNET.propose(
            targets_,
            values_,
            signatures_,
            calldatas_,
            'my proposal',
            clientId
        );
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

contract DAOUpgradeMainnetForkTest is UpgradeMainnetForkBaseTest {
    function setUp() public virtual override {
        super.setUp();

        // Deploy the latest DAO logic
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        newLogic = address(new NounsDAOLogicV4());

        // Propose the upgrade
        vm.setEnv('PROPOSER_KEY', '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
        vm.setEnv('DAO_V3_IMPL', Strings.toHexString(uint160(newLogic), 20));
        vm.setEnv('PROPOSAL_DESCRIPTION_FILE', 'test/foundry/Upgrade/proposal-description.txt');
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

    function test_voteSnapshotBlockSwitchProposalId_zeroOutWorks() public {
        assertNotEq(NOUNS_DAO_PROXY_MAINNET.voteSnapshotBlockSwitchProposalId(), 0);

        uint256 proposalId = propose(
            address(NOUNS_DAO_PROXY_MAINNET),
            0,
            '_zeroOutVoteSnapshotBlockSwitchProposalId()',
            ''
        );
        voteAndExecuteProposal(proposalId);

        assertEq(NOUNS_DAO_PROXY_MAINNET.voteSnapshotBlockSwitchProposalId(), 0);
    }

    function test_clientId_savedOnProposals() public {
        uint32 expectedClientId = 42;
        uint256 proposalId = propose(address(NOUNS_DAO_PROXY_MAINNET), 0, '', '', expectedClientId);

        NounsDAOTypes.ProposalForRewards memory propsData = getProposalDataForRewards(proposalId);
        assertEq(expectedClientId, propsData.clientId);
    }

    function getProposalDataForRewards(
        uint256 proposalId
    ) internal view returns (NounsDAOTypes.ProposalForRewards memory) {
        return
            NOUNS_DAO_PROXY_MAINNET.proposalDataForRewards(proposalId, proposalId, 0, false, false, new uint32[](0))[0];
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
            0,
            false,
            false,
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

contract AuctionHouseUpgradeMainnetForkTest is UpgradeMainnetForkBaseTest {
    uint256 v1NounId;
    uint256 v1Amount;
    uint256 v1StartTime;
    uint256 v1EndTime;
    address v1Bidder;
    bool v1Settled;
    address v1NounsAddress;
    address v1WethAddress;
    address v1Owner;
    uint256 v1Duration;
    uint8 v1MinBidIncrementPercentage;
    uint256 v1ReservePrice;
    uint256 v1TimeBuffer;

    function setUp() public override {
        super.setUp();

        // Save AH V1 state before the upgrade
        NounsAuctionHouse ahv1 = NounsAuctionHouse(AUCTION_HOUSE_PROXY_MAINNET);
        (v1NounId, v1Amount, v1StartTime, v1EndTime, v1Bidder, v1Settled) = ahv1.auction();
        v1NounsAddress = address(ahv1.nouns());
        v1WethAddress = address(ahv1.weth());
        v1Owner = ahv1.owner();
        v1Duration = ahv1.duration();
        v1MinBidIncrementPercentage = ahv1.minBidIncrementPercentage();
        v1ReservePrice = ahv1.reservePrice();
        v1TimeBuffer = ahv1.timeBuffer();

        // Propose and execute the upgrade proposal

        NounsAuctionHouseV2 newLogic = new NounsAuctionHouseV2(ahv1.nouns(), ahv1.weth(), ahv1.duration());
        NounsAuctionHousePreV2Migration migratorLogic = new NounsAuctionHousePreV2Migration();

        uint256 txCount = 3;
        address[] memory targets = new address[](txCount);
        uint256[] memory values = new uint256[](txCount);
        string[] memory signatures = new string[](txCount);
        bytes[] memory calldatas = new bytes[](txCount);

        // proxyAdmin.upgrade(proxy, address(migratorLogic));
        targets[0] = AUCTION_HOUSE_PROXY_ADMIN_MAINNET;
        signatures[0] = 'upgrade(address,address)';
        calldatas[0] = abi.encode(AUCTION_HOUSE_PROXY_MAINNET, address(migratorLogic));

        // // migrator.migrate();
        targets[1] = AUCTION_HOUSE_PROXY_MAINNET;
        signatures[1] = 'migrate()';

        // proxyAdmin.upgrade(proxy, address(newLogic));
        targets[2] = AUCTION_HOUSE_PROXY_ADMIN_MAINNET;
        signatures[2] = 'upgrade(address,address)';
        calldatas[2] = abi.encode(AUCTION_HOUSE_PROXY_MAINNET, address(newLogic));

        vm.prank(proposerAddr);
        uint256 proposalId = NOUNS_DAO_PROXY_MAINNET.propose(
            targets,
            values,
            signatures,
            calldatas,
            'Upgrading to AuctionHouseV2'
        );

        voteAndExecuteProposal(proposalId);
    }

    function test_auctionState_survivesUpgrade() public {
        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        NounsAuctionHouseV2.AuctionV2View memory auctionV2State = auctionV2.auction();

        assertEq(auctionV2State.nounId, v1NounId);
        assertEq(auctionV2State.amount, v1Amount);
        assertEq(auctionV2State.startTime, v1StartTime);
        assertEq(auctionV2State.endTime, v1EndTime);
        assertEq(auctionV2State.bidder, v1Bidder);
        assertEq(auctionV2State.settled, false);

        assertEq(address(auctionV2.nouns()), v1NounsAddress);
        assertEq(address(auctionV2.weth()), v1WethAddress);
        assertEq(auctionV2.timeBuffer(), v1TimeBuffer);
        assertEq(auctionV2.reservePrice(), v1ReservePrice);
        assertEq(auctionV2.minBidIncrementPercentage(), v1MinBidIncrementPercentage);
        assertEq(auctionV2.duration(), v1Duration);
        assertEq(auctionV2.paused(), false);
        assertEq(auctionV2.owner(), v1Owner);
    }

    function test_bidAndSettleInV2_worksAndCapturesSettlementHistory() public {
        NounsAuctionHouseV2 auctionV2 = NounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        auctionV2.settleCurrentAndCreateNewAuction();
        uint32 clientId = 42;
        uint96 nounId = auctionV2.auction().nounId;

        auctionV2.createBid{ value: 0.042 ether }(nounId, clientId);
        vm.warp(block.timestamp + auctionV2.auction().endTime);
        uint32 settlementTime = uint32(block.timestamp);
        auctionV2.settleCurrentAndCreateNewAuction();

        NounsAuctionHouseV2.Settlement[] memory settlements = auctionV2.getSettlementsFromIdtoTimestamp(
            nounId,
            block.timestamp,
            true
        );

        assertEq(settlements.length, 1);
        NounsAuctionHouseV2.Settlement memory s = settlements[0];
        assertEq(s.nounId, nounId);
        assertEq(s.winner, address(this));
        assertEq(s.amount, 0.042 ether);
        assertEq(s.clientId, clientId);
        assertEq(s.blockTimestamp, settlementTime);
    }
}
