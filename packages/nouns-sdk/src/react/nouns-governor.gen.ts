import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NounsGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorAbi = [
  { type: 'error', inputs: [], name: 'AdminOnly' },
  { type: 'error', inputs: [], name: 'CanOnlyInitializeOnce' },
  { type: 'error', inputs: [], name: 'InvalidNounsAddress' },
  { type: 'error', inputs: [], name: 'InvalidTimelockAddress' },
  { type: 'error', inputs: [], name: 'MustProvideActions' },
  { type: 'error', inputs: [], name: 'ProposalInfoArityMismatch' },
  { type: 'error', inputs: [], name: 'ProposerAlreadyHasALiveProposal' },
  { type: 'error', inputs: [], name: 'TooManyActions' },
  { type: 'error', inputs: [], name: 'UnsafeUint16Cast' },
  { type: 'error', inputs: [], name: 'VotesBelowProposalThreshold' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'numTokens', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAONounsSupplyIncreasedFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'DAOWithdrawNounsFromEscrow',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldErc20Tokens', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'newErc20tokens', internalType: 'address[]', type: 'address[]', indexed: false },
    ],
    name: 'ERC20TokensToIncludeInForkSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'EscrowedToFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'forkTreasury', internalType: 'address', type: 'address', indexed: false },
      { name: 'forkToken', internalType: 'address', type: 'address', indexed: false },
      { name: 'forkEndTimestamp', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokensInEscrow', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ExecuteFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkDAODeployer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newForkDAODeployer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'ForkDAODeployerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newForkPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ForkPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldForkThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newForkThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ForkThresholdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'JoinFork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newLastMinuteWindowInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'LastMinuteWindowSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newMaxQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MaxQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'newMinQuorumVotesBPS', internalType: 'uint16', type: 'uint16', indexed: false },
    ],
    name: 'MinQuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldPendingAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newPendingAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewPendingAdmin',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldPendingVetoer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newPendingVetoer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewPendingVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVetoer', internalType: 'address', type: 'address', indexed: false },
      { name: 'newVetoer', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'NewVetoer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newObjectionPeriodDurationInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ObjectionPeriodDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'startBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalCreatedOnTimelockV1',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: false },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'startBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'endBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'quorumVotes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'signers', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'updatePeriodEndBlock', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'quorumVotes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'ProposalCreatedWithRequirements',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalDescriptionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalObjectionPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'eta', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldProposalThresholdBPS', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newProposalThresholdBPS', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'ProposalThresholdBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalTransactionsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'newProposalUpdatablePeriodInBlocks',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'ProposalUpdatablePeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'proposer', internalType: 'address', type: 'address', indexed: true },
      { name: 'targets', internalType: 'address[]', type: 'address[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'signatures', internalType: 'string[]', type: 'string[]', indexed: false },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]', indexed: false },
      { name: 'description', internalType: 'string', type: 'string', indexed: false },
      { name: 'updateMessage', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ProposalUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'ProposalVetoed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldQuorumCoefficient', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'newQuorumCoefficient', internalType: 'uint32', type: 'uint32', indexed: false },
    ],
    name: 'QuorumCoefficientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldQuorumVotesBPS', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newQuorumVotesBPS', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'QuorumVotesBPSSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'refundAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'refundSent', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RefundableVote',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address', indexed: true },
      { name: 'sig', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'SignatureCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'timelock', internalType: 'address', type: 'address', indexed: false },
      { name: 'timelockV1', internalType: 'address', type: 'address', indexed: false },
      { name: 'admin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'TimelocksAndAdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      { name: 'votes', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'reason', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'voter', internalType: 'address', type: 'address', indexed: true },
      { name: 'proposalId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'clientId', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'VoteCastWithClientId',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVotingDelay', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newVotingDelay', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'VotingDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'oldVotingPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'newVotingPeriod', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'VotingPeriodSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'sent', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Withdraw',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'forkId', internalType: 'uint32', type: 'uint32', indexed: true },
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'WithdrawFromForkEscrow',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_PROPOSAL_THRESHOLD_BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_DELAY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_VOTING_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adjustedTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sig', internalType: 'bytes', type: 'bytes' }],
    name: 'cancelSig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castRefundableVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'castRefundableVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castRefundableVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'castRefundableVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'castVoteBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'adjustedTotalSupply_', internalType: 'uint256', type: 'uint256' },
      {
        name: 'params',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'dynamicQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc20TokensToIncludeInFork',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'escrowToFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executeFork',
    outputs: [
      { name: 'forkTreasury', internalType: 'address', type: 'address' },
      { name: 'forkToken', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkDAODeployer',
    outputs: [{ name: '', internalType: 'contract IForkDAODeployer', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkEndTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkEscrow',
    outputs: [{ name: '', internalType: 'contract INounsDAOForkEscrow', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'forkThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getActions',
    outputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber_', internalType: 'uint256', type: 'uint256' }],
    name: 'getDynamicQuorumParamsAt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'voter', internalType: 'address', type: 'address' },
    ],
    name: 'getReceipt',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.Receipt',
        type: 'tuple',
        components: [
          { name: 'hasVoted', internalType: 'bool', type: 'bool' },
          { name: 'support', internalType: 'uint8', type: 'uint8' },
          { name: 'votes', internalType: 'uint96', type: 'uint96' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'timelock_', internalType: 'address', type: 'address' },
      { name: 'nouns_', internalType: 'address', type: 'address' },
      { name: 'forkEscrow_', internalType: 'address', type: 'address' },
      { name: 'forkDAODeployer_', internalType: 'address', type: 'address' },
      { name: 'vetoer_', internalType: 'address', type: 'address' },
      {
        name: 'daoParams_',
        internalType: 'struct NounsDAOTypes.NounsDAOParams',
        type: 'tuple',
        components: [
          { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
          { name: 'votingDelay', internalType: 'uint256', type: 'uint256' },
          { name: 'proposalThresholdBPS', internalType: 'uint256', type: 'uint256' },
          { name: 'lastMinuteWindowInBlocks', internalType: 'uint32', type: 'uint32' },
          { name: 'objectionPeriodDurationInBlocks', internalType: 'uint32', type: 'uint32' },
          { name: 'proposalUpdatablePeriodInBlocks', internalType: 'uint32', type: 'uint32' },
        ],
      },
      {
        name: 'dynamicQuorumParams_',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
        type: 'tuple',
        components: [
          { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
          { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proposalIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'joinFork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastMinuteWindowInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'latestProposalIds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minQuorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nouns',
    outputs: [{ name: '', internalType: 'contract NounsTokenLike', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'numTokensInForkEscrow',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'objectionPeriodDurationInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingVetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'firstProposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'lastProposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'proposalEligibilityQuorumBps', internalType: 'uint16', type: 'uint16' },
      { name: 'excludeCanceled', internalType: 'bool', type: 'bool' },
      { name: 'requireVotingEnded', internalType: 'bool', type: 'bool' },
      { name: 'votingClientIds', internalType: 'uint32[]', type: 'uint32[]' },
    ],
    name: 'proposalDataForRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalForRewards[]',
        type: 'tuple[]',
        components: [
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationTimestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'clientId', internalType: 'uint32', type: 'uint32' },
          {
            name: 'voteData',
            internalType: 'struct NounsDAOTypes.ClientVoteData[]',
            type: 'tuple[]',
            components: [
              { name: 'votes', internalType: 'uint32', type: 'uint32' },
              { name: 'txs', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalMaxOperations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThresholdBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalUpdatablePeriodInBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposals',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalCondensedV2',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256' },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalsV3',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.ProposalCondensedV3',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'proposer', internalType: 'address', type: 'address' },
          { name: 'proposalThreshold', internalType: 'uint256', type: 'uint256' },
          { name: 'quorumVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'eta', internalType: 'uint256', type: 'uint256' },
          { name: 'startBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'endBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
          { name: 'canceled', internalType: 'bool', type: 'bool' },
          { name: 'vetoed', internalType: 'bool', type: 'bool' },
          { name: 'executed', internalType: 'bool', type: 'bool' },
          { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'creationBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'signers', internalType: 'address[]', type: 'address[]' },
          { name: 'updatePeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'objectionPeriodEndBlock', internalType: 'uint256', type: 'uint256' },
          { name: 'executeOnTimelockV1', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeBySigs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'proposeBySigs',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'proposeOnTimelockV1',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'clientId', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'proposeOnTimelockV1',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'queue',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParamsCheckpoint[]',
        type: 'tuple[]',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
            type: 'tuple',
            components: [
              { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumParamsCheckpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct NounsDAOTypes.DynamicQuorumParamsCheckpoint',
        type: 'tuple',
        components: [
          { name: 'fromBlock', internalType: 'uint32', type: 'uint32' },
          {
            name: 'params',
            internalType: 'struct NounsDAOTypes.DynamicQuorumParams',
            type: 'tuple',
            components: [
              { name: 'minQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'maxQuorumVotesBPS', internalType: 'uint16', type: 'uint16' },
              { name: 'quorumCoefficient', internalType: 'uint32', type: 'uint32' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumVotesBPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [{ name: '', internalType: 'enum NounsDAOTypes.ProposalState', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timelock',
    outputs: [{ name: '', internalType: 'contract INounsDAOExecutor', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timelockV1',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'proposerSignatures',
        internalType: 'struct NounsDAOTypes.ProposerSignature[]',
        type: 'tuple[]',
        components: [
          { name: 'sig', internalType: 'bytes', type: 'bytes' },
          { name: 'signer', internalType: 'address', type: 'address' },
          { name: 'expirationTimestamp', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalBySigs',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalDescription',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'signatures', internalType: 'string[]', type: 'string[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'updateMessage', internalType: 'string', type: 'string' },
    ],
    name: 'updateProposalTransactions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'veto',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'vetoer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'voteSnapshotBlockSwitchProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'to', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'withdrawDAONounsFromEscrowToTreasury',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'withdrawFromForkEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorAddress = {
  1: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
  11155111: '0x35d2670d7C8931AACdd37C89Ddcb0638c3c44A57',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const nounsGovernorConfig = { address: nounsGovernorAddress, abi: nounsGovernorAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernor = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_PROPOSAL_THRESHOLD_BPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_DELAY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MAX_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MAX_VOTING_PERIOD',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_PROPOSAL_THRESHOLD_BPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_PROPOSAL_THRESHOLD_BPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_DELAY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_DELAY',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"MIN_VOTING_PERIOD"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'MIN_VOTING_PERIOD',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"adjustedTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorAdjustedTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'adjustedTotalSupply',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"admin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorAdmin = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'admin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"dynamicQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorDynamicQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'dynamicQuorumVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"erc20TokensToIncludeInFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorErc20TokensToIncludeInFork = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'erc20TokensToIncludeInFork',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkDAODeployer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkDaoDeployer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkDAODeployer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEndTimestamp"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkEndTimestamp = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEndTimestamp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkEscrow = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkEscrow',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkPeriod',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkThreshold = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThreshold',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"forkThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorForkThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'forkThresholdBPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getActions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetActions = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getActions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getDynamicQuorumParamsAt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetDynamicQuorumParamsAt = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getDynamicQuorumParamsAt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"getReceipt"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorGetReceipt = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'getReceipt',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"lastMinuteWindowInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorLastMinuteWindowInBlocks = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'lastMinuteWindowInBlocks',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"latestProposalIds"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorLatestProposalIds = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'latestProposalIds',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"maxQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMaxQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'maxQuorumVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"minQuorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorMinQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'minQuorumVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"nouns"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorNouns = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'nouns',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"numTokensInForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorNumTokensInForkEscrow = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'numTokensInForkEscrow',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"objectionPeriodDurationInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorObjectionPeriodDurationInBlocks =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'objectionPeriodDurationInBlocks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"pendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorPendingVetoer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'pendingVetoer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalCount"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalCount = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalDataForRewards"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalDataForRewards = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalDataForRewards',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalMaxOperations"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalMaxOperations = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalMaxOperations',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalThreshold = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThreshold',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalThresholdBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalThresholdBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalThresholdBPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalUpdatablePeriodInBlocks"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalUpdatablePeriodInBlocks =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'proposalUpdatablePeriodInBlocks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposals = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposalsV3"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorProposalsV3 = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposalsV3',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumParamsCheckpoints"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumParamsCheckpoints = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumParamsCheckpoints',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotes"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumVotes = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"quorumVotesBPS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorQuorumVotesBps = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'quorumVotesBPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"state"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorState = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'state',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelock"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorTimelock = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"timelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorTimelockV1 = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'timelockV1',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"vetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVetoer = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'vetoer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"voteSnapshotBlockSwitchProposalId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVoteSnapshotBlockSwitchProposalId =
  /*#__PURE__*/ createUseReadContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'voteSnapshotBlockSwitchProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingDelay"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVotingDelay = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingDelay',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useReadNounsGovernorVotingPeriod = /*#__PURE__*/ createUseReadContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'votingPeriod',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernor = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCancel = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCancelSig = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastRefundableVote = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastRefundableVoteWithReason =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'castRefundableVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVote = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVoteBySig = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorCastVoteWithReason = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorEscrowToFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorExecute = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorExecuteFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorJoinFork = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorPropose = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorProposeBySigs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorQueue = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposal = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalBySigs',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalDescription = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposalDescription',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorUpdateProposalTransactions = /*#__PURE__*/ createUseWriteContract(
  {
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalTransactions',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorVeto = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createUseWriteContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWriteNounsGovernorWithdrawFromForkEscrow = /*#__PURE__*/ createUseWriteContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'withdrawFromForkEscrow',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernor = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancel"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCancel = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"cancelSig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCancelSig = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'cancelSig',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastRefundableVote = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castRefundableVote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castRefundableVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastRefundableVoteWithReason =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'castRefundableVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVote = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVote',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVoteBySig = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteBySig',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorCastVoteWithReason = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'castVoteWithReason',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"escrowToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorEscrowToFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'escrowToFork',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"execute"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorExecute = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'execute',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"executeFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorExecuteFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'executeFork',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"initialize"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"joinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorJoinFork = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'joinFork',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"propose"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorPropose = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'propose',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorProposeBySigs = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeBySigs',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"proposeOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorProposeOnTimelockV1 = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'proposeOnTimelockV1',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"queue"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorQueue = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'queue',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposal"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposal = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'updateProposal',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalBySigs"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalBySigs = /*#__PURE__*/ createUseSimulateContract(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, functionName: 'updateProposalBySigs' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalDescription"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalDescription =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalDescription',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"updateProposalTransactions"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorUpdateProposalTransactions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'updateProposalTransactions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"veto"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorVeto = /*#__PURE__*/ createUseSimulateContract({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  functionName: 'veto',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowIncreasingTotalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawDaoNounsFromEscrowIncreasingTotalSupply =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowIncreasingTotalSupply',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawDAONounsFromEscrowToTreasury"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawDaoNounsFromEscrowToTreasury =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawDAONounsFromEscrowToTreasury',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link nounsGovernorAbi}__ and `functionName` set to `"withdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useSimulateNounsGovernorWithdrawFromForkEscrow =
  /*#__PURE__*/ createUseSimulateContract({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    functionName: 'withdrawFromForkEscrow',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAONounsSupplyIncreasedFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorDaoNounsSupplyIncreasedFromEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAONounsSupplyIncreasedFromEscrow',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"DAOWithdrawNounsFromEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorDaoWithdrawNounsFromEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'DAOWithdrawNounsFromEscrow',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ERC20TokensToIncludeInForkSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorErc20TokensToIncludeInForkSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ERC20TokensToIncludeInForkSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"EscrowedToFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorEscrowedToForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'EscrowedToFork',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ExecuteFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorExecuteForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ExecuteFork',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkDAODeployerSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkDaoDeployerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ForkDAODeployerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkPeriodSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ForkPeriodSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ForkThresholdSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorForkThresholdSetEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ForkThresholdSet' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"JoinFork"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorJoinForkEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'JoinFork',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"LastMinuteWindowSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorLastMinuteWindowSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'LastMinuteWindowSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MaxQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorMaxQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'MaxQuorumVotesBPSSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"MinQuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorMinQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'MinQuorumVotesBPSSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewAdmin',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingAdmin"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewPendingAdminEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewPendingAdmin',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewPendingVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewPendingVetoerEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'NewPendingVetoer' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"NewVetoer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorNewVetoerEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'NewVetoer',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ObjectionPeriodDurationSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorObjectionPeriodDurationSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ObjectionPeriodDurationSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCanceledEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ProposalCanceled' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalCreated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedOnTimelockV1"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedOnTimelockV1Event =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedOnTimelockV1',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalCreatedWithRequirements"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalCreatedWithRequirementsEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalCreatedWithRequirements',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalDescriptionUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalDescriptionUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalDescriptionUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalExecutedEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: nounsGovernorAbi, address: nounsGovernorAddress, eventName: 'ProposalExecuted' },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalObjectionPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalObjectionPeriodSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalObjectionPeriodSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalQueuedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalQueued',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalThresholdBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalThresholdBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalThresholdBPSSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalTransactionsUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalTransactionsUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalTransactionsUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdatablePeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalUpdatablePeriodSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'ProposalUpdatablePeriodSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalUpdated"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalUpdatedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalUpdated',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"ProposalVetoed"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorProposalVetoedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'ProposalVetoed',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumCoefficientSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorQuorumCoefficientSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'QuorumCoefficientSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"QuorumVotesBPSSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorQuorumVotesBpsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'QuorumVotesBPSSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"RefundableVote"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorRefundableVoteEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'RefundableVote',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"SignatureCancelled"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorSignatureCancelledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'SignatureCancelled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"TimelocksAndAdminSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorTimelocksAndAdminSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'TimelocksAndAdminSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCast"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVoteCastEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VoteCast',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VoteCastWithClientId"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVoteCastWithClientIdEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'VoteCastWithClientId',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingDelaySet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVotingDelaySetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingDelaySet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"VotingPeriodSet"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorVotingPeriodSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'VotingPeriodSet',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"Withdraw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorWithdrawEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: nounsGovernorAbi,
  address: nounsGovernorAddress,
  eventName: 'Withdraw',
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link nounsGovernorAbi}__ and `eventName` set to `"WithdrawFromForkEscrow"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6f3e6272a167e8accb32072d08e0957f9c79223d)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x35d2670d7c8931aacdd37c89ddcb0638c3c44a57)
 */
export const useWatchNounsGovernorWithdrawFromForkEscrowEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: nounsGovernorAbi,
    address: nounsGovernorAddress,
    eventName: 'WithdrawFromForkEscrow',
  })
