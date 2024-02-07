// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import { INounsDAOLogic } from '../interfaces/INounsDAOLogic.sol';

contract MaliciousVoter {
    INounsDAOLogic public dao;
    uint256 public proposalId;
    uint8 public support;
    bool useReason;

    constructor(INounsDAOLogic dao_, uint256 proposalId_, uint8 support_, bool useReason_) {
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

    receive() external payable {
        castVote();
    }
}
