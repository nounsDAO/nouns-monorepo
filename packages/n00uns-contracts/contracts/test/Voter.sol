// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import { N00unsDAOLogicV2 } from '../governance/N00unsDAOLogicV2.sol';

/**
 * @dev this contract is used to simulate voting via a multisig
 */
contract Voter {
    N00unsDAOLogicV2 public dao;
    uint256 public proposalId;
    uint8 public support;
    bool useReason;

    constructor(
        N00unsDAOLogicV2 dao_,
        uint256 proposalId_,
        uint8 support_,
        bool useReason_
    ) {
        dao = dao_;
        proposalId = proposalId_;
        support = support_;
        useReason = useReason_;
    }

    function castVote() public {
        if (useReason) {
            dao.castRefundableVoteWithReason(proposalId, support, 'some reason');
        } else {
            dao.castRefundableVote(proposalId, support);
        }
    }
}
