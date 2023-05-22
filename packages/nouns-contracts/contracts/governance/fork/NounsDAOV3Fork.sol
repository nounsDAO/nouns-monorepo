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

import { NounsDAOStorageV3, INounsDAOForkEscrow, INounsDAOExecutorV2 } from '../NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { NounsTokenFork } from './newdao/token/NounsTokenFork.sol';

library NounsDAOV3Fork {
    error ForkThresholdNotMet();
    error ForkPeriodNotActive();
    error ForkPeriodActive();
    error AdminOnly();

    /// @notice Emitted when someones adds nouns to the fork escrow
    event EscrowedToFork(address indexed owner, uint256[] tokenIds, uint256[] proposalIds, string reason);

    /// @notice Emitted when the owner withdraws their nouns from the fork escrow
    event WithdrawFromForkEscrow(address indexed owner, uint256[] tokenIds);

    /// @notice Emitted when the fork is executed and the forking period begins
    event ExecuteFork(
        uint32 forkId,
        address forkTreasury,
        address forkToken,
        uint256 forkEndTimestamp,
        uint256 tokensInEscrow
    );

    /// @notice Emitted when someone joins a fork during the forking period
    event JoinFork(address indexed owner, uint256[] tokenIds);

    /// @notice Emitted when the DAO withdraws nouns from the fork escrow after a fork has been executed
    event DAOWithdrawNounsFromEscrow(uint256[] tokenIds, address to);

    function escrowToFork(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256[] calldata tokenIds,
        uint256[] calldata proposalIds,
        string calldata reason
    ) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();
        INounsDAOForkEscrow forkEscrow = ds.forkEscrow;

        forkEscrow.markOwner(msg.sender, tokenIds);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(forkEscrow), tokenIds[i]);
        }

        emit EscrowedToFork(msg.sender, tokenIds, proposalIds, reason);
    }

    function withdrawFromForkEscrow(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();

        ds.forkEscrow.returnTokensToOwner(msg.sender, tokenIds);

        emit WithdrawFromForkEscrow(msg.sender, tokenIds);
    }

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

    function joinFork(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (!isForkPeriodActive(ds)) revert ForkPeriodNotActive();

        sendProRataTreasury(ds, ds.forkDAOTreasury, tokenIds.length, adjustedTotalSupply(ds));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(ds.forkEscrow), tokenIds[i]);
        }

        NounsTokenFork(ds.forkDAOToken).claimDuringForkPeriod(msg.sender, tokenIds);

        emit JoinFork(msg.sender, tokenIds);
    }

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

    function forkThreshold(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return (adjustedTotalSupply(ds) * ds.forkThresholdBPS) / 10_000;
    }

    function adjustedTotalSupply(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return ds.nouns.totalSupply() - ds.nouns.balanceOf(address(ds.timelock)) - ds.forkEscrow.numTokensOwnedByDAO();
    }

    function isForkPeriodActive(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (bool) {
        return ds.forkEndTimestamp > block.timestamp;
    }

    function sendProRataTreasury(
        NounsDAOStorageV3.StorageV3 storage ds,
        address newDAOTreasury,
        uint256 tokenCount,
        uint256 totalSupply
    ) internal {
        INounsDAOExecutorV2 timelock = ds.timelock;
        uint256 ethToSend = (address(timelock).balance * tokenCount) / totalSupply;

        timelock.sendETH(newDAOTreasury, ethToSend);

        uint256 erc20Count = ds.erc20TokensToIncludeInFork.length;
        for (uint256 i = 0; i < erc20Count; ++i) {
            IERC20 erc20token = IERC20(ds.erc20TokensToIncludeInFork[i]);
            uint256 tokensToSend = (erc20token.balanceOf(address(timelock)) * tokenCount) / totalSupply;
            timelock.sendERC20(newDAOTreasury, address(erc20token), tokensToSend);
        }
    }
}
