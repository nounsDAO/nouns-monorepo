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

import { NounsDAOStorageV3, INounsDAOSplitEscrow } from '../NounsDAOInterfaces.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

library NounsDAOV3Split {

    error SplitThresholdNotMet();
    error SplitPeriodNotActive();
    error SplitPeriodActive();

    // TODO: events

    uint256 constant SPLIT_PERIOD_DURTION = 7 days; // TODO: should this be configurable?
    uint256 constant SPLIT_THRESHOLD_BPS = 2_000; // 20% TODO: should this be configurable?

    function signalSplit(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isSplitPeriodActive(ds)) revert SplitPeriodActive();

        ds.splitEscrow.markOwner(msg.sender, tokenIds);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(ds.splitEscrow), tokenIds[i]);
        }
    }

    // TODO: do we need a `to` param?
    function unsignalSplit(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (isSplitPeriodActive(ds)) revert SplitPeriodActive();

        ds.splitEscrow.returnTokensToOwner(msg.sender, tokenIds);
    }

    function executeSplit(NounsDAOStorageV3.StorageV3 storage ds) external {
        if (isSplitPeriodActive(ds)) revert SplitPeriodActive();

        uint256 tokensInEscrow = ds.splitEscrow.numTokensInEscrow();
        if (tokensInEscrow < splitThreshold(ds)) revert SplitThresholdNotMet();

        ds.splitDAOTreasury = ds.splitDAODeployer.deploySplitDAO();
        sendProRataTreasury(ds, ds.splitDAOTreasury, tokensInEscrow, adjustedTotalSupply(ds));

        ds.splitEscrow.closeEscrow();

        ds.splitEndTimestamp = block.timestamp + SPLIT_PERIOD_DURTION;
    }

    function joinSplit(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        if (!isSplitPeriodActive(ds)) revert SplitPeriodNotActive();

        sendProRataTreasury(ds, ds.splitDAOTreasury, tokenIds.length, adjustedTotalSupply(ds));

        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(ds.timelock), tokenIds[i]);
        }
    }

    function withdrawSplitTokensToDAO(
        NounsDAOStorageV3.StorageV3 storage ds, 
        uint256[] calldata tokenIds
    ) external {
        // TODO: should this be limited to only timelock. maybe the timelock should call the escrow directly?

        // TODO: include a `to` param above?
        ds.splitEscrow.withdrawTokensToDAO(tokenIds, address(ds.timelock));
    }

    function splitThreshold(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return adjustedTotalSupply(ds) * SPLIT_THRESHOLD_BPS / 10_000;
    }

    function adjustedTotalSupply(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        return ds.nouns.totalSupply() - ds.nouns.balanceOf(address(ds.timelock)) - ds.splitEscrow.numTokensOwnedByDAO();
    }

    function isSplitPeriodActive(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (bool) {
        return ds.splitEndTimestamp > block.timestamp;
    }

    function sendProRataTreasury(
        NounsDAOStorageV3.StorageV3 storage ds, 
        address newDAOTreasury, 
        uint256 tokenCount, 
        uint256 totalSupply
    ) internal {
        uint256 ethToSend = address(ds.timelock).balance * tokenCount / totalSupply;

        ds.timelock.sendETHToNewDAO(newDAOTreasury, ethToSend);

        for (uint256 i = 0; i < ds.erc20TokensToIncludeInSplit.length; i++) {
            IERC20 erc20token = IERC20(ds.erc20TokensToIncludeInSplit[i]);
            uint256 tokensToSend = erc20token.balanceOf(address(ds.timelock)) * tokenCount / totalSupply;
            ds.timelock.sendERC20ToNewDAO(newDAOTreasury, address(erc20token), tokensToSend);
        }
    }
}