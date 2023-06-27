// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

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
        keccak256('Delegation(address delegatee,uint256 punkIndex,uint256 nonce,uint256 expiry)');

    /// @notice The EIP-712 typehash for the delegation struct used by the contract
    bytes32 public constant DELEGATION_BATCH_TYPEHASH =
        keccak256('DelegationBatch(address delegatee,uint256[] punkIndexes,uint256 nonce,uint256 expiry)');

    /// @notice A record of states for signing / validating signatures
    mapping(address => uint256) public nonces;

    ICryptopunks public immutable cryptopunks;
    IERC721 public immutable wrappedPunk;
    uint256 internal constant CRYPTOPUNKS_TOTAL_SUPPLY = 10_000;
    /// @dev just for convenience, user cannot delegate to zero address
    address internal constant TOTAL_SUPPLY_HOLDER = address(0);

    /**
     * @dev Emitted when a punk changes its delegate.
     * IERC5805 not compliant
     */
    event DelegateChanged(address delegator, address indexed fromDelegate, address indexed toDelegate, uint256 indexed punkIndex);

    /**
     * @dev Emitted when a delegate change results in changes to a delegate's number of votes.
     * IERC5805 compliant
     */
    event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);

    constructor(address cryptopunks_, address wrappedPunk_) EIP712("CryptopunksVote", "1.0") {
        require(cryptopunks_ != address (0), "CryptopunksVote: zero address of cryptopunks");
        require(wrappedPunk_ != address (0), "CryptopunksVote: zero address of wrappedPunk");
        cryptopunks = ICryptopunks(cryptopunks_);
        wrappedPunk = IERC721(wrappedPunk_);
    }

    /**
     * @dev Returns the current amount of votes that `account` has.
     * IERC5805 compliant
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
     * IERC5805 compliant
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

    function totalSupply() external pure returns (uint256) {
        return CRYPTOPUNKS_TOTAL_SUPPLY;
    }

    function totalDelegated() external view returns (uint256) {
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
     *
     * IERC5805 compliant
     *
     * Returns always 10_000 as there are 10_000 OG punks
     */
    function getPastTotalSupply(uint256 /*timepoint*/) external pure returns (uint256) {
        return CRYPTOPUNKS_TOTAL_SUPPLY;
    }

    /**
     * @dev Returns the number of delegated votes.
     * It is provided in the case a project would want to refer to delegated votes/punks instead of all OG punks.
     */
    function getPastTotalDelegated(uint256 timepoint) external view returns (uint256) {
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
     * IERC5805 not compliant
     */
    function delegates(uint256 punkIndex) external view returns (address) {
        require(punkIndex < CRYPTOPUNKS_TOTAL_SUPPLY, "CryptopunksVote: invalid punkIndex");
        return _delegates[punkIndex];
    }

    /**
     * @dev Returns the delegate that `account` has chosen in a batch.
     * IERC5805 not compliant
     */
    function delegatesBatch(uint256[] memory punkIndexes) external view returns (address[] memory) {
        address[] memory delegateAddresses = new address[](punkIndexes.length);
        for (uint256 i = 0 ; i < punkIndexes.length ; i++ ) {
            delegateAddresses[i] = _delegates[punkIndexes[i]];

        }
        return delegateAddresses;
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     * IERC5805 not compliant
     */
    function delegate(address delegatee, uint256 punkIndex) external {
        _delegate(msg.sender, delegatee, punkIndex);
    }

    /**
     * @dev Delegates votes from the sender to `delegatee`.
     * Must be eligible for each punk.
     * IERC5805 not compliant
     */
    function delegateBatch(address delegatee, uint256[] memory punkIndexes) external {
        for (uint256 i = 0 ; i < punkIndexes.length ; i++ ) {
            _delegate(msg.sender, delegatee, punkIndexes[i]);
        }
    }

    /**
     * @dev Delegates votes from signer to `delegatee`.
     * IERC5805 not compliant
     */
    function delegateBySig(address delegatee, uint256 punkIndex, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external {
        require(block.timestamp <= expiry, "CryptopunksVote: signature expired");
        address signatory = ECDSA.recover(
            _hashTypedDataV4(keccak256(abi.encode(DELEGATION_TYPEHASH, delegatee, punkIndex, nonce, expiry))),
            v,
            r,
            s
        );
        require(nonce == nonces[signatory]++, "CryptopunksVote: invalid nonce");
        _delegate(signatory, delegatee, punkIndex);
    }

    /**
     * @dev Delegates votes from signer to `delegatee`.
     * Must be eligible for each punk.
     * IERC5805 not compliant
     */
    function delegateBatchBySig(address delegatee, uint256[] memory punkIndexes, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external {
        require(block.timestamp <= expiry, "CryptopunksVote: signature expired");
        address signatory = ECDSA.recover(
            _hashTypedDataV4(keccak256(abi.encode(DELEGATION_BATCH_TYPEHASH, delegatee, keccak256(abi.encodePacked(punkIndexes)), nonce, expiry))),
            v,
            r,
            s
        );
        require(nonce == nonces[signatory]++, "CryptopunksVote: invalid nonce");
        for (uint256 i = 0 ; i < punkIndexes.length ; i++ ) {
            _delegate(signatory, delegatee, punkIndexes[i]);
        }
    }

    function _delegate(address delegator, address delegatee, uint256 punkIndex) internal {
        require(punkIndex < CRYPTOPUNKS_TOTAL_SUPPLY, "CryptopunksVote: invalid punkIndex");
        require(block.number < type(uint32).max, "CryptopunksVote: max block exceeded");
        require(delegatee != address(0), "CryptopunksVote: invalid delegatee");
        address prevDelegatee = _delegates[punkIndex];
        address owner = cryptopunks.punkIndexToAddress(punkIndex);
        if (owner == address(wrappedPunk)) {
            owner = wrappedPunk.ownerOf(punkIndex);
            require(
                delegator == prevDelegatee
                || delegator == owner
                || delegator == wrappedPunk.getApproved(punkIndex)
                || wrappedPunk.isApprovedForAll(owner, delegator),
                "CryptopunksVote: illegal delegation"
            );
        } else {
            require(
                delegator == prevDelegatee || delegator == owner,
                "CryptopunksVote: illegal delegation"
            );
        }

        _delegates[punkIndex] = delegatee;

        if (prevDelegatee != delegatee) {
            if (prevDelegatee != address(0)) {
                uint32 nCheckpoints = numCheckpoints[prevDelegatee];
                uint96 newVotes = checkpoints[prevDelegatee][nCheckpoints - 1].votes - 1;
                _writeCheckpointAndEvent(prevDelegatee, nCheckpoints, newVotes);
            } else {
                uint32 nCheckpoints = numCheckpoints[TOTAL_SUPPLY_HOLDER];
                uint96 newVotes = nCheckpoints > 0 ? checkpoints[TOTAL_SUPPLY_HOLDER][nCheckpoints - 1].votes + 1: 1;
                _writeCheckpoint(TOTAL_SUPPLY_HOLDER, nCheckpoints, newVotes);
            }
            // a block just to prevent variable shadowing warnings
            {
                uint32 nCheckpoints = numCheckpoints[delegatee];
                uint96 newVotes = nCheckpoints > 0 ? checkpoints[delegatee][nCheckpoints - 1].votes + 1: 1;
                _writeCheckpointAndEvent(delegatee, nCheckpoints, newVotes);
            }
        }

        emit DelegateChanged(delegator, prevDelegatee, delegatee, punkIndex);
    }

    function _writeCheckpoint(
        address delegatee,
        uint32 nCheckpoints,
        uint96 newVotes
    ) internal {
        // all operations are safe,
        unchecked {
            // range check already done
            uint32 blockNumber = uint32(block.number);

            if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
                checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
            } else {
                checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
                numCheckpoints[delegatee] = nCheckpoints + 1;
            }
        }
    }

    function _writeCheckpointAndEvent(
        address delegatee,
        uint32 nCheckpoints,
        uint96 newVotes
    ) internal {
        // all operations are safe,
        unchecked {
            // range check already done
            uint32 blockNumber = uint32(block.number);

            if (nCheckpoints == 0) {
                emit DelegateVotesChanged(delegatee, 0, newVotes);
                checkpoints[delegatee][0] = Checkpoint(blockNumber, newVotes);
                numCheckpoints[delegatee] = 1;
            } else if (checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
                emit DelegateVotesChanged(delegatee, checkpoints[delegatee][nCheckpoints - 1].votes, newVotes);
                checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
            } else {
                emit DelegateVotesChanged(delegatee, checkpoints[delegatee][nCheckpoints - 1].votes, newVotes);
                checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
                numCheckpoints[delegatee] = nCheckpoints + 1;
            }
        }
    }
}