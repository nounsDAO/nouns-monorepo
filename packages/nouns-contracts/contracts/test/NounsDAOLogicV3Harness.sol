// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import '../governance/NounsDAOLogicV4.sol';
import { NounsDAOAdmin } from '../governance/NounsDAOAdmin.sol';

/**
 * @dev A modified version of NounsDAOLogicV4 that exposes the `initialize` function for testing purposes.
 * The modification removes bounds checks on parameters, so we can dramatically shorten test scenarios setup.
 */
contract NounsDAOLogicV3Harness is NounsDAOLogicV4 {
    using NounsDAOAdmin for Storage;

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
        NounsDAOAdmin._setDynamicQuorumParams(
            dynamicQuorumParams_.minQuorumVotesBPS,
            dynamicQuorumParams_.maxQuorumVotesBPS,
            dynamicQuorumParams_.quorumCoefficient
        );
        NounsDAOAdmin._setLastMinuteWindowInBlocks(daoParams_.lastMinuteWindowInBlocks);
        NounsDAOAdmin._setObjectionPeriodDurationInBlocks(daoParams_.objectionPeriodDurationInBlocks);
        NounsDAOAdmin._setProposalUpdatablePeriodInBlocks(daoParams_.proposalUpdatablePeriodInBlocks);
    }
}
