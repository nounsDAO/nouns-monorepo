// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { NounsToken } from '../../../contracts/NounsToken.sol';
import { INounsDAOLogic } from '../../../contracts/interfaces/INounsDAOLogic.sol';
import { IStreamEscrow } from '../../../contracts/interfaces/IStreamEscrow.sol';
import { NounsDAOTypes } from '../../../contracts/governance/NounsDAOInterfaces.sol';
import { NounsAuctionHouseV3 } from '../../../contracts/NounsAuctionHouseV3.sol';
import { StreamEscrow } from '../../../contracts/StreamEscrow.sol';
import { INounsAuctionHouseV2 } from '../../../contracts/interfaces/INounsAuctionHouseV2.sol';
import { INounsAuctionHouseV3 } from '../../../contracts/interfaces/INounsAuctionHouseV3.sol';
import { DeployAuctionHouseV3StreamEscrowMainnet } from '../../../script/StreamEscrow/DeployAuctionHouseV3StreamEscrowMainnet.s.sol';

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
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 21164133);

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

contract AuctionHouseUpgradeMainnetForkTest is UpgradeMainnetForkBaseTest {
    address v2NounsAddress;
    address v2WethAddress;
    address v2Owner;
    uint256 v2Duration;
    uint8 v2MinBidIncrementPercentage;
    uint256 v2ReservePrice;
    uint256 v2TimeBuffer;
    INounsAuctionHouseV2.AuctionV2View auctionV2State;

    address user1 = makeAddr('user1');
    address user2 = makeAddr('user2');

    function setUp() public override {
        super.setUp();

        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);

        // Save AH V2 state before the upgrade
        INounsAuctionHouseV2 ahv2 = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        auctionV2State = ahv2.auction();

        v2NounsAddress = address(ahv2.nouns());
        v2WethAddress = address(ahv2.weth());
        v2Owner = IOwner(address(ahv2)).owner();
        v2Duration = ahv2.duration();
        v2MinBidIncrementPercentage = ahv2.minBidIncrementPercentage();
        v2ReservePrice = ahv2.reservePrice();
        v2TimeBuffer = ahv2.timeBuffer();

        // Deploy new contracts
        vm.setEnv('DEPLOYER_PRIVATE_KEY', '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        (StreamEscrow streamEscrow, NounsAuctionHouseV3 ahv3) = new DeployAuctionHouseV3StreamEscrowMainnet().run();

        // Propose upgrade
        uint256 txCount = 2;
        address[] memory targets = new address[](txCount);
        uint256[] memory values = new uint256[](txCount);
        string[] memory signatures = new string[](txCount);
        bytes[] memory calldatas = new bytes[](txCount);

        // proxyAdmin.upgrade(proxy, address(newLogic));
        targets[0] = AUCTION_HOUSE_PROXY_ADMIN_MAINNET;
        signatures[0] = 'upgrade(address,address)';
        calldatas[0] = abi.encode(AUCTION_HOUSE_PROXY_MAINNET, address(ahv3));
        // auctionHouse.setStreamEscrowParams(streamEscrow, immediateTreasuryBps, streamLengthInAuctions));
        targets[1] = AUCTION_HOUSE_PROXY_MAINNET;
        signatures[1] = 'setStreamEscrowParams(address,uint16,uint16)';
        calldatas[1] = abi.encode(address(streamEscrow), 2000, 1500);
        vm.prank(proposerAddr);
        uint256 proposalId = NOUNS_DAO_PROXY_MAINNET.propose(
            targets,
            values,
            signatures,
            calldatas,
            'Upgrading to AuctionHouseV3'
        );
        voteAndExecuteProposal(proposalId);
    }
    function test_auctionState_survivesUpgrade() public {
        INounsAuctionHouseV2 auctionV3 = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        INounsAuctionHouseV2.AuctionV2View memory auctionV3State = auctionV3.auction();
        assertEq(auctionV3State.nounId, auctionV2State.nounId);
        assertEq(auctionV3State.amount, auctionV2State.amount);
        assertEq(auctionV3State.startTime, auctionV2State.startTime);
        assertEq(auctionV3State.endTime, auctionV2State.endTime);
        assertEq(auctionV3State.bidder, auctionV2State.bidder);
        assertEq(auctionV3State.settled, false);
        assertEq(address(auctionV3.nouns()), v2NounsAddress);
        assertEq(address(auctionV3.weth()), v2WethAddress);
        assertEq(auctionV3.timeBuffer(), v2TimeBuffer);
        assertEq(auctionV3.reservePrice(), v2ReservePrice);
        assertEq(auctionV3.minBidIncrementPercentage(), v2MinBidIncrementPercentage);
        assertEq(auctionV3.duration(), v2Duration);
        assertEq(IPausible(address(auctionV3)).paused(), false);
        assertEq(IOwner(address(auctionV3)).owner(), v2Owner);
    }

    function test_bidAndSettleInV3_worksAndCapturesSettlementHistory() public {
        INounsAuctionHouseV2 auctionV2 = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        auctionV2.settleCurrentAndCreateNewAuction();
        uint32 clientId = 42;
        uint96 nounId = auctionV2.auction().nounId;
        auctionV2.createBid{ value: 0.042 ether }(nounId, clientId);
        vm.warp(block.timestamp + auctionV2.auction().endTime);
        uint32 settlementTime = uint32(block.timestamp);
        auctionV2.settleCurrentAndCreateNewAuction();
        INounsAuctionHouseV2.Settlement[] memory settlements = auctionV2.getSettlementsFromIdtoTimestamp(
            nounId,
            block.timestamp,
            true
        );
        assertEq(settlements.length, 1);
        INounsAuctionHouseV2.Settlement memory s = settlements[0];
        assertEq(s.nounId, nounId);
        assertEq(s.winner, address(this));
        assertEq(s.amount, 0.042 ether);
        assertEq(s.clientId, clientId);
        assertEq(s.blockTimestamp, settlementTime);
    }

    function test_auctionHouseV3_bidsAndStreams() public {
        INounsAuctionHouseV3 auction = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET);
        IStreamEscrow streamEscrow = auction.streamEscrow();
        auction.settleCurrentAndCreateNewAuction();

        // Buy 2 nouns on auction
        // first noun
        uint96 nounId1 = auction.auction().nounId;
        vm.prank(user1);
        auction.createBid{ value: 2 ether }(nounId1);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // second noun
        uint96 nounId2 = auction.auction().nounId;
        vm.prank(user2);
        auction.createBid{ value: 3 ether }(nounId2);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // check that stream was created for noun 1
        // 2 ether * 80% / 1500 = 0.0010666666 ether
        assertEq(streamEscrow.getStream(nounId1).ethPerTick, 1066666666666666);
        // 3 ether * 80% / 1500 = 0.0016 ether
        assertEq(streamEscrow.getStream(nounId2).ethPerTick, 0.0016 ether);

        // check that fast forward works as expected
        uint256 balance = address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance;
        vm.prank(user1);
        streamEscrow.fastForwardStream(nounId1, 300);
        assertEq(address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance, balance + 300 * 1066666666666666);

        // check that cancel works
        balance = user2.balance;
        vm.prank(user2);
        nouns.approve(address(streamEscrow), nounId2);
        vm.prank(user2);
        streamEscrow.cancelStream(nounId2);

        assertEq(nouns.ownerOf(nounId2), address(NOUNS_DAO_PROXY_MAINNET.timelock()));
        // check that user2 got the 80% back
        assertEq(user2.balance, balance + 2.4 ether);
    }

    function test_setImmediateTreasuryBpsToMax() public {
        // change param via proposal
        uint256 proposalId = propose(
            AUCTION_HOUSE_PROXY_MAINNET,
            0,
            'setImmediateTreasuryBPs(uint16)',
            abi.encode(10000)
        );
        voteAndExecuteProposal(proposalId);

        // win a noun and create a stream
        uint256 balance = address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance;
        INounsAuctionHouseV3 auction = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET);
        auction.settleCurrentAndCreateNewAuction();

        uint32 tick = auction.streamEscrow().currentTick();
        uint96 nounId1 = auction.auction().nounId;
        vm.prank(user1);
        auction.createBid{ value: 3 ether }(nounId1);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // entire amount should go to treasury
        assertEq(address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance, balance + 3 ether);
        // no stream should be created
        assertEq(auction.streamEscrow().getStream(nounId1).ethPerTick, 0);
        assertEq(auction.streamEscrow().isStreamActive(nounId1), false);
        assertEq(auction.streamEscrow().currentTick(), tick + 1);
    }

    function test_setImmediateTreasuryBpsToZero() public {
        // change param via proposal
        uint256 proposalId = propose(AUCTION_HOUSE_PROXY_MAINNET, 0, 'setImmediateTreasuryBPs(uint16)', abi.encode(0));
        voteAndExecuteProposal(proposalId);

        // win a noun and create a stream
        uint256 balance = address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance;
        INounsAuctionHouseV3 auction = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET);
        auction.settleCurrentAndCreateNewAuction();

        uint96 nounId1 = auction.auction().nounId;
        vm.prank(user1);
        auction.createBid{ value: 3 ether }(nounId1);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // entire amount should go to stream
        assertEq(address(NOUNS_DAO_PROXY_MAINNET.timelock()).balance, balance);
        assertEq(address(auction.streamEscrow()).balance, 3 ether);
        assertEq(auction.streamEscrow().getStream(nounId1).ethPerTick, 0.002 ether);
    }

    function test_setETHRecipient() public {
        // change param via proposal
        uint256 proposalId = propose(
            address(INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow()),
            0,
            'setETHRecipient(address)',
            abi.encode(makeAddr('newRecipient'))
        );
        voteAndExecuteProposal(proposalId);

        // win a noun and create a stream
        INounsAuctionHouseV3 auction = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET);
        auction.settleCurrentAndCreateNewAuction();

        uint96 nounId1 = auction.auction().nounId;
        vm.prank(user1);
        auction.createBid{ value: 3 ether }(nounId1);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // advance by 1 tick
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        // a tick was streamed to the new recipient
        assertEq(auction.streamEscrow().getStream(nounId1).ethPerTick, 0.0016 ether);
        assertEq(address(makeAddr('newRecipient')).balance, 0.0016 ether);
    }

    function test_setNounsRecipient() public {
        // change param via proposal
        uint256 proposalId = propose(
            address(INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow()),
            0,
            'setNounsRecipient(address)',
            abi.encode(makeAddr('newRecipient'))
        );
        voteAndExecuteProposal(proposalId);

        // win a noun and create a stream
        INounsAuctionHouseV3 auction = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET);
        auction.settleCurrentAndCreateNewAuction();

        uint96 nounId1 = auction.auction().nounId;
        vm.prank(user1);
        auction.createBid{ value: 3 ether }(nounId1);
        vm.warp(block.timestamp + auction.auction().endTime);
        auction.settleCurrentAndCreateNewAuction();

        IStreamEscrow streamEscrow = auction.streamEscrow();
        // cancel stream
        vm.prank(user1);
        nouns.approve(address(streamEscrow), nounId1);
        vm.prank(user1);
        streamEscrow.cancelStream(nounId1);

        // check that the noun were sent to the new recipient
        assertEq(nouns.ownerOf(nounId1), makeAddr('newRecipient'));
    }

    function test_setAllowedToCreateStream() public {
        NewStreamCreator newStreamCreator = new NewStreamCreator(
            INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow()
        );
        // change param via proposal
        uint256 proposalId = propose(
            address(INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow()),
            0,
            'setAllowedToCreateStream(address,bool)',
            abi.encode(address(newStreamCreator), true)
        );
        voteAndExecuteProposal(proposalId);

        // propose to transfer a treasury noun to the new contract
        uint256 proposalId2 = propose(
            address(nouns),
            0,
            'transferFrom(address,address,uint256)',
            abi.encode(address(NOUNS_DAO_PROXY_MAINNET.timelock()), address(newStreamCreator), 1188)
        );
        voteAndExecuteProposal(proposalId2);

        // new contract creates a stream
        newStreamCreator.createStream{ value: 6 ether }(1188, 1000);

        // check that stream was created
        IStreamEscrow streamEscrow = INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow();
        uint32 tick = streamEscrow.currentTick();
        assertEq(streamEscrow.getStream(1188).ethPerTick, 0.006 ether);
        assertEq(streamEscrow.getStream(1188).lastTick, tick + 1000);

        // change param via proposal to false
        uint256 proposalId3 = propose(
            address(INounsAuctionHouseV3(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow()),
            0,
            'setAllowedToCreateStream(address,bool)',
            abi.encode(address(newStreamCreator), false)
        );
        voteAndExecuteProposal(proposalId3);

        // propose to transfer a treasury noun to the new contract
        uint256 proposalId4 = propose(
            address(nouns),
            0,
            'transferFrom(address,address,uint256)',
            abi.encode(address(NOUNS_DAO_PROXY_MAINNET.timelock()), address(newStreamCreator), 1193)
        );
        voteAndExecuteProposal(proposalId4);

        // new contract can't create a stream
        vm.expectRevert('not allowed');
        newStreamCreator.createStream{ value: 6 ether }(1193, 1000);
    }
}

interface IOwner {
    function owner() external view returns (address);
}

interface IPausible {
    function paused() external view returns (bool);
}

contract NewStreamCreator {
    IStreamEscrow streamEscrow;

    constructor(IStreamEscrow streamEscrow_) {
        streamEscrow = streamEscrow_;
    }

    function createStream(uint256 nounId, uint16 streamLengthInTicks) public payable {
        streamEscrow.createStream{ value: msg.value }(nounId, streamLengthInTicks);
    }
}
