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

import { NounsDAOStorageV3 } from '../NounsDAOInterfaces.sol';
import { NounsDAOSplitEscrow } from './NounsDAOSplitEscrow.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

library NounsDAOV3Split {

    error SplitThresholdNotMet();

    function signalSplit(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        // TODO: require !splitPeriodActive()

        // TODO: include split id in mapping
        NounsDAOSplitEscrow escrow = NounsDAOSplitEscrow(ds.splitEscrow[msg.sender]);
        if (address(escrow) == address(0)) {
            escrow = new NounsDAOSplitEscrow(msg.sender, address(ds.nouns));
            ds.splitEscrow[msg.sender] = address(escrow);
        }
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            ds.nouns.transferFrom(msg.sender, address(escrow), tokenIds[i]);
        }

        // TODO safecast
        ds.nounsInSplitEscrow += uint32(tokenIds.length);
    }

    // TODO: do we need a `to` param?
    function unsignalSplit(NounsDAOStorageV3.StorageV3 storage ds, uint256[] calldata tokenIds) external {
        // TODO: require !splitPeriodActive()

        NounsDAOSplitEscrow escrow = NounsDAOSplitEscrow(ds.splitEscrow[msg.sender]);
        escrow.returnTokensToOwner(tokenIds);

        // TODO safecast
        ds.nounsInSplitEscrow -= uint32(tokenIds.length);
    }

    function executeSplit(NounsDAOStorageV3.StorageV3 storage ds) external {
        if (ds.nounsInSplitEscrow < splitThreshold(ds)) revert SplitThresholdNotMet();

        address newDAOTreasury = ds.splitDAOdeployer.deploySplitDAO();
        sendProRataTreasury(ds, newDAOTreasury, ds.nounsInSplitEscrow, adjustedTotalSupply(ds));
    }

    function splitThreshold(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        // TODO: make this constant or configurable param
        return adjustedTotalSupply(ds) * 20 / 100;
    }

    function adjustedTotalSupply(NounsDAOStorageV3.StorageV3 storage ds) internal view returns (uint256) {
        // TODO: don't count nouns in treasury / held by DAO
        return ds.nouns.totalSupply();
    }

    function sendProRataTreasury(NounsDAOStorageV3.StorageV3 storage ds, address newDAOTreasury, uint256 tokenCount, uint256 totalSupply) internal {
        uint256 ethToSend = address(ds.timelock).balance * tokenCount / totalSupply;

        ds.timelock.sendETHToNewDAO(newDAOTreasury, ethToSend);

        for (uint256 i = 0; i < ds.erc20TokensToIncludeInSplit.length; i++) {
            IERC20 erc20token = IERC20(ds.erc20TokensToIncludeInSplit[i]);
            uint256 tokensToSend = erc20token.balanceOf(address(ds.timelock)) * tokenCount / totalSupply;
            ds.timelock.sendERC20ToNewDAO(newDAOTreasury, address(erc20token), tokensToSend);
        }
    }
}