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
import { NounsDAOProxy } from '../NounsDAOProxy.sol';
import { NounsDAOLogicV1 } from '../NounsDAOLogicV1.sol';
import { NounsDAOLogicV1Fork } from './newdao/governance/NounsDAOLogicV1Fork.sol';

contract SplitDAODeployer is ISplitDAODeployer {
    event DAODeployed(address token, address auction, address governor, address treasury);

    /// @notice The token implementation address
    address public tokenImpl;

    /// @notice The auction house implementation address
    address public auctionImpl;

    /// @notice The treasury implementation address
    address public treasuryImpl;

    /// @notice The governor implementation address
    address public governorImpl;

    /// @notice The address of the split escrow contract
    address public splitEscrowAddress;

    /// @notice The maximum duration of the governance delay in new DAOs
    uint256 public delayedGovernanceMaxDuration;

    constructor(
        address tokenImpl_,
        address auctionImpl_,
        address governorImpl_,
        address treasuryImpl_,
        address splitEscrowAddress_,
        uint256 delayedGovernanceMaxDuration_
    ) {
        tokenImpl = tokenImpl_;
        auctionImpl = auctionImpl_;
        governorImpl = governorImpl_;
        treasuryImpl = treasuryImpl_;
        splitEscrowAddress = splitEscrowAddress_;
        delayedGovernanceMaxDuration = delayedGovernanceMaxDuration_;
    }

    function deploySplitDAO() external returns (address treasury) {
        address token = address(new ERC1967Proxy(tokenImpl, ''));
        address auction = address(new ERC1967Proxy(auctionImpl, ''));
        address governor = address(new ERC1967Proxy(auctionImpl, ''));
        treasury = address(new ERC1967Proxy(treasuryImpl, ''));

        INounsDAOSplitEscrow splitEscrow = INounsDAOSplitEscrow(splitEscrowAddress);
        NounsToken originalToken = NounsToken(address(splitEscrow.nounsToken()));
        NounsAuctionHouse originalAuction = NounsAuctionHouse(originalToken.minter());
        NounsDAOExecutorV2 originalTimelock = NounsDAOExecutorV2(payable(originalToken.owner()));
        NounsDAOLogicV1 originalDAO = NounsDAOLogicV1(originalTimelock.admin());

        NounsToken(token).initialize(
            treasury,
            auction,
            splitEscrow,
            splitEscrow.splitId(),
            getStartNounId(originalAuction),
            splitEscrow.numTokensInEscrow()
        );

        NounsAuctionHouse(auction).initialize(
            treasury,
            NounsToken(token),
            originalAuction.weth(),
            originalAuction.timeBuffer(),
            originalAuction.reservePrice(),
            originalAuction.minBidIncrementPercentage(),
            originalAuction.duration()
        );

        NounsDAOLogicV1Fork(governor).initialize(
            treasury,
            token,
            address(0),
            originalDAO.votingPeriod(),
            originalDAO.votingDelay(),
            originalDAO.proposalThresholdBPS(),
            originalDAO.quorumVotesBPS(),
            block.timestamp + delayedGovernanceMaxDuration
        );

        NounsDAOExecutorV2(payable(treasury)).initialize(governor, originalTimelock.delay());

        emit DAODeployed(token, auction, governor, treasury);

        return treasury;
    }

    function getStartNounId(NounsAuctionHouse originalAuction) internal view returns (uint256) {
        (uint256 nounId, , , , , ) = originalAuction.auction();
        return nounId;
    }
}
