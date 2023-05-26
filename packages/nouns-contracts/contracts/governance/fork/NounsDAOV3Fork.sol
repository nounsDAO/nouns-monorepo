// SPDX-License-Identifier: GPL-3.0

/// @title Library for NounsDAOLogicV3 contract containing the dao fork logic

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

import { NounsDAOStorageV3, INounsDAOForkEscrow, INounsDAOExecutorV2 } from '../NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { NounsTokenFork } from './newdao/token/NounsTokenFork.sol';

library NounsDAOV3Fork {
    error ForkThresholdNotMet();
    error ForkPeriodNotActive();
    error ForkPeriodActive();
    error AdminOnly();
    error ETHTransferFailed();
    error ERC20TransferFailed();

    /// @notice Emitted when someones adds nouns to the fork escrow
    event EscrowedToFork(
        address indexed owner,
        uint256[] tokenIds,
        uint256[] proposalIds,
        string reason,
        uint32 forkId
    );

    /// @notice Emitted when the owner withdraws their nouns from the fork escrow
    event WithdrawFromForkEscrow(address indexed owner, uint256[] tokenIds, uint32 forkId);

    /// @notice Emitted when the fork is executed and the forking period begins
    event ExecuteFork(
        uint32 forkId,
        address forkTreasury,
        address forkToken,
        uint256 forkEndTimestamp,
        uint256 tokensInEscrow
    );

    /// @notice Emitted when someone joins a fork during the forking period
    event JoinFork(address indexed owner, uint256[] tokenIds, uint256[] proposalIds, string reason, uint32 forkId);

    /// @notice Emitted when the DAO withdraws nouns from the fork escrow after a fork has been executed
    event DAOWithdrawNounsFromEscrow(uint256[] tokenIds, address to);

    /**
     * @notice Escrow Nouns to contribute to the fork threshold
     * @dev Requires approving the tokenIds or the entire noun token to the DAO contract
     * @param tokenIds the tokenIds to escrow. They will be sent to the DAO once the fork threshold is reached and the escrow is closed.
     * @param proposalIds array of proposal ids which are the reason for wanting to fork. This will only be used to emit event.
     * @param reason the reason for want to fork. This will only be used to emit event.
     */
    function escrowToFork(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256[] calldata tokenIds,
        uint256[] calldata proposalIds,
        string calldata reason
    ) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();
        INounsDAOForkEscrow forkEscrow = ds.forkEscrow;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.safeTransferFrom(msg.sender, address(forkEscrow), tokenIds[i]);
        }

        emit EscrowedToFork(msg.sender, tokenIds, proposalIds, reason, forkEscrow.forkId());
    }

    /**
     * @notice Withdraw Nouns from the fork escrow. Only possible if the fork has not been executed.
     * Only allowed to withdraw tokens that the sender has escrowed.
     * @param tokenIds the tokenIds to withdraw
     */
    function withdrawFromForkEscrow(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();

        INounsDAOForkEscrow forkEscrow = ds.forkEscrow;
        forkEscrow.returnTokensToOwner(msg.sender, tokenIds);

        emit WithdrawFromForkEscrow(msg.sender, tokenIds, forkEscrow.forkId());
    }

    /**
     * @notice Execute the fork. Only possible if the fork threshold has been met.
     * This will deploy a new DAO and send the prorated part of the treasury to the new DAO's treasury.
     * This will also close the active escrow and all nouns in the escrow will belong to the original DAO.
     * @return forkTreasury The address of the new DAO's treasury
     * @return forkToken The address of the new DAO's token
     */
    function executeFork(NounsDAOStorageV3.StorageV3 storage ds)
        external
        returns (address forkTreasury, address forkToken)
    {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();
        INounsDAOForkEscrow forkEscrow = ds.forkEscrow;

        uint256 tokensInEscrow = forkEscrow.numTokensInEscrow();
        if (tokensInEscrow < forkThreshold(ds)) revert ForkThresholdNotMet();

        uint256 forkEndTimestamp = block.timestamp + ds.forkPeriod;

        (forkTreasury, forkToken) = ds.forkDAODeployer.deployForkDAO(forkEndTimestamp, forkEscrow);
        sendProRataTreasury(ds, forkTreasury, tokensInEscrow, adjustedTotalSupply(ds));
        uint32 forkId = forkEscrow.closeEscrow();

        ds.forkDAOTreasury = forkTreasury;
        ds.forkDAOToken = forkToken;
        ds.forkEndTimestamp = forkEndTimestamp;

        emit ExecuteFork(forkId, forkTreasury, forkToken, forkEndTimestamp, tokensInEscrow);
    }

    /**
     * @notice Joins a fork while a fork is active
     * Sends the tokens to the escrow contract.
     * Sends a prorated part of the treasury to the new fork DAO's treasury.
     * Mints new tokens in the new fork DAO with the same token ids.
     * @param tokenIds the tokenIds to send to the DAO in exchange for joining the fork
     */
    function joinFork(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256[] calldata tokenIds,
        uint256[] calldata proposalIds,
        string calldata reason
    ) external {
        if (!isForkPeriodActive(ds)) revert ForkPeriodNotActive();

        INounsDAOForkEscrow forkEscrow = ds.forkEscrow;
        sendProRataTreasury(ds, ds.forkDAOTreasury, tokenIds.length, adjustedTotalSupply(ds));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(forkEscrow), tokenIds[i]);
        }

        NounsTokenFork(ds.forkDAOToken).claimDuringForkPeriod(msg.sender, tokenIds);

        emit JoinFork(msg.sender, tokenIds, proposalIds, reason, forkEscrow.forkId() - 1);
    }

    /**
     * @notice Withdraws nouns from the fork escrow after the fork has been executed
     * @dev Only the DAO can call this function
     * @param tokenIds the tokenIds to withdraw
     * @param to the address to send the nouns to
     */
    function withdrawDAONounsFromEscrow(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256[] calldata tokenIds,
        address to
    ) external {
        if (msg.sender != ds.admin) {
            revert AdminOnly();
        }

        ds.forkEscrow.withdrawTokensToDAO(tokenIds, to);

        emit DAOWithdrawNounsFromEscrow(tokenIds, to);
    }

    /**
     * @notice Returns the required number of tokens to escrow to trigger a fork
     */
    function forkThreshold(NounsDAOStorageV3.StorageV3 storage ds) public view returns (uint256) {
        return (adjustedTotalSupply(ds) * ds.forkThresholdBPS) / 10_000;
    }

    /**
     * @notice Returns the number of tokens currently in escrow, contributing to the fork threshold
     */
    function numTokensInForkEscrow(NounsDAOStorageV3.StorageV3 storage ds) public view returns (uint256) {
        return ds.forkEscrow.numTokensInEscrow();
    }

    /**
     * @notice Returns the number of nouns in supply minus nouns owned by the DAO, i.e. held in the treasury or in an
     * escrow after it has closed.
     * This is used when calculating proposal threshold, quorum, fork threshold & treasury split.
     */
    function adjustedTotalSupply(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return ds.nouns.totalSupply() - ds.nouns.balanceOf(address(ds.timelock)) - ds.forkEscrow.numTokensOwnedByDAO();
    }

    function isForkPeriodActive(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (bool) {
        return ds.forkEndTimestamp > block.timestamp;
    }

    /**
     * @notice Sends part of the DAO's treasury to the `newDAOTreasury` address.
     * The amount sent is proportional to the `tokenCount` out of `totalSupply`.
     * Sends ETH and ERC20 tokens listed in `ds.erc20TokensToIncludeInFork`.
     */
    function sendProRataTreasury(
        NounsDAOStorageV3.StorageV3 storage ds,
        address newDAOTreasury,
        uint256 tokenCount,
        uint256 totalSupply
    ) internal {
        INounsDAOExecutorV2 timelock = ds.timelock;
        uint256 ethToSend = (address(timelock).balance * tokenCount) / totalSupply;

        bool ethSent = timelock.sendETH(newDAOTreasury, ethToSend);
        if (!ethSent) revert ETHTransferFailed();

        uint256 erc20Count = ds.erc20TokensToIncludeInFork.length;
        for (uint256 i = 0; i < erc20Count; ++i) {
            IERC20 erc20token = IERC20(ds.erc20TokensToIncludeInFork[i]);
            uint256 tokensToSend = (erc20token.balanceOf(address(timelock)) * tokenCount) / totalSupply;
            bool erc20Sent = timelock.sendERC20(newDAOTreasury, address(erc20token), tokensToSend);
            if (!erc20Sent) revert ERC20TransferFailed();
        }
    }
}
