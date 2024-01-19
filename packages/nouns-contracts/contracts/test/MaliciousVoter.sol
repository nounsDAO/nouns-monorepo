// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import { NounsDAOLogicV2 } from '../governance/NounsDAOLogicV2.sol';

contract MaliciousVoter {
    NounsDAOLogicV2 public dao;
    uint256 public proposalId;
    uint8 public support;
    bool useReason;

    constructor(
        NounsDAOLogicV2 dao_,
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

    receive() external payable {
        castVote();
    }
}
