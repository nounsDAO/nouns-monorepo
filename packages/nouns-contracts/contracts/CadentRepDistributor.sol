// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IRepTokens } from './IRepTokens.sol';
import { ERC1155Holder } from '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

contract CadentRepDistributor is ERC1155Holder {
    error CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();
    IRepTokens s_rep;

    uint256 s_amountDistributedPerCadenceCycle;
    uint256 s_cadenceCycle;

    mapping(address => uint256) addressToLastClaimDate;

    event DistributedRep(address indexed recipient);

    constructor(address rep, uint256 amountDistributedPerCadence, uint256 cadenceCycle) {
        s_rep = IRepTokens(rep);
        s_amountDistributedPerCadenceCycle = amountDistributedPerCadence;
        s_cadenceCycle = cadenceCycle;
    }

    function claim() external {
        if (!canClaim()) revert CadentRepDistributor__NOT_ENOUGH_TIME_PASSED();

        s_rep.distribute(address(this), msg.sender, s_amountDistributedPerCadenceCycle, '');

        addressToLastClaimDate[msg.sender] = block.timestamp;
        emit DistributedRep(msg.sender);
    }

    function canClaim() public view returns (bool) {
        uint lastClaimTime = addressToLastClaimDate[msg.sender];
        return lastClaimTime != 0 ? (block.timestamp >= (lastClaimTime + s_cadenceCycle)) : true;
    }

    function getRemainingTime() external view returns (int) {
        int lastClaimTime = int(addressToLastClaimDate[msg.sender]);
        return lastClaimTime != 0 ? (lastClaimTime + int(s_cadenceCycle) - int(block.timestamp)) : int(0);
    }

    function getAmountDistributedPerCadenceCycle() external view returns (uint256) {
        return s_amountDistributedPerCadenceCycle;
    }

    function getCadenceCycle() external view returns (uint256) {
        return s_cadenceCycle;
    }
}
