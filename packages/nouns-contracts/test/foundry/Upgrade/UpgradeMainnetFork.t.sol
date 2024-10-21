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
        vm.createSelectFork(vm.envString('RPC_MAINNET'), 20927301);

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
    address v1NounsAddress;
    address v1WethAddress;
    address v1Owner;
    uint256 v1Duration;
    uint8 v1MinBidIncrementPercentage;
    uint256 v1ReservePrice;
    uint256 v1TimeBuffer;
    INounsAuctionHouseV2.AuctionV2View auctionV2State;
    function setUp() public override {
        super.setUp();

        // Save AH V2 state before the upgrade
        INounsAuctionHouseV2 ahv2 = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        auctionV2State = ahv2.auction();

        v1NounsAddress = address(ahv2.nouns());
        v1WethAddress = address(ahv2.weth());
        v1Owner = IOwner(address(ahv2)).owner();
        v1Duration = ahv2.duration();
        v1MinBidIncrementPercentage = ahv2.minBidIncrementPercentage();
        v1ReservePrice = ahv2.reservePrice();
        v1TimeBuffer = ahv2.timeBuffer();

        NounsAuctionHouseV3 newLogic = new NounsAuctionHouseV3(ahv2.nouns(), ahv2.weth(), ahv2.duration());
        StreamEscrow streamEscrow = new StreamEscrow(
            address(NOUNS_DAO_PROXY_MAINNET.timelock()),
            address(ahv2.nouns())
        );

        uint256 txCount = 2;
        address[] memory targets = new address[](txCount);
        uint256[] memory values = new uint256[](txCount);
        string[] memory signatures = new string[](txCount);
        bytes[] memory calldatas = new bytes[](txCount);

        // proxyAdmin.upgrade(proxy, address(newLogic));
        targets[0] = AUCTION_HOUSE_PROXY_ADMIN_MAINNET;
        signatures[0] = 'upgrade(address,address)';
        calldatas[0] = abi.encode(AUCTION_HOUSE_PROXY_MAINNET, address(newLogic));
        // auctionHouse.setStreamEscrowParams(immediateTreasuryBps, streamLengthInAuctions, streamEscrow));
        targets[1] = AUCTION_HOUSE_PROXY_MAINNET;
        signatures[1] = 'setStreamEscrowParams(uint16,uint16,address)';
        calldatas[1] = abi.encode(2000, 1500, streamEscrow);
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
        assertEq(address(auctionV3.nouns()), v1NounsAddress);
        assertEq(address(auctionV3.weth()), v1WethAddress);
        assertEq(auctionV3.timeBuffer(), v1TimeBuffer);
        assertEq(auctionV3.reservePrice(), v1ReservePrice);
        assertEq(auctionV3.minBidIncrementPercentage(), v1MinBidIncrementPercentage);
        assertEq(auctionV3.duration(), v1Duration);
        assertEq(IPausible(address(auctionV3)).paused(), false);
        assertEq(IOwner(address(auctionV3)).owner(), v1Owner);
    }

    function test_bidAndSettleInV2_worksAndCapturesSettlementHistory() public {
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

    function test_bidAndSettleCreatesAStream() public {
        INounsAuctionHouseV2 auctionV2 = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET);
        auctionV2.settleCurrentAndCreateNewAuction();

        uint96 nounId = auctionV2.auction().nounId;
        auctionV2.createBid{ value: 4.5 ether }(nounId);
        vm.warp(block.timestamp + auctionV2.auction().endTime);
        auctionV2.settleCurrentAndCreateNewAuction();

        IStreamEscrow streamEscrow = INounsAuctionHouseV2(AUCTION_HOUSE_PROXY_MAINNET).streamEscrow();
        IStreamEscrow.Stream memory stream = streamEscrow.getStream(nounId);
        assertEq(stream.ethPerAuction, 0.0024 ether); // (80% * 4.5 eth / 1500)
    }
}

interface IOwner {
    function owner() external view returns (address);
}

interface IPausible {
    function paused() external view returns (bool);
}
