// SPDX-License-Identifier: BSD-3-Clause

/// @title The Nouns DAO logic version 3 extension
/// @dev Its purpose is to offloan code from the main logic contract, which otherwise hits the contract size limit.
/// The main contract keeps the most used functions to spare them the extra DELEGATECALL gas cost.

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

// LICENSE
// NounsDAOLogicV2.sol is a modified version of Compound Lab's GovernorBravoDelegate.sol:
// https://github.com/compound-finance/compound-protocol/blob/b9b14038612d846b83f8a009a82c38974ff2dcfe/contracts/Governance/GovernorBravoDelegate.sol
//
// GovernorBravoDelegate.sol source code Copyright 2020 Compound Labs, Inc. licensed under the BSD-3-Clause license.
// With modifications by Nounders DAO.
//
// Additional conditions of BSD-3-Clause can be found here: https://opensource.org/licenses/BSD-3-Clause
//
// MODIFICATIONS
// See NounsDAOLogicV1 for initial GovernorBravoDelegate modifications.
// See NounsDAOLogicV2 for additional modifications.

// NounsDAOLogicV3: TODO

pragma solidity ^0.8.6;

import './NounsDAOInterfaces.sol';

contract NounsDAOLogicV3Extension is NounsDAOStorageV3, NounsDAOEventsV3 {
    /// @notice The minimum setable proposal threshold
    uint256 public constant MIN_PROPOSAL_THRESHOLD_BPS = 1; // 1 basis point or 0.01%

    /// @notice The maximum setable proposal threshold
    uint256 public constant MAX_PROPOSAL_THRESHOLD_BPS = 1_000; // 1,000 basis points or 10%

    /// @notice The minimum setable voting period
    uint256 public constant MIN_VOTING_PERIOD = 5_760; // About 24 hours

    /// @notice The max setable voting period
    uint256 public constant MAX_VOTING_PERIOD = 80_640; // About 2 weeks

    /// @notice The min setable voting delay
    uint256 public constant MIN_VOTING_DELAY = 1;

    /// @notice The max setable voting delay
    uint256 public constant MAX_VOTING_DELAY = 40_320; // About 1 week

    /// @notice The lower bound of minimum quorum votes basis points
    uint256 public constant MIN_QUORUM_VOTES_BPS_LOWER_BOUND = 200; // 200 basis points or 2%

    /// @notice The upper bound of minimum quorum votes basis points
    uint256 public constant MIN_QUORUM_VOTES_BPS_UPPER_BOUND = 2_000; // 2,000 basis points or 20%

    /// @notice The upper bound of maximum quorum votes basis points
    uint256 public constant MAX_QUORUM_VOTES_BPS_UPPER_BOUND = 6_000; // 4,000 basis points or 60%

    error AdminOnly();
    error VetoerOnly();
    error PendingVetoerOnly();
    error VetoerBurned();
    error CantVetoExecutedProposal();

    // DQ errors
    error UnsafeUint16Cast();
    error MinQuorumBPSGreaterThanMaxQuorumBPS();
    error InvalidMaxQuorumVotesBPS();
    error InvalidMinQuorumVotesBPS();

    /**
     * @notice Vetoes a proposal only if sender is the vetoer and the proposal has not been executed.
     * @param proposalId The id of the proposal to veto
     */
    function veto(uint256 proposalId) external {
        if (vetoer == address(0)) {
            revert VetoerBurned();
        }

        if (msg.sender != vetoer) {
            revert VetoerOnly();
        }

        // Used to use `state()`; this change was made for a cleaner separation between
        // this contract and the main DAO logic.
        Proposal storage proposal = _proposals[proposalId];

        if (proposal.executed) {
            revert CantVetoExecutedProposal();
        }

        proposal.vetoed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                proposal.eta
            );
        }

        emit ProposalVetoed(proposalId);
    }

    /**
     * @notice Gets actions of a proposal
     * @param proposalId the id of the proposal
     * @return targets
     * @return values
     * @return signatures
     * @return calldatas
     */
    function getActions(uint256 proposalId)
        external
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        )
    {
        Proposal storage p = _proposals[proposalId];
        return (p.targets, p.values, p.signatures, p.calldatas);
    }

    /**
     * @notice Gets the receipt for a voter on a given proposal
     * @param proposalId the id of proposal
     * @param voter The address of the voter
     * @return The voting receipt
     */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory) {
        return _proposals[proposalId].receipts[voter];
    }

    /**
     * @notice Returns the proposal details given a proposal id.
     *     The `quorumVotes` member holds the *current* quorum, given the current votes.
     * @param proposalId the proposal id to get the data for
     * @return A `ProposalCondensed` struct with the proposal data
     */
    function proposals(uint256 proposalId) external view returns (ProposalCondensed memory) {
        Proposal storage proposal = _proposals[proposalId];
        return
            ProposalCondensed({
                id: proposal.id,
                proposer: proposal.proposer,
                proposalThreshold: proposal.proposalThreshold,
                quorumVotes: quorumVotes(proposal.id),
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
                proposers: proposal.proposers
            });
    }

    /**
     * @notice Admin function for setting the voting delay
     * @param newVotingDelay new voting delay, in blocks
     */
    function _setVotingDelay(uint256 newVotingDelay) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        require(
            newVotingDelay >= MIN_VOTING_DELAY && newVotingDelay <= MAX_VOTING_DELAY,
            'NounsDAO::_setVotingDelay: invalid voting delay'
        );
        uint256 oldVotingDelay = votingDelay;
        votingDelay = newVotingDelay;

        emit VotingDelaySet(oldVotingDelay, votingDelay);
    }

    /**
     * @notice Admin function for setting the voting period
     * @param newVotingPeriod new voting period, in blocks
     */
    function _setVotingPeriod(uint256 newVotingPeriod) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        require(
            newVotingPeriod >= MIN_VOTING_PERIOD && newVotingPeriod <= MAX_VOTING_PERIOD,
            'NounsDAO::_setVotingPeriod: invalid voting period'
        );
        uint256 oldVotingPeriod = votingPeriod;
        votingPeriod = newVotingPeriod;

        emit VotingPeriodSet(oldVotingPeriod, votingPeriod);
    }

    /**
     * @notice Admin function for setting the proposal threshold basis points
     * @dev newProposalThresholdBPS must be greater than the hardcoded min
     * @param newProposalThresholdBPS new proposal threshold
     */
    function _setProposalThresholdBPS(uint256 newProposalThresholdBPS) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        require(
            newProposalThresholdBPS >= MIN_PROPOSAL_THRESHOLD_BPS &&
                newProposalThresholdBPS <= MAX_PROPOSAL_THRESHOLD_BPS,
            'NounsDAO::_setProposalThreshold: invalid proposal threshold bps'
        );
        uint256 oldProposalThresholdBPS = proposalThresholdBPS;
        proposalThresholdBPS = newProposalThresholdBPS;

        emit ProposalThresholdBPSSet(oldProposalThresholdBPS, proposalThresholdBPS);
    }

    /**
     * @notice Admin function for setting the minimum quorum votes bps
     * @param newMinQuorumVotesBPS minimum quorum votes bps
     *     Must be between `MIN_QUORUM_VOTES_BPS_LOWER_BOUND` and `MIN_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be lower than or equal to maxQuorumVotesBPS
     */
    function _setMinQuorumVotesBPS(uint16 newMinQuorumVotesBPS) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        DynamicQuorumParams memory params = getDynamicQuorumParamsAt(block.number);

        require(
            newMinQuorumVotesBPS >= MIN_QUORUM_VOTES_BPS_LOWER_BOUND &&
                newMinQuorumVotesBPS <= MIN_QUORUM_VOTES_BPS_UPPER_BOUND,
            'NounsDAO::_setMinQuorumVotesBPS: invalid min quorum votes bps'
        );
        require(
            newMinQuorumVotesBPS <= params.maxQuorumVotesBPS,
            'NounsDAO::_setMinQuorumVotesBPS: min quorum votes bps greater than max'
        );

        uint16 oldMinQuorumVotesBPS = params.minQuorumVotesBPS;
        params.minQuorumVotesBPS = newMinQuorumVotesBPS;

        _writeQuorumParamsCheckpoint(params);

        emit MinQuorumVotesBPSSet(oldMinQuorumVotesBPS, newMinQuorumVotesBPS);
    }

    /**
     * @notice Admin function for setting the maximum quorum votes bps
     * @param newMaxQuorumVotesBPS maximum quorum votes bps
     *     Must be lower than `MAX_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be higher than or equal to minQuorumVotesBPS
     */
    function _setMaxQuorumVotesBPS(uint16 newMaxQuorumVotesBPS) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        DynamicQuorumParams memory params = getDynamicQuorumParamsAt(block.number);

        require(
            newMaxQuorumVotesBPS <= MAX_QUORUM_VOTES_BPS_UPPER_BOUND,
            'NounsDAO::_setMaxQuorumVotesBPS: invalid max quorum votes bps'
        );
        require(
            params.minQuorumVotesBPS <= newMaxQuorumVotesBPS,
            'NounsDAO::_setMaxQuorumVotesBPS: min quorum votes bps greater than max'
        );

        uint16 oldMaxQuorumVotesBPS = params.maxQuorumVotesBPS;
        params.maxQuorumVotesBPS = newMaxQuorumVotesBPS;

        _writeQuorumParamsCheckpoint(params);

        emit MaxQuorumVotesBPSSet(oldMaxQuorumVotesBPS, newMaxQuorumVotesBPS);
    }

    /**
     * @notice Admin function for setting the dynamic quorum coefficient
     * @param newQuorumCoefficient the new coefficient, as a fixed point integer with 6 decimals
     */
    function _setQuorumCoefficient(uint32 newQuorumCoefficient) external {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        DynamicQuorumParams memory params = getDynamicQuorumParamsAt(block.number);

        uint32 oldQuorumCoefficient = params.quorumCoefficient;
        params.quorumCoefficient = newQuorumCoefficient;

        _writeQuorumParamsCheckpoint(params);

        emit QuorumCoefficientSet(oldQuorumCoefficient, newQuorumCoefficient);
    }

    /**
     * @notice Admin function for setting all the dynamic quorum parameters
     * @param newMinQuorumVotesBPS minimum quorum votes bps
     *     Must be between `MIN_QUORUM_VOTES_BPS_LOWER_BOUND` and `MIN_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be lower than or equal to maxQuorumVotesBPS
     * @param newMaxQuorumVotesBPS maximum quorum votes bps
     *     Must be lower than `MAX_QUORUM_VOTES_BPS_UPPER_BOUND`
     *     Must be higher than or equal to minQuorumVotesBPS
     * @param newQuorumCoefficient the new coefficient, as a fixed point integer with 6 decimals
     */
    function _setDynamicQuorumParams(
        uint16 newMinQuorumVotesBPS,
        uint16 newMaxQuorumVotesBPS,
        uint32 newQuorumCoefficient
    ) public {
        if (msg.sender != admin) {
            revert AdminOnly();
        }
        if (
            newMinQuorumVotesBPS < MIN_QUORUM_VOTES_BPS_LOWER_BOUND ||
            newMinQuorumVotesBPS > MIN_QUORUM_VOTES_BPS_UPPER_BOUND
        ) {
            revert InvalidMinQuorumVotesBPS();
        }
        if (newMaxQuorumVotesBPS > MAX_QUORUM_VOTES_BPS_UPPER_BOUND) {
            revert InvalidMaxQuorumVotesBPS();
        }
        if (newMinQuorumVotesBPS > newMaxQuorumVotesBPS) {
            revert MinQuorumBPSGreaterThanMaxQuorumBPS();
        }

        DynamicQuorumParams memory oldParams = getDynamicQuorumParamsAt(block.number);

        DynamicQuorumParams memory params = DynamicQuorumParams({
            minQuorumVotesBPS: newMinQuorumVotesBPS,
            maxQuorumVotesBPS: newMaxQuorumVotesBPS,
            quorumCoefficient: newQuorumCoefficient
        });
        _writeQuorumParamsCheckpoint(params);

        emit MinQuorumVotesBPSSet(oldParams.minQuorumVotesBPS, params.minQuorumVotesBPS);
        emit MaxQuorumVotesBPSSet(oldParams.maxQuorumVotesBPS, params.maxQuorumVotesBPS);
        emit QuorumCoefficientSet(oldParams.quorumCoefficient, params.quorumCoefficient);
    }

    function _withdraw() external returns (uint256, bool) {
        if (msg.sender != admin) {
            revert AdminOnly();
        }

        uint256 amount = address(this).balance;
        (bool sent, ) = msg.sender.call{ value: amount }('');

        emit Withdraw(amount, sent);

        return (amount, sent);
    }

    /**
     * @notice Begins transfer of admin rights. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @dev Admin function to begin change of admin. The newPendingAdmin must call `_acceptAdmin` to finalize the transfer.
     * @param newPendingAdmin New pending admin.
     */
    function _setPendingAdmin(address newPendingAdmin) external {
        // Check caller = admin
        require(msg.sender == admin, 'NounsDAO::_setPendingAdmin: admin only');

        // Save current value, if any, for inclusion in log
        address oldPendingAdmin = pendingAdmin;

        // Store pendingAdmin with value newPendingAdmin
        pendingAdmin = newPendingAdmin;

        // Emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin)
        emit NewPendingAdmin(oldPendingAdmin, newPendingAdmin);
    }

    /**
     * @notice Accepts transfer of admin rights. msg.sender must be pendingAdmin
     * @dev Admin function for pending admin to accept role and update admin
     */
    function _acceptAdmin() external {
        // Check caller is pendingAdmin and pendingAdmin ≠ address(0)
        require(msg.sender == pendingAdmin && msg.sender != address(0), 'NounsDAO::_acceptAdmin: pending admin only');

        // Save current values for inclusion in log
        address oldAdmin = admin;
        address oldPendingAdmin = pendingAdmin;

        // Store admin with value pendingAdmin
        admin = pendingAdmin;

        // Clear the pending value
        pendingAdmin = address(0);

        emit NewAdmin(oldAdmin, admin);
        emit NewPendingAdmin(oldPendingAdmin, pendingAdmin);
    }

    /**
     * @notice Begins transition of vetoer. The newPendingVetoer must call _acceptVetoer to finalize the transfer.
     * @param newPendingVetoer New Pending Vetoer
     */
    function _setPendingVetoer(address newPendingVetoer) public {
        if (msg.sender != vetoer) {
            revert VetoerOnly();
        }

        emit NewPendingVetoer(pendingVetoer, newPendingVetoer);

        pendingVetoer = newPendingVetoer;
    }

    function _acceptVetoer() external {
        if (msg.sender != pendingVetoer) {
            revert PendingVetoerOnly();
        }

        // Update vetoer
        emit NewVetoer(vetoer, pendingVetoer);
        vetoer = pendingVetoer;

        // Clear the pending value
        emit NewPendingVetoer(pendingVetoer, address(0));
        pendingVetoer = address(0);
    }

    /**
     * @notice Burns veto priviledges
     * @dev Vetoer function destroying veto power forever
     */
    function _burnVetoPower() public {
        // Check caller is vetoer
        require(msg.sender == vetoer, 'NounsDAO::_burnVetoPower: vetoer only');

        // Update vetoer to 0x0
        emit NewVetoer(vetoer, address(0));
        vetoer = address(0);

        // Clear the pending value
        emit NewPendingVetoer(pendingVetoer, address(0));
        pendingVetoer = address(0);
    }

    /**
     * @notice Current proposal threshold using Noun Total Supply
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function proposalThreshold() public view returns (uint256) {
        return bps2Uint(proposalThresholdBPS, nouns.totalSupply());
    }

    /**
     * @notice Quorum votes required for a specific proposal to succeed
     * Differs from `GovernerBravo` which uses fixed amount
     */
    function quorumVotes(uint256 proposalId) public view returns (uint256) {
        Proposal storage proposal = _proposals[proposalId];
        if (proposal.totalSupply == 0) {
            return proposal.quorumVotes;
        }

        return
            dynamicQuorumVotes(
                proposal.againstVotes,
                proposal.totalSupply,
                getDynamicQuorumParamsAt(proposal.creationBlock)
            );
    }

    /**
     * @notice Calculates the required quorum of for-votes based on the amount of against-votes
     *     The more against-votes there are for a proposal, the higher the required quorum is.
     *     The quorum BPS is between `params.minQuorumVotesBPS` and params.maxQuorumVotesBPS.
     *     The additional quorum is calculated as:
     *       quorumCoefficient * againstVotesBPS
     * @dev Note the coefficient is a fixed point integer with 6 decimals
     * @param againstVotes Number of against-votes in the proposal
     * @param totalSupply The total supply of Nouns at the time of proposal creation
     * @param params Configurable parameters for calculating the quorum based on againstVotes. See `DynamicQuorumParams` definition for additional details.
     * @return quorumVotes The required quorum
     */
    function dynamicQuorumVotes(
        uint256 againstVotes,
        uint256 totalSupply,
        DynamicQuorumParams memory params
    ) public pure returns (uint256) {
        uint256 againstVotesBPS = (10000 * againstVotes) / totalSupply;
        uint256 quorumAdjustmentBPS = (params.quorumCoefficient * againstVotesBPS) / 1e6;
        uint256 adjustedQuorumBPS = params.minQuorumVotesBPS + quorumAdjustmentBPS;
        uint256 quorumBPS = min(params.maxQuorumVotesBPS, adjustedQuorumBPS);
        return bps2Uint(quorumBPS, totalSupply);
    }

    function _writeQuorumParamsCheckpoint(DynamicQuorumParams memory params) internal {
        uint32 blockNumber = safe32(block.number, 'block number exceeds 32 bits');
        uint256 pos = quorumParamsCheckpoints.length;
        if (pos > 0 && quorumParamsCheckpoints[pos - 1].fromBlock == blockNumber) {
            quorumParamsCheckpoints[pos - 1].params = params;
        } else {
            quorumParamsCheckpoints.push(DynamicQuorumParamsCheckpoint({ fromBlock: blockNumber, params: params }));
        }
    }

    /**
     * @notice returns the dynamic quorum parameters values at a certain block number
     * @dev The checkpoints array must not be empty, and the block number must be higher than or equal to
     *     the block of the first checkpoint
     * @param blockNumber_ the block number to get the params at
     * @return The dynamic quorum parameters that were set at the given block number
     */
    function getDynamicQuorumParamsAt(uint256 blockNumber_) public view returns (DynamicQuorumParams memory) {
        uint32 blockNumber = safe32(blockNumber_, 'NounsDAO::getDynamicQuorumParamsAt: block number exceeds 32 bits');
        uint256 len = quorumParamsCheckpoints.length;

        if (len == 0) {
            return
                DynamicQuorumParams({
                    minQuorumVotesBPS: safe16(quorumVotesBPS),
                    maxQuorumVotesBPS: safe16(quorumVotesBPS),
                    quorumCoefficient: 0
                });
        }

        if (quorumParamsCheckpoints[len - 1].fromBlock <= blockNumber) {
            return quorumParamsCheckpoints[len - 1].params;
        }

        if (quorumParamsCheckpoints[0].fromBlock > blockNumber) {
            return
                DynamicQuorumParams({
                    minQuorumVotesBPS: safe16(quorumVotesBPS),
                    maxQuorumVotesBPS: safe16(quorumVotesBPS),
                    quorumCoefficient: 0
                });
        }

        uint256 lower = 0;
        uint256 upper = len - 1;
        while (upper > lower) {
            uint256 center = upper - (upper - lower) / 2;
            DynamicQuorumParamsCheckpoint memory cp = quorumParamsCheckpoints[center];
            if (cp.fromBlock == blockNumber) {
                return cp.params;
            } else if (cp.fromBlock < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return quorumParamsCheckpoints[lower].params;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @notice Current max quorum votes using Noun total supply
     */
    function maxQuorumVotes() public view returns (uint256) {
        return bps2Uint(getDynamicQuorumParamsAt(block.number).maxQuorumVotesBPS, nouns.totalSupply());
    }

    function bps2Uint(uint256 bps, uint256 number) internal pure returns (uint256) {
        return (number * bps) / 10000;
    }

    function safe32(uint256 n, string memory errorMessage) internal pure returns (uint32) {
        require(n <= type(uint32).max, errorMessage);
        return uint32(n);
    }

    function safe16(uint256 n) internal pure returns (uint16) {
        if (n > type(uint16).max) {
            revert UnsafeUint16Cast();
        }
        return uint16(n);
    }

    receive() external payable {}
}
