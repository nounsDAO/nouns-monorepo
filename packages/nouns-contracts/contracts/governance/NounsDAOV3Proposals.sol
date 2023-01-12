// SPDX-License-Identifier: GPL-3.0

/// @title

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

import './NounsDAOInterfaces.sol';
import { NounsDAOV3DynamicQuorum } from './NounsDAOV3DynamicQuorum.sol';

library NounsDAOV3Proposals {
    using NounsDAOV3DynamicQuorum for NounsDAOStorageV3.StorageV3;

    error CantCancelExecutedProposal();

    /// @notice An event emitted when a proposal has been queued in the NounsDAOExecutor
    event ProposalQueued(uint256 id, uint256 eta);

    /// @notice An event emitted when a proposal has been executed in the NounsDAOExecutor
    event ProposalExecuted(uint256 id);

    /// @notice An event emitted when a proposal has been canceled
    event ProposalCanceled(uint256 id);

    /**
     * @notice Queues a proposal of state succeeded
     * @param proposalId The id of the proposal to queue
     */
    function queue(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        require(
            state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Succeeded,
            'NounsDAO::queue: proposal can only be queued if it is succeeded'
        );
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        uint256 eta = block.timestamp + ds.timelock.delay();
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            queueOrRevertInternal(
                ds,
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                eta
            );
        }
        proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);
    }

    function queueOrRevertInternal(
        NounsDAOStorageV3.StorageV3 storage ds,
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) internal {
        require(
            !ds.timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))),
            'NounsDAO::queueOrRevertInternal: identical proposal action already queued at eta'
        );
        ds.timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
     * @notice Executes a queued proposal if eta has passed
     * @param proposalId The id of the proposal to execute
     */
    function execute(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        require(
            state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Queued,
            'NounsDAO::execute: proposal can only be executed if it is queued'
        );
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        proposal.executed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            ds.timelock.executeTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancels a proposal only if sender is the proposer, or proposer delegates dropped below proposal threshold
     * @param proposalId The id of the proposal to cancel
     */
    function cancel(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId) external {
        if (state(ds, proposalId) == NounsDAOStorageV3.ProposalState.Executed) {
            revert CantCancelExecutedProposal();
        }

        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        address proposer = proposal.proposer;

        uint256 votes;
        bool msgSenderIsProposer = proposer == msg.sender;
        address[] memory signers = proposal.signers;
        if (signers.length == 0) {
            votes = ds.nouns.getPriorVotes(proposer, block.number - 1);
        } else {
            for (uint256 i = 0; i < signers.length; ++i) {
                msgSenderIsProposer = msgSenderIsProposer || msg.sender == signers[i];
                votes += ds.nouns.getPriorVotes(signers[i], block.number - 1);
            }
        }

        require(
            msgSenderIsProposer || votes <= proposal.proposalThreshold,
            'NounsDAO::cancel: proposer above threshold'
        );

        proposal.canceled = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            ds.timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Gets the state of a proposal
     * @param proposalId The id of the proposal
     * @return Proposal state
     */
    function state(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId)
        public
        view
        returns (NounsDAOStorageV3.ProposalState)
    {
        require(ds.proposalCount >= proposalId, 'NounsDAO::state: invalid proposal id');
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        if (proposal.vetoed) {
            return NounsDAOStorageV3.ProposalState.Vetoed;
        } else if (proposal.canceled) {
            return NounsDAOStorageV3.ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return NounsDAOStorageV3.ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return NounsDAOStorageV3.ProposalState.Active;
        } else if (block.number <= proposal.objectionPeriodEndBlock) {
            return NounsDAOStorageV3.ProposalState.ObjectionPeriod;
        } else if (isDefeated(ds, proposal)) {
            return NounsDAOStorageV3.ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return NounsDAOStorageV3.ProposalState.Succeeded;
        } else if (proposal.executed) {
            return NounsDAOStorageV3.ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta + ds.timelock.GRACE_PERIOD()) {
            return NounsDAOStorageV3.ProposalState.Expired;
        } else {
            return NounsDAOStorageV3.ProposalState.Queued;
        }
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposals(NounsDAOStorageV3.StorageV3 storage ds, uint256 proposalId)
        external
        view
        returns (NounsDAOStorageV3.ProposalCondensed memory)
    {
        NounsDAOStorageV3.Proposal storage proposal = ds._proposals[proposalId];
        return
            NounsDAOStorageV3.ProposalCondensed({
                id: proposal.id,
                proposer: proposal.proposer,
                proposalThreshold: proposal.proposalThreshold,
                quorumVotes: ds.quorumVotes(proposal.id),
                eta: proposal.eta,
                startBlock: proposal.startBlock,
                endBlock: proposal.endBlock,
                forVotes: proposal.forVotes,
                againstVotes: proposal.againstVotes,
                abstainVotes: proposal.abstainVotes,
                canceled: proposal.canceled,
                vetoed: proposal.vetoed,
                executed: proposal.executed,
                totalSupply: proposal.totalSupply,
                creationBlock: proposal.creationBlock,
                signers: proposal.signers
            });
    }

    function isDefeated(NounsDAOStorageV3.StorageV3 storage ds, NounsDAOStorageV3.Proposal storage proposal)
        internal
        view
        returns (bool)
    {
        return proposal.forVotes <= proposal.againstVotes || proposal.forVotes < ds.quorumVotes(proposal.id);
    }

    function proposalCreationBlock(NounsDAOStorageV3.StorageV3 storage ds, NounsDAOStorageV3.Proposal storage proposal)
        internal
        view
        returns (uint256)
    {
        if (proposal.creationBlock == 0) {
            return proposal.startBlock - ds.votingDelay;
        }
        return proposal.creationBlock;
    }
}
