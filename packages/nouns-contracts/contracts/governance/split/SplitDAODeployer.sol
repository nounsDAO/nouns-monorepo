// SPDX-License-Identifier: GPL-3.0

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import { ISplitDAODeployer, INounsDAOSplitEscrow } from '../NounsDAOInterfaces.sol';
import { NounsToken } from './newdao/token/NounsToken.sol';
import { NounsAuctionHouse } from './newdao/NounsAuctionHouse.sol';
import { NounsDAOExecutorV2 } from '../NounsDAOExecutorV2.sol';

contract SplitDAODeployer is ISplitDAODeployer {
    /// @notice The token implementation address
    address public tokenImpl;

    /// @notice The auction house implementation address
    address public auctionImpl;

    /// @notice The treasury implementation address
    address public treasuryImpl;

    /// @notice The governor implementation address
    address public governorImpl;

    function deploySplitDAO(address splitEscrowAddress) external returns (address treasury) {
        // TODO

        address token = address(new ERC1967Proxy(tokenImpl, ''));
        address auction = address(new ERC1967Proxy(auctionImpl, ''));
        treasury = address(new ERC1967Proxy(treasuryImpl, ''));
        address governor = address(new ERC1967Proxy(governorImpl, ''));

        INounsDAOSplitEscrow splitEscrow = INounsDAOSplitEscrow(splitEscrowAddress);
        NounsToken originalToken = NounsToken(address(splitEscrow.nounsToken()));
        NounsAuctionHouse originalAuction = NounsAuctionHouse(originalToken.minter());

        NounsToken(token).initialize(
            auction,
            splitEscrow,
            splitEscrow.splitId(),
            getStartNounId(originalAuction),
            splitEscrow.numTokensInEscrow()
        );

        NounsAuctionHouse(auction).initialize(
            NounsToken(token),
            originalAuction.weth(),
            originalAuction.timeBuffer(),
            originalAuction.reservePrice(),
            originalAuction.minBidIncrementPercentage(),
            originalAuction.duration()
        );

        NounsDAOExecutorV2(payable(treasury)).initialize(
            governor,
            NounsDAOExecutorV2(payable(originalToken.owner())).delay()
        );

        return treasury;
    }

    function getStartNounId(NounsAuctionHouse originalAuction) internal view returns (uint256) {
        (uint256 nounId, , , , , ) = originalAuction.auction();
        return nounId;
    }
}
