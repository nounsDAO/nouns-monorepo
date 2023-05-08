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

import { ERC1967Proxy } from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import { IForkDAODeployer, INounsDAOForkEscrow, NounsDAOStorageV3 } from '../NounsDAOInterfaces.sol';
import { NounsTokenFork } from './newdao/token/NounsTokenFork.sol';
import { NounsAuctionHouseFork } from './newdao/NounsAuctionHouseFork.sol';
import { NounsDAOExecutorV2 } from '../NounsDAOExecutorV2.sol';
import { NounsDAOProxy } from '../NounsDAOProxy.sol';
import { NounsDAOLogicV3 } from '../NounsDAOLogicV3.sol';
import { NounsDAOLogicV1Fork } from './newdao/governance/NounsDAOLogicV1Fork.sol';
import { NounsToken } from '../../NounsToken.sol';
import { NounsAuctionHouse } from '../../NounsAuctionHouse.sol';

contract ForkDAODeployer is IForkDAODeployer {
    event DAODeployed(address token, address auction, address governor, address treasury);

    /// @notice The token implementation address
    address public tokenImpl;

    /// @notice The auction house implementation address
    address public auctionImpl;

    /// @notice The treasury implementation address
    address public treasuryImpl;

    /// @notice The governor implementation address
    address public governorImpl;

    /// @notice The address of the fork escrow contract
    address public forkEscrowAddress;

    /// @notice The maximum duration of the governance delay in new DAOs
    uint256 public delayedGovernanceMaxDuration;

    constructor(
        address tokenImpl_,
        address auctionImpl_,
        address governorImpl_,
        address treasuryImpl_,
        address forkEscrowAddress_,
        uint256 delayedGovernanceMaxDuration_
    ) {
        tokenImpl = tokenImpl_;
        auctionImpl = auctionImpl_;
        governorImpl = governorImpl_;
        treasuryImpl = treasuryImpl_;
        forkEscrowAddress = forkEscrowAddress_;
        delayedGovernanceMaxDuration = delayedGovernanceMaxDuration_;
    }

    function deployForkDAO() external returns (address treasury, address token) {
        token = address(new ERC1967Proxy(tokenImpl, ''));
        address auction = address(new ERC1967Proxy(auctionImpl, ''));
        address governor = address(new ERC1967Proxy(governorImpl, ''));
        treasury = address(new ERC1967Proxy(treasuryImpl, ''));

        INounsDAOForkEscrow forkEscrow = INounsDAOForkEscrow(forkEscrowAddress);
        NounsToken originalToken = NounsToken(address(forkEscrow.nounsToken()));
        NounsAuctionHouse originalAuction = NounsAuctionHouse(originalToken.minter());
        NounsDAOExecutorV2 originalTimelock = NounsDAOExecutorV2(payable(originalToken.owner()));
        NounsDAOLogicV3 originalDAO = NounsDAOLogicV3(payable(originalTimelock.admin()));

        NounsTokenFork(token).initialize(
            treasury,
            auction,
            forkEscrow,
            forkEscrow.forkId(),
            getStartNounId(originalAuction),
            forkEscrow.numTokensInEscrow()
        );

        NounsAuctionHouseFork(auction).initialize(
            treasury,
            NounsToken(token),
            originalAuction.weth(),
            originalAuction.timeBuffer(),
            originalAuction.reservePrice(),
            originalAuction.minBidIncrementPercentage(),
            originalAuction.duration()
        );

        NounsDAOStorageV3.DynamicQuorumParams memory dqParams = originalDAO.getDynamicQuorumParamsAt(block.number);
        NounsDAOLogicV1Fork(governor).initialize(
            treasury,
            token,
            address(0),
            originalDAO.votingPeriod(),
            originalDAO.votingDelay(),
            originalDAO.proposalThresholdBPS(),
            dqParams.minQuorumVotesBPS,
            originalDAO.erc20TokensToIncludeInFork(),
            block.timestamp + delayedGovernanceMaxDuration
        );

        NounsDAOExecutorV2(payable(treasury)).initialize(governor, originalTimelock.delay());

        emit DAODeployed(token, auction, governor, treasury);
    }

    function getStartNounId(NounsAuctionHouse originalAuction) internal view returns (uint256) {
        (uint256 nounId, , , , , ) = originalAuction.auction();
        return nounId;
    }
}
