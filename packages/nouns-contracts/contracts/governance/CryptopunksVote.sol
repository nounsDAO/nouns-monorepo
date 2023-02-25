// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface ICryptopunks {
    function punkIndexToAddress(uint256 punkIndex) view external returns(address);
}

contract CryptopunksVote is EIP712 {

    /// @notice A record of each punkIndex delegate
    mapping(uint256 => address) private _delegates;

    /// @notice A checkpoint for marking number of votes from a given block
    struct Checkpoint {
        uint32 fromBlock;
        uint96 votes;
    }

    /// @notice A record of votes checkpoints for each account, by index
    mapping(address => mapping(uint32 => Checkpoint)) public checkpoints;

    /// @notice The number of checkpoints for each account
    mapping(address => uint32) public numCheckpoints;

    /// @notice The EIP-712 typehash for the delegation struct used by the contract
    bytes32 public constant DELEGATION_TYPEHASH =
        keccak256('Delegation(uint256 punkIndex,address delegatee,uint256 nonce,uint256 expiry)');

    /// @notice A record of states for signing / validating signatures
    mapping(address => uint256) public nonces;

    ICryptopunks public immutable cryptopunks;
    uint256 internal constant CRYPTOPUNKS_TOTAL_SUPPLY = 10_000;
    address internal constant TOTAL_SUPPLY_HOLDER = address(0);


    constructor(address cryptopunks_) EIP712("CryptopunksVote", "1.0") {
        require(cryptopunks_ != address (0), "CryptopunksVote: zero address of cryptopunks");
        cryptopunks = ICryptopunks(cryptopunks_);
    }
function getChainId() external view returns (uint256) {return block.chainid;}
function getHash(uint256 punkIndex, address delegatee, uint256 nonce, uint256 expiry) external view returns (bytes32) {return _hashTypedDataV4(keccak256(abi.encode(DELEGATION_TYPEHASH, punkIndex, delegatee, nonce, expiry)));}

    /**
     * @dev Returns the current amount of votes that `account` has.
     */
    function getVotes(address account) external view returns (uint256) {
        uint32 nCheckpoints = numCheckpoints[account];
        return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
    }

    /**
     * @dev the same as getVotes() but Compound compatible
     */
    function getCurrentVotes(address account) external view returns (uint96) {
        uint32 nCheckpoints = numCheckpoints[account];
        return nCheckpoints > 0 ? checkpoints[account][nCheckpoints - 1].votes : 0;
    }

    /**
     * @dev Returns the amount of votes that `account` had at a specific moment in the past. If the `clock()` is
     * configured to use block numbers, this will return the value the end of the corresponding block.
     */
    function getPastVotes(address account, uint256 timepoint) external view returns (uint256) {
        return _getPriorVotes(account, timepoint);
    }

    /**
     * @dev the same as getVotes() but Compound compatible
     */
    function getPriorVotes(address account, uint256 blockNumber) public view returns (uint96) {
        return _getPriorVotes(account, blockNumber);
    }

    function totalSupply() external view returns (uint256) {
        uint32 nCheckpoints = numCheckpoints[TOTAL_SUPPLY_HOLDER];
        return nCheckpoints > 0 ? checkpoints[TOTAL_SUPPLY_HOLDER][nCheckpoints - 1].votes : 0;
    }

    /**
     * @dev Returns the total supply of votes available at a specific moment in the past. If the `clock()` is
     * configured to use block numbers, this will return the value the end of the corresponding block.
     *
     * NOTE: This value is the sum of all available votes, which is not necessarily the sum of all delegated votes.
     * Votes that have not been delegated are still part of total supply, even though they would not participate in a
     * vote.
     */
    function getPastTotalSupply(uint256 timepoint) external view returns (uint256) {
        return _getPriorVotes(TOTAL_SUPPLY_HOLDER, timepoint);
    }

    function _getPriorVotes(address account, uint256 blockNumber) internal view returns (uint96) {
        require(blockNumber < block.number, 'CryptopunksVote: not yet determined');

        uint32 nCheckpoints = numCheckpoints[account];
        if (nCheckpoints == 0) {
            return 0;
        }

        // First check most recent balance
        if (checkpoints[account][nCheckpoints - 1].fromBlock <= blockNumber) {
            return checkpoints[account][nCheckpoints - 1].votes;
        }

        // Next check implicit zero balance
        if (checkpoints[account][0].fromBlock > blockNumber) {
            return 0;
        }

        uint32 lower = 0;
        uint32 upper = nCheckpoints - 1;
        while (upper > lower) {
            uint32 center = upper - (upper - lower) / 2; // ceil, avoiding overflow
            Checkpoint memory cp = checkpoints[account][center];
            if (cp.fromBlock == blockNumber) {
                return cp.votes;
            } else if (cp.fromBlock < blockNumber) {
                lower = center;
            } else {
                upper = center - 1;
            }
        }
        return checkpoints[account][lower].votes;
    }

    /**
     * @dev Returns the delegate that `account` has chosen.
     */
    function delegates(uint256 punkIndex) external view returns (address) {
        require(punkIndex < CRYPTOPUNKS_TOTAL_SUPPLY, "CryptopunksVote: invalid punkIndex");
        return _delegates[punkIndex];
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     */
    function delegate(uint256 punkIndex, address delegatee) external {
        _delegate(punkIndex, msg.sender, delegatee);
    }

    /**
     * @dev Delegates votes from signer to `delegatee`.
     */
    function delegateBySig(uint256 punkIndex, address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external {
        require(block.timestamp <= expiry, "CryptopunkVote: signature expired");
        address signatory = ECDSA.recover(
            _hashTypedDataV4(keccak256(abi.encode(DELEGATION_TYPEHASH, punkIndex, delegatee, nonce, expiry))),
            v,
            r,
            s
        );
        require(nonce == nonces[signatory]++, "CryptopunkVote: invalid nonce");
        _delegate(punkIndex, signatory, delegatee);
    }

    function _delegate(uint256 punkIndex, address delegator, address delegatee) internal {
        require(punkIndex < CRYPTOPUNKS_TOTAL_SUPPLY, "CryptopunksVote: invalid punkIndex");
        require(block.number < type(uint32).max, "CryptopunksVote: max block exceeded");
        require(delegatee != address(0), "CryptopunksVote: invalid delegatee");
        address prevDelegatee = _delegates[punkIndex];
        require(
            delegator == prevDelegatee || delegator == cryptopunks.punkIndexToAddress(punkIndex),
            "CryptopunksVote: illegal delegation"
        );

        _delegates[punkIndex] = delegatee;

        if (prevDelegatee != delegatee) {
            if (prevDelegatee != address(0)) {
                uint32 nCheckpoints = numCheckpoints[prevDelegatee];
                uint96 newVotes = checkpoints[prevDelegatee][nCheckpoints - 1].votes - 1;
                _writeCheckpoint(prevDelegatee, nCheckpoints, newVotes);
            } else {
                uint32 nCheckpoints = numCheckpoints[TOTAL_SUPPLY_HOLDER];
                uint96 newVotes = nCheckpoints > 0 ? checkpoints[TOTAL_SUPPLY_HOLDER][nCheckpoints - 1].votes + 1: 1;
                _writeCheckpoint(TOTAL_SUPPLY_HOLDER, nCheckpoints, newVotes);
            }
            // a block just to prevent variable shadowing warnings
            {
                uint32 nCheckpoints = numCheckpoints[delegatee];
                uint96 newVotes = nCheckpoints > 0 ? checkpoints[delegatee][nCheckpoints - 1].votes + 1: 1;
                _writeCheckpoint(delegatee, nCheckpoints, newVotes);
            }
        }
    }

    function _writeCheckpoint(
        address delegatee,
        uint32 nCheckpoints,
        uint96 newVotes
    ) internal {
        uint32 blockNumber = uint32(block.number);

        if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
            checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
        } else {
            checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
            numCheckpoints[delegatee] = nCheckpoints + 1;
        }
    }
}