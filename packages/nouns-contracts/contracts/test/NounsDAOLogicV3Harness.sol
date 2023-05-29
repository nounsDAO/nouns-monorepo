// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import '../governance/NounsDAOLogicV3.sol';
import { NounsDAOV3Admin } from '../governance/NounsDAOV3Admin.sol';

contract NounsDAOLogicV3Harness is NounsDAOLogicV3 {
    using NounsDAOV3Admin for StorageV3;

    function initialize(
        address timelock_,
        address nouns_,
        address forkEscrow_,
        address forkDAODeployer_,
        address vetoer_,
        NounsDAOParams calldata daoParams_,
        DynamicQuorumParams calldata dynamicQuorumParams_
    ) public override {
        if (address(ds.timelock) != address(0)) revert CanOnlyInitializeOnce();
        if (msg.sender != ds.admin) revert AdminOnly();
        if (timelock_ == address(0)) revert InvalidTimelockAddress();
        if (nouns_ == address(0)) revert InvalidNounsAddress();

        ds.votingPeriod = daoParams_.votingPeriod;
        ds.votingDelay = daoParams_.votingDelay;
        ds.proposalThresholdBPS = daoParams_.proposalThresholdBPS;
        ds.timelock = INounsDAOExecutorV2(timelock_);
        ds.nouns = NounsTokenLike(nouns_);
        ds.forkEscrow = INounsDAOForkEscrow(forkEscrow_);
        ds.forkDAODeployer = IForkDAODeployer(forkDAODeployer_);
        ds.vetoer = vetoer_;
        _setDynamicQuorumParams(
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );
        ds._setLastMinuteWindowInBlocks(daoParams_.lastMinuteWindowInBlocks);
        ds._setObjectionPeriodDurationInBlocks(daoParams_.objectionPeriodDurationInBlocks);
        ds._setProposalUpdatablePeriodInBlocks(daoParams_.proposalUpdatablePeriodInBlocks);
    }
}
