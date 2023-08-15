// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IRepTokens } from './IRepTokens.sol';
import { ERC1155Holder } from '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

contract CadentRepDistributor is ERC1155Holder {
    error CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();
    IRepTokens s_rep;

    uint256 s_amountToDistributePerCadence;
    uint256 s_cadence;

    mapping(address => uint256) addressToLastClaimDate;

    event DistributedRep(address indexed recipient);

    constructor(address rep, uint256 amountDistributedPerCadence, uint256 cadenceCycle) {
        s_rep = IRepTokens(rep);
        s_amountToDistributePerCadence = amountDistributedPerCadence;
        s_cadence = cadenceCycle;
    }

    function claim() external {
        if (getRemainingTime(msg.sender) > 0) revert CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();

        s_rep.distribute(address(this), msg.sender, s_amountToDistributePerCadence, '');

        addressToLastClaimDate[msg.sender] = block.timestamp;
        emit DistributedRep(msg.sender);
    }

    function getRemainingTime(address addr) public view returns (int) {
        int lastClaimTime = int(addressToLastClaimDate[addr]);
        return lastClaimTime != 0 ? (lastClaimTime + int(s_cadence) - int(block.timestamp)) : int(0);
    }

    function getAmountToDistributePerCadence() external view returns (uint256) {
        return s_amountToDistributePerCadence;
    }

    function getCadence() external view returns (uint256) {
        return s_cadence;
    }
}
