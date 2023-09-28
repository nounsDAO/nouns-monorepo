// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import 'forge-std/Test.sol';
import { DeployUtilsExcessETH } from '../helpers/DeployUtilsExcessETH.sol';
import { NounsDAOExecutorV3 } from '../../../contracts/governance/NounsDAOExecutorV3.sol';
import { INounsAuctionHouse } from '../../../contracts/interfaces/INounsAuctionHouse.sol';
import { ExcessETH, INounsAuctionHouseV2, INounsDAOV3 } from '../../../contracts/governance/ExcessETH.sol';
import { ERC20Mock, RocketETHMock } from '../helpers/ERC20Mock.sol';

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

    function setPrices(uint256[] memory pricesHistory_) external {
        pricesHistory = pricesHistory_;
    }

    function prices(uint256) external view override returns (INounsAuctionHouse.Settlement[] memory priceHistory_) {
        priceHistory_ = new INounsAuctionHouse.Settlement[](pricesHistory.length);
        for (uint256 i; i < pricesHistory.length; ++i) {
            priceHistory_[i].amount = pricesHistory[i];
        }
    }

    function settleAuction() external {}

    function settleCurrentAndCreateNewAuction() external {}

    function createBid(uint256 nounId) external payable {}

    function pause() external {}

    function unpause() external {}

    function setTimeBuffer(uint256 timeBuffer) external {}

    function setReservePrice(uint256 reservePrice) external {}

    function setMinBidIncrementPercentage(uint8 minBidIncrementPercentage) external {}
}

contract ExcessETHTest is DeployUtilsExcessETH {
    DAOMock dao = new DAOMock();
    AuctionMock auction = new AuctionMock();
    NounsDAOExecutorV3 treasury;
    ExcessETH excessETH;

    uint256 waitingPeriodEnd;
    uint16 pastAuctionCount;

    function setUp() public {
        waitingPeriodEnd = block.timestamp + 90 days;
        pastAuctionCount = 90;

        treasury = _deployExecutorV3(address(dao));
        excessETH = _deployExcessETH(treasury, auction, waitingPeriodEnd, pastAuctionCount);
    }

    function test_excessETH_beforeWaitingEnds_returnsZero() public {
        vm.deal(address(treasury), 100 ether);
        dao.setAdjustedTotalSupply(1);
        setMeanPrice(1 ether);

        assertEq(excessETH.excessETH(), 0);
    }

    function test_excessETH_afterWaitingEnds_justETHInTreasury_works() public {
        vm.deal(address(treasury), 100 ether);
        dao.setAdjustedTotalSupply(1);
        setMeanPrice(1 ether);
        vm.warp(waitingPeriodEnd + 1);

        assertEq(excessETH.excessETH(), 99 ether);
    }

    function test_excessETH_expectedValueGreaterThanTreasury_returnsZero() public {
        vm.deal(address(treasury), 10 ether);
        dao.setAdjustedTotalSupply(100);
        setMeanPrice(1 ether);
        vm.warp(waitingPeriodEnd + 1);

        assertEq(excessETH.excessETH(), 0);
    }

    function test_excessETH_excessGreaterThanBalance_returnsBalance() public {
        vm.deal(address(treasury), 1 ether);
        dao.setAdjustedTotalSupply(1);
        setMeanPrice(1 ether);
        vm.warp(waitingPeriodEnd + 1);
        ERC20Mock(address(excessETH.stETH())).mint(address(treasury), 100 ether);

        assertEq(excessETH.excessETH(), 1 ether);
    }

    function setMeanPrice(uint256 meanPrice) internal {
        uint256[] memory prices = new uint256[](pastAuctionCount);
        for (uint256 i = 0; i < pastAuctionCount; i++) {
            prices[i] = meanPrice;
        }
        auction.setPrices(prices);
    }
}
