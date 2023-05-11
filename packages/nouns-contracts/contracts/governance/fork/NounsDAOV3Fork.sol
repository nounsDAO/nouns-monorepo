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

import { NounsDAOStorageV3, INounsDAOForkEscrow } from '../NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { NounsTokenFork } from './newdao/token/NounsTokenFork.sol';

library NounsDAOV3Fork {
    error ForkThresholdNotMet();
    error ForkPeriodNotActive();
    error ForkPeriodActive();
    error AdminOnly();

    // TODO: events

    function escrowToFork(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();

        ds.forkEscrow.markOwner(msg.sender, tokenIds);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(ds.forkEscrow), tokenIds[i]);
        }
    }

    // TODO: do we need a `to` param?
    function withdrawFromForkEscrow(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();

        ds.forkEscrow.returnTokensToOwner(msg.sender, tokenIds);
    }

    function executeFork(NounsDAOStorageV3.StorageV3 storage ds)
        external
        returns (address forkTreasury, address forkToken)
    {
        if (isForkPeriodActive(ds)) revert ForkPeriodActive();

        uint256 tokensInEscrow = ds.forkEscrow.numTokensInEscrow();
        if (tokensInEscrow < forkThreshold(ds)) revert ForkThresholdNotMet();

        (forkTreasury, forkToken) = ds.forkDAODeployer.deployForkDAO();
        sendProRataTreasury(ds, forkTreasury, tokensInEscrow, adjustedTotalSupply(ds));
        ds.forkEscrow.closeEscrow();

        ds.forkDAOTreasury = forkTreasury;
        ds.forkDAOToken = forkToken;
        ds.forkEndTimestamp = block.timestamp + ds.forkPeriod;
    }

    function joinFork(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (!isForkPeriodActive(ds)) revert ForkPeriodNotActive();

        sendProRataTreasury(ds, ds.forkDAOTreasury, tokenIds.length, adjustedTotalSupply(ds));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(ds.timelock), tokenIds[i]);
        }

        NounsTokenFork(ds.forkDAOToken).claimDuringForkPeriod(msg.sender, tokenIds);
    }

    function withdrawForkTokensToDAO(
        NounsDAOStorageV3.StorageV3 storage ds,
        uint256[] calldata tokenIds,
        address to
    ) external {
        if (msg.sender != ds.admin) {
            revert AdminOnly();
        }

        ds.forkEscrow.withdrawTokensToDAO(tokenIds, to);
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
        uint256 ethToSend = (address(ds.timelock).balance * tokenCount) / totalSupply;

        ds.timelock.sendETHToNewDAO(newDAOTreasury, ethToSend);

        for (uint256 i = 0; i < ds.erc20TokensToIncludeInFork.length; i++) {
            IERC20 erc20token = IERC20(ds.erc20TokensToIncludeInFork[i]);
            uint256 tokensToSend = (erc20token.balanceOf(address(ds.timelock)) * tokenCount) / totalSupply;
            ds.timelock.sendERC20ToNewDAO(newDAOTreasury, address(erc20token), tokensToSend);
        }
    }
}
