// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsExcessETHBurner } from '../helpers/DeployUtilsExcessETHBurner.sol';
import { NounsDAOExecutorV3 } from '../../../contracts/governance/NounsDAOExecutorV3.sol';
import { INounsToken } from '../../../contracts/interfaces/INounsToken.sol';
import { INounsDescriptorMinimal } from '../../../contracts/interfaces/INounsDescriptorMinimal.sol';
import { INounsSeeder } from '../../../contracts/interfaces/INounsSeeder.sol';
import { ExcessETHBurner, INounsAuctionHouseV2 } from '../../../contracts/governance/ExcessETHBurner.sol';
import { ERC20Mock, RocketETHMock } from '../helpers/ERC20Mock.sol';
import { WETH } from '../../../contracts/test/WETH.sol';
import { ERC721Mock } from '../helpers/ERC721Mock.sol';

contract DAOMock {
    uint256 adjustedSupply;

    function setAdjustedTotalSupply(uint256 adjustedSupply_) external {
        adjustedSupply = adjustedSupply_;
    }

    function adjustedTotalSupply() external view returns (uint256) {
        return adjustedSupply;
    }
}

contract AuctionMock is INounsAuctionHouseV2 {
    uint256[] pricesHistory;
    uint128 nounId;
    INounsToken nounsToken;

    constructor(INounsToken nounsToken_) {
        nounsToken = nounsToken_;
    }

    function setNounId(uint128 nounId_) external {
        nounId = nounId_;
    }

    function setPrices(uint256[] memory pricesHistory_) external {
        pricesHistory = pricesHistory_;
    }

    function getPrices(uint256) external view override returns (uint256[] memory) {
        return pricesHistory;
    }

    function auction() external view returns (INounsAuctionHouseV2.AuctionV2 memory) {
        return INounsAuctionHouseV2.AuctionV2(nounId, 0, 0, 0, payable(address(0)), false);
    }

    function settleAuction() external {}

    function settleCurrentAndCreateNewAuction() external {}

    function createBid(uint256) external payable {}

    function pause() external {}

    function unpause() external {}

    function setTimeBuffer(uint56 timeBuffer) external {}

    function setReservePrice(uint192 reservePrice) external {}

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage) external {}

    function getSettlements(uint256 auctionCount) external view returns (Settlement[] memory settlements) {}

    function getSettlements(uint256 startId, uint256 endId) external view returns (Settlement[] memory settlements) {}

    function getPrices(uint256 startId, uint256 endId) external view returns (uint256[] memory prices) {}

    function warmUpSettlementState(uint256[] calldata nounIds) external {}

    function nouns() external view returns (INounsToken) {
        return nounsToken;
    }
}

contract NounsTokenMock is INounsToken, ERC721Mock {
    function burn(uint256 tokenId) external {}

    function dataURI(uint256 tokenId) external returns (string memory) {}

    function lockDescriptor() external {}

    function lockMinter() external {}

    function lockSeeder() external {}

    function mint() external returns (uint256) {}

    function setDescriptor(INounsDescriptorMinimal descriptor) external {}

    function setMinter(address minter) external {}

    function setSeeder(INounsSeeder seeder) external {}
}

contract ExcessETHBurnerTest is DeployUtilsExcessETHBurner {
    DAOMock dao = new DAOMock();
    NounsTokenMock nounsToken = new NounsTokenMock();
    AuctionMock auction = new AuctionMock(nounsToken);
    NounsDAOExecutorV3 treasury;
    ExcessETHBurner burner;

    uint128 burnStartNounId;
    uint128 minNewNounsBetweenBurns;
    uint16 pastAuctionCount;

    function setUp() public {
        burnStartNounId = 1;
        minNewNounsBetweenBurns = 100;
        pastAuctionCount = 90;

        treasury = _deployExecutorV3(address(dao));
        burner = _deployExcessETHBurner(treasury, auction, burnStartNounId, minNewNounsBetweenBurns, pastAuctionCount);

        vm.prank(address(treasury));
        treasury.setExcessETHBurner(address(burner));

        auction.setNounId(burnStartNounId);
        nounsToken.mint(address(1), 0);
        nounsToken.mint(address(1), 1);
    }

    function test_burnExcessETH_beforeNextBurnNounID_reverts() public {
        auction.setNounId(0);

        vm.expectRevert(ExcessETHBurner.NotTimeToBurnYet.selector);
        burner.burnExcessETH();
    }

    function test_burnExcessETH_givenTreasuryBalanceZero_reverts() public {
        setMeanPrice(1 ether);
        dao.setAdjustedTotalSupply(1);

        vm.expectRevert(ExcessETHBurner.NoExcessToBurn.selector);
        burner.burnExcessETH();
    }

    function test_burnExcessETH_givenExcess_burnsAndSetsNextBurnNounID() public {
        setMeanPrice(1 ether);
        dao.setAdjustedTotalSupply(1);
        vm.deal(address(treasury), 100 ether);

        uint256 burnedAmount = burner.burnExcessETH();

        assertEq(burnedAmount, 99 ether);
        assertEq(address(treasury).balance, 1 ether);
        assertEq(burner.nextBurnNounID(), burnStartNounId + minNewNounsBetweenBurns);
    }

    function test_burnExcessETH_revertsIfAuctionReturnsInvalidNounId() public {
        auction.setNounId(100000000);

        vm.expectRevert('ERC721: owner query for nonexistent token');
        burner.burnExcessETH();
    }

    function test_burnExcessETH_givenABurn_allowsBurnOnlyAfterEnoughNounMints() public {
        setMeanPrice(1 ether);
        dao.setAdjustedTotalSupply(1);
        vm.deal(address(treasury), 100 ether);

        assertEq(burner.burnExcessETH(), 99 ether);
        assertEq(address(treasury).balance, 1 ether);
        assertEq(burner.nextBurnNounID(), burnStartNounId + minNewNounsBetweenBurns);

        vm.deal(address(treasury), 100 ether);
        vm.expectRevert(ExcessETHBurner.NotTimeToBurnYet.selector);
        burner.burnExcessETH();

        auction.setNounId(burner.nextBurnNounID());
        nounsToken.mint(address(1), burner.nextBurnNounID());

        uint128 expectedNextBurnID = burner.nextBurnNounID() + minNewNounsBetweenBurns;
        assertEq(burner.burnExcessETH(), 99 ether);
        assertEq(burner.nextBurnNounID(), expectedNextBurnID);
    }

    function test_burnExcessETH_givenExpectedValueGreaterThanTreasury_reverts() public {
        setMeanPrice(1 ether);
        dao.setAdjustedTotalSupply(100);
        vm.deal(address(treasury), 10 ether);

        vm.expectRevert(ExcessETHBurner.NoExcessToBurn.selector);
        burner.burnExcessETH();
    }

    function test_burnExcessETH_givenExcessGreaterThanBalance_burnsBalance() public {
        vm.deal(address(treasury), 1 ether);
        dao.setAdjustedTotalSupply(1);
        setMeanPrice(1 ether);
        ERC20Mock(address(burner.stETH())).mint(address(treasury), 100 ether);

        assertEq(burner.burnExcessETH(), 1 ether);
        assertEq(address(treasury).balance, 0);
    }

    function test_burnExcessETH_givenBalancesInAllERC20s_takesThemIntoAccount() public {
        // expected value = 10 ETH
        dao.setAdjustedTotalSupply(10);
        setMeanPrice(1 ether);

        // giving treasury 11 ETH -> Excess grows to 1 ETH
        vm.deal(address(treasury), 11 ether);

        // giving 1 stETH -> excess grows to 2 ETH
        ERC20Mock(address(burner.stETH())).mint(address(treasury), 1 ether);

        // giving 1 WETH -> excess grows to 3 ETH
        WETH weth = WETH(payable(address(burner.wETH())));
        weth.deposit{ value: 1 ether }();
        weth.transfer(address(treasury), 1 ether);

        // giving 1 rETH at a rate of 2 -> excess grows to 5 ETH
        RocketETHMock reth = RocketETHMock(address(burner.rETH()));
        reth.setRate(2);
        reth.mint(address(treasury), 1 ether);

        assertEq(burner.burnExcessETH(), 5 ether);
    }

    function test_burnExcessETH_givenRecentAuctionPriceChange_expectedTreasuryValueDropsAsExpected() public {
        vm.deal(address(treasury), 100 ether);

        dao.setAdjustedTotalSupply(1);
        setMeanPrice(100 ether);

        assertEq(burner.excessETH(), 0);

        // (100 * 88 + 10 * 2) / 90 = 98
        // with 1 noun in supply, expected value is 98 ETH
        uint256[] memory recentPrices = new uint256[](2);
        recentPrices[0] = 10 ether;
        recentPrices[1] = 10 ether;
        setUniformPastAuctionsWithDifferentRecentPrices(100 ether, recentPrices);

        assertEq(burner.burnExcessETH(), 2 ether);
    }

    function test_burnExcessETH_givenInsufficientAuctionHistory_reverts() public {
        vm.deal(address(treasury), 100 ether);
        dao.setAdjustedTotalSupply(1);
        setPriceHistory(1 ether, pastAuctionCount - 1);

        vm.expectRevert(ExcessETHBurner.NotEnoughAuctionHistory.selector);
        burner.burnExcessETH();
    }

    // setMinNewNounsBetweenBurns

    function test_setNextBurnNounID_revertsForNonOwner() public {
        vm.expectRevert('Ownable: caller is not the owner');
        burner.setNextBurnNounID(1);
    }

    function test_setNextBurnNounID_worksForOwner() public {
        assertTrue(burner.nextBurnNounID() != 142);

        vm.prank(address(treasury));
        burner.setNextBurnNounID(142);

        assertEq(burner.nextBurnNounID(), 142);
    }

    function test_setMinNewNounsBetweenBurns_revertsForNonOwner() public {
        vm.expectRevert('Ownable: caller is not the owner');
        burner.setMinNewNounsBetweenBurns(1);
    }

    function test_setMinNewNounsBetweenBurns_worksForOwner() public {
        assertTrue(burner.minNewNounsBetweenBurns() != 142);

        vm.prank(address(treasury));
        burner.setMinNewNounsBetweenBurns(142);

        assertEq(burner.minNewNounsBetweenBurns(), 142);
    }

    function test_setNumberOfPastAuctionsForMeanPrice_revertsForNonOwner() public {
        vm.expectRevert('Ownable: caller is not the owner');
        burner.setNumberOfPastAuctionsForMeanPrice(1);
    }

    function test_setNumberOfPastAuctionsForMeanPrice_worksForOwner() public {
        assertTrue(burner.numberOfPastAuctionsForMeanPrice() != 142);

        vm.prank(address(treasury));
        burner.setNumberOfPastAuctionsForMeanPrice(142);

        assertEq(burner.numberOfPastAuctionsForMeanPrice(), 142);
    }

    function test_setNumberOfPastAuctionsForMeanPrice_revertsIfValueIsTooLow() public {
        vm.prank(address(treasury));
        vm.expectRevert(ExcessETHBurner.PastAuctionCountTooLow.selector);
        burner.setNumberOfPastAuctionsForMeanPrice(1);
    }

    function setMeanPrice(uint256 meanPrice) internal {
        setPriceHistory(meanPrice, pastAuctionCount);
    }

    function setPriceHistory(uint256 meanPrice, uint256 count) internal {
        uint256[] memory prices = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            prices[i] = meanPrice;
        }
        auction.setPrices(prices);
    }

    function setUniformPastAuctionsWithDifferentRecentPrices(uint256 meanPrice, uint256[] memory recent) internal {
        uint256[] memory prices = new uint256[](pastAuctionCount + recent.length);
        for (uint256 i = 0; i < recent.length; i++) {
            prices[i] = recent[i];
        }
        for (uint256 i = 0; i < pastAuctionCount; i++) {
            prices[i + recent.length] = meanPrice;
        }
        auction.setPrices(prices);
    }
}
