// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IRepTokens } from './IRepTokens.sol';
import { ERC1155Holder } from '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

contract CadentRepDistributor is ERC1155Holder {
    error CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();
    IRepTokens s_rep;

    uint256 s_amountDistributedPerDay;
    uint256 s_numOfTotalSecondsToClaimFromLastClaim;

    mapping(address => uint256) addressToLastClaimDate;

    event DistributedRep(address indexed recipient);

    constructor(address rep, uint256 amountDistributedPerDay, uint256 numOfTotalSecondsToClaimFromLastClaim) {
        s_rep = IRepTokens(rep);
        s_amountDistributedPerDay = amountDistributedPerDay;
        s_numOfTotalSecondsToClaimFromLastClaim = numOfTotalSecondsToClaimFromLastClaim;
    }

    function claim() external {
        if (!canClaim()) revert CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();

        s_rep.distribute(address(this), msg.sender, s_amountDistributedPerDay, '');

        addressToLastClaimDate[msg.sender] = block.timestamp;
        emit DistributedRep(msg.sender);
    }

    function canClaim() public view returns (bool) {
        uint lastClaimTime = addressToLastClaimDate[msg.sender];
        return
            lastClaimTime != 0 ? (block.timestamp >= (lastClaimTime + s_numOfTotalSecondsToClaimFromLastClaim)) : true;
    }

    function getRemainingTime() external view returns (int) {
        int lastClaimTime = int(addressToLastClaimDate[msg.sender]);
        return
            lastClaimTime != 0
                ? (lastClaimTime + int(s_numOfTotalSecondsToClaimFromLastClaim) - int(block.timestamp))
                : int(0);
    }
}
