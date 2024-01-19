import {
  assert,
  clearStore,
  test,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  createMockedFunction,
  newMockEvent,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { EscrowDeposit, EscrowedNoun, Proposal, ProposalVersion } from '../src/types/schema';
import {
  handleProposalCreatedWithRequirements,
  handleVoteCast,
  handleMinQuorumVotesBPSSet,
  handleMaxQuorumVotesBPSSet,
  handleQuorumCoefficientSet,
  handleProposalCreated,
  handleProposalObjectionPeriodSet,
  handleProposalUpdated,
  handleProposalDescriptionUpdated,
  handleProposalTransactionsUpdated,
  handleEscrowedToFork,
  handleWithdrawFromForkEscrow,
  handleProposalCanceled,
  handleProposalVetoed,
  handleProposalExecuted,
  handleProposalQueued,
} from '../src/nouns-dao';
import {
  createProposalCreatedWithRequirementsEventV1,
  createProposalCreatedWithRequirementsEventV3,
  createVoteCastEvent,
  stubProposalCreatedWithRequirementsEventInput,
  createMinQuorumVotesBPSSetEvent,
  createMaxQuorumVotesBPSSetEvent,
  createQuorumCoefficientSetEvent,
  handleAllQuorumParamEvents,
  createProposalObjectionPeriodSetEvent,
  createProposalUpdatedEvent,
  createProposalDescriptionUpdatedEvent,
  createProposalTransactionsUpdatedEvent,
  createEscrowedToForkEvent,
  createWithdrawFromForkEscrowEvent,
  createProposalCanceledEvent,
  createProposalVetoedEvent,
  createProposalExecutedEvent,
  createProposalQueuedEvent,
} from './utils';
import {
  BIGINT_10K,
  BIGINT_ONE,
  BIGINT_ZERO,
  STATUS_ACTIVE,
  STATUS_CANCELLED,
  STATUS_EXECUTED,
  STATUS_PENDING,
  STATUS_QUEUED,
  STATUS_VETOED,
} from '../src/utils/constants';
import {
  getOrCreateDynamicQuorumParams,
  getGovernanceEntity,
  getOrCreateDelegate,
  getOrCreateFork,
} from '../src/utils/helpers';
import { extractTitle, ParsedProposalV3 } from '../src/custom-types/ParsedProposalV3';

const SOME_ADDRESS = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const proposerWithDelegate = Address.fromString('0x0000000000000000000000000000000000000001');
const proposerWithNoDelegate = Address.fromString('0x0000000000000000000000000000000000000002');
const signerWithDelegate = Address.fromString('0x0000000000000000000000000000000000000003');
const signerWithNoDelegate = Address.fromString('0x0000000000000000000000000000000000000004');

const txHash = Bytes.fromI32(11);
const logIndex = BigInt.fromI32(3);
const updateBlockTimestamp = BigInt.fromI32(946684800);
const updateBlockNumber = BigInt.fromI32(15537394);
const proposalId = BigInt.fromI32(42);

afterEach(() => {
  clearStore();
});

describe('nouns-dao', () => {
  beforeEach(() => {
    const delegate = getOrCreateDelegate(proposerWithDelegate.toHexString());
    delegate.tokenHoldersRepresentedAmount = 1;
    delegate.delegatedVotes = BIGINT_ONE;
    delegate.delegatedVotesRaw = BIGINT_ONE;
    delegate.save();
  });

  describe('handleProposalCreated', () => {
    describe('with signers', () => {
      beforeAll(() => {
        const delegate = getOrCreateDelegate(signerWithDelegate.toHexString());
        delegate.tokenHoldersRepresentedAmount = 1;
        delegate.delegatedVotes = BIGINT_ONE;
        delegate.delegatedVotesRaw = BIGINT_ONE;
        delegate.save();

        createMockedFunction(
          newMockEvent().address,
          'adjustedTotalSupply',
          'adjustedTotalSupply():(uint256)',
        ).returns([ethereum.Value.fromI32(0)]);
      });

      afterAll(() => {
        clearStore();
      });

      test('uses existing delegates when they exist, and creates new ones when they are missing', () => {
        const proposalEvent = new ParsedProposalV3();
        proposalEvent.id = '1';
        proposalEvent.proposer = proposerWithDelegate.toHexString();
        proposalEvent.signers = [
          signerWithDelegate.toHexString(),
          signerWithNoDelegate.toHexString(),
        ];

        // 2 delegates because one is the proposer and the second is the signer with a delegate
        assert.entityCount('Delegate', 2);

        handleProposalCreated(proposalEvent);
        assert.entityCount('Proposal', 1);
        assert.entityCount('Delegate', 3);

        const proposal = Proposal.load('1')!;
        assert.stringEquals(proposal.proposer, proposalEvent.proposer);
        assert.stringEquals(proposal.signers![0], signerWithDelegate.toHexString());
        assert.stringEquals(proposal.signers![1], signerWithNoDelegate.toHexString());

        // The delegate that already existed has a votes balance
        assert.fieldEquals('Delegate', proposal.signers![0], 'tokenHoldersRepresentedAmount', '1');
        assert.fieldEquals('Delegate', proposal.signers![0], 'delegatedVotes', '1');
        assert.fieldEquals('Delegate', proposal.signers![0], 'delegatedVotesRaw', '1');

        // The delegate that was created on the fly has no votes
        assert.fieldEquals('Delegate', proposal.signers![1], 'tokenHoldersRepresentedAmount', '0');
        assert.fieldEquals('Delegate', proposal.signers![1], 'delegatedVotes', '0');
        assert.fieldEquals('Delegate', proposal.signers![1], 'delegatedVotesRaw', '0');
      });
    });

    describe('single proposer', () => {
      test('uses an existing delegate when it is there', () => {
        const proposalEvent = new ParsedProposalV3();
        proposalEvent.id = '1';
        proposalEvent.proposer = proposerWithDelegate.toHexString();
        assert.entityCount('Delegate', 1);

        handleProposalCreated(proposalEvent);

        assert.entityCount('Proposal', 1);
        assert.entityCount('Delegate', 1);
        assert.fieldEquals('Proposal', '1', 'proposer', proposalEvent.proposer);
        assert.fieldEquals(
          'Delegate',
          proposalEvent.proposer,
          'tokenHoldersRepresentedAmount',
          '1',
        );
        assert.fieldEquals('Delegate', proposalEvent.proposer, 'delegatedVotes', '1');
        assert.fieldEquals('Delegate', proposalEvent.proposer, 'delegatedVotesRaw', '1');
      });

      test('creates a delegate if the proposer was never seen before', () => {
        const proposalEvent = new ParsedProposalV3();
        proposalEvent.id = '1';
        proposalEvent.proposer = proposerWithNoDelegate.toHexString();
        assert.entityCount('Delegate', 1);

        handleProposalCreated(proposalEvent);

        assert.entityCount('Proposal', 1);
        assert.entityCount('Delegate', 2);
        assert.fieldEquals('Proposal', '1', 'proposer', proposalEvent.proposer);
        assert.fieldEquals(
          'Delegate',
          proposalEvent.proposer,
          'tokenHoldersRepresentedAmount',
          '0',
        );
        assert.fieldEquals('Delegate', proposalEvent.proposer, 'delegatedVotes', '0');
        assert.fieldEquals('Delegate', proposalEvent.proposer, 'delegatedVotesRaw', '0');
      });
    });

    describe('field setting', () => {
      test('copies values from ParsedProposalV3 and saves a ProposalVersion', () => {
        const proposalEvent = new ParsedProposalV3();
        proposalEvent.id = '42';
        proposalEvent.proposer = proposerWithDelegate.toHexString();
        proposalEvent.targets = changetype<Bytes[]>([Address.fromString(SOME_ADDRESS)]);
        proposalEvent.values = [BigInt.fromI32(123)];
        proposalEvent.signatures = ['some signature'];
        proposalEvent.calldatas = [Bytes.fromI32(312)];
        proposalEvent.createdTimestamp = BigInt.fromI32(946684800);
        proposalEvent.createdBlock = BigInt.fromI32(15537394);
        proposalEvent.createdTransactionHash = Bytes.fromI32(11);
        proposalEvent.startBlock = proposalEvent.createdBlock.plus(BigInt.fromI32(200));
        proposalEvent.endBlock = proposalEvent.createdBlock.plus(BigInt.fromI32(300));
        proposalEvent.updatePeriodEndBlock = proposalEvent.createdBlock.plus(BigInt.fromI32(100));
        proposalEvent.proposalThreshold = BigInt.fromI32(7);
        proposalEvent.quorumVotes = BigInt.fromI32(60);
        proposalEvent.description = 'some description';
        proposalEvent.title = 'some title';
        proposalEvent.status = STATUS_PENDING;
        proposalEvent.txHash = Bytes.fromI32(11223344).toHexString();
        proposalEvent.logIndex = '2';

        handleProposalCreated(proposalEvent);
        const proposal = Proposal.load('42')!;

        assert.stringEquals(proposal.proposer, proposalEvent.proposer);
        assert.bytesEquals(proposal.targets![0], proposalEvent.targets[0]);
        assert.bigIntEquals(proposal.values![0], proposalEvent.values[0]);
        assert.stringEquals(proposal.signatures![0], proposalEvent.signatures[0]);
        assert.bytesEquals(proposal.calldatas![0], proposalEvent.calldatas[0]);
        assert.bigIntEquals(proposal.createdTimestamp, proposalEvent.createdTimestamp);
        assert.bigIntEquals(proposal.createdBlock, proposalEvent.createdBlock);
        assert.bytesEquals(proposal.createdTransactionHash, proposalEvent.createdTransactionHash);
        assert.bigIntEquals(proposal.startBlock, proposalEvent.startBlock);
        assert.bigIntEquals(proposal.endBlock, proposalEvent.endBlock);
        assert.bigIntEquals(proposal.updatePeriodEndBlock, proposalEvent.updatePeriodEndBlock);
        assert.bigIntEquals(proposal.proposalThreshold, proposalEvent.proposalThreshold);
        assert.bigIntEquals(proposal.quorumVotes, proposalEvent.quorumVotes);
        assert.stringEquals(proposal.description, proposalEvent.description);
        assert.stringEquals(proposal.title, proposalEvent.title);
        assert.stringEquals(proposal.status, proposalEvent.status);

        const versionId = proposalEvent.txHash.concat('-').concat(proposalEvent.logIndex);
        const propVersion = ProposalVersion.load(versionId)!;
        assert.stringEquals('42', propVersion.proposal);
        assert.bigIntEquals(proposalEvent.createdTimestamp, propVersion.createdAt);
        assert.bytesEquals(changetype<Bytes[]>(proposalEvent.targets)[0], propVersion.targets![0]);
        assert.bigIntEquals(proposalEvent.values[0], propVersion.values![0]);
        assert.stringEquals(proposalEvent.signatures[0], propVersion.signatures![0]);
        assert.bytesEquals(proposalEvent.calldatas[0], propVersion.calldatas![0]);
        assert.stringEquals(proposalEvent.description, propVersion.description);
        assert.stringEquals(proposalEvent.title, propVersion.title);
        assert.stringEquals('', propVersion.updateMessage);
      });

      test('copies values from governance and dynamic quorum', () => {
        const governance = getGovernanceEntity();
        governance.totalTokenHolders = BigInt.fromI32(601);
        governance.save();

        const dq = getOrCreateDynamicQuorumParams();
        dq.minQuorumVotesBPS = 100;
        dq.maxQuorumVotesBPS = 150;
        dq.quorumCoefficient = BIGINT_ONE;
        dq.save();

        const proposalEvent = new ParsedProposalV3();
        proposalEvent.proposer = proposerWithDelegate.toHexString();
        proposalEvent.id = '43';
        handleProposalCreated(proposalEvent);

        assert.fieldEquals('Proposal', '43', 'totalSupply', '601');
        assert.fieldEquals('Proposal', '43', 'minQuorumVotesBPS', '100');
        assert.fieldEquals('Proposal', '43', 'maxQuorumVotesBPS', '150');
        assert.fieldEquals('Proposal', '43', 'quorumCoefficient', '1');
      });

      test('sets votes and objection period block to zero', () => {
        const proposalEvent = new ParsedProposalV3();
        proposalEvent.proposer = proposerWithDelegate.toHexString();
        proposalEvent.id = '44';
        handleProposalCreated(proposalEvent);

        assert.fieldEquals('Proposal', '44', 'forVotes', '0');
        assert.fieldEquals('Proposal', '44', 'againstVotes', '0');
        assert.fieldEquals('Proposal', '44', 'abstainVotes', '0');
        assert.fieldEquals('Proposal', '44', 'objectionPeriodEndBlock', '0');
      });
    });
  });

  describe('handleVoteCast', () => {
    afterEach(() => {
      clearStore();
    });

    test('given V1 prop does not update quorumVotes using dynamic quorum', () => {
      getOrCreateDelegate(SOME_ADDRESS);
      const totalSupply = BigInt.fromI32(200);

      // Set total supply
      const governance = getGovernanceEntity();
      governance.totalTokenHolders = totalSupply;
      governance.save();

      // Save dynamic quorum params
      handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_500_000));

      const dqParams = getOrCreateDynamicQuorumParams(null);
      assert.bigIntEquals(BIGINT_ZERO, dqParams.dynamicQuorumStartBlock as BigInt);

      // Create prop with state we need for quorum inputs
      // providing block number zero means this prop will look like a V1 prop
      // since the DQ events above are simulated to be at block zero
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      handleProposalCreatedWithRequirements(newPropEvent);
      const propId = BIGINT_ONE;

      let savedProp = Proposal.load(propId.toString());
      assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes);

      const voter = Address.fromString(SOME_ADDRESS);
      const support = 0; // against
      const votes = BigInt.fromI32(32);
      const voteEvent = createVoteCastEvent(voter, propId, support, votes);

      handleVoteCast(voteEvent);

      savedProp = Proposal.load(propId.toString());
      assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes);
    });

    test('updates quorumVotes using dynamic quorum math', () => {
      getOrCreateDelegate(SOME_ADDRESS);
      const totalSupply = BigInt.fromI32(200);

      // Set total supply
      const governance = getGovernanceEntity();
      governance.totalTokenHolders = totalSupply;
      governance.save();

      // Save dynamic quorum params
      handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_500_000));

      const dqParams = getOrCreateDynamicQuorumParams(null);
      assert.bigIntEquals(BIGINT_ZERO, dqParams.dynamicQuorumStartBlock as BigInt);

      // Create prop with state we need for quorum inputs
      // providing a block number greater than zero means this prop will look like a V2 prop
      // since the DQ events above are simulated to be at block zero
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ONE);
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      handleProposalCreatedWithRequirements(newPropEvent);

      const voter = Address.fromString(SOME_ADDRESS);
      const propId = BIGINT_ONE;
      const support = 0; // against
      const votes = BigInt.fromI32(32);
      const voteEvent = createVoteCastEvent(voter, propId, support, votes);

      handleVoteCast(voteEvent);

      const savedProp = Proposal.load(propId.toString());

      assert.bigIntEquals(BigInt.fromI32(68), savedProp!.quorumVotes);
    });

    test('uses quorum params from prop creation time, not newer params', () => {
      getOrCreateDelegate(SOME_ADDRESS);
      const totalSupply = BigInt.fromI32(200);

      // Set total supply
      const governance = getGovernanceEntity();
      governance.totalTokenHolders = totalSupply;
      governance.save();

      // Save dynamic quorum params
      handleAllQuorumParamEvents(1000, 4000, BigInt.fromI32(1_200_000));

      // Create prop with state we need for quorum inputs
      // providing a block number greater than zero means this prop will look like a V2 prop
      // since the DQ events above are simulated to be at block zero
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ONE);
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);
      handleProposalCreatedWithRequirements(newPropEvent);

      handleAllQuorumParamEvents(500, 6000, BigInt.fromI32(3_000_000));

      const voter = Address.fromString(SOME_ADDRESS);
      const propId = BIGINT_ONE;
      const support = 0; // against
      const votes = BigInt.fromI32(25);
      const voteEvent = createVoteCastEvent(voter, propId, support, votes);

      handleVoteCast(voteEvent);

      const savedProp = Proposal.load(propId.toString());

      assert.bigIntEquals(BigInt.fromI32(50), savedProp!.quorumVotes);
    });
  });

  describe('dynamic quorum config handlers', () => {
    afterEach(() => {
      clearStore();
    });

    test('handleMinQuorumVotesBPSSet: saves incoming values', () => {
      const event1 = createMinQuorumVotesBPSSetEvent(0, 1);
      handleMinQuorumVotesBPSSet(event1);
      assert.i32Equals(1, getOrCreateDynamicQuorumParams(BIGINT_ZERO).minQuorumVotesBPS);

      const event2 = createMinQuorumVotesBPSSetEvent(1, 2);
      handleMinQuorumVotesBPSSet(event2);
      assert.i32Equals(2, getOrCreateDynamicQuorumParams(BIGINT_ZERO).minQuorumVotesBPS);
    });

    test('handleMaxQuorumVotesBPSSet: saves incoming values', () => {
      const event1 = createMaxQuorumVotesBPSSetEvent(0, 1000);
      handleMaxQuorumVotesBPSSet(event1);
      assert.i32Equals(1000, getOrCreateDynamicQuorumParams(BIGINT_ZERO).maxQuorumVotesBPS);

      const event2 = createMaxQuorumVotesBPSSetEvent(1000, 2000);
      handleMaxQuorumVotesBPSSet(event2);
      assert.i32Equals(2000, getOrCreateDynamicQuorumParams(BIGINT_ZERO).maxQuorumVotesBPS);
    });

    test('handleQuorumCoefficientSet: saves incoming values', () => {
      const event1 = createQuorumCoefficientSetEvent(BIGINT_ZERO, BIGINT_ONE);
      handleQuorumCoefficientSet(event1);
      assert.bigIntEquals(
        BIGINT_ONE,
        getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient,
      );

      const event2 = createQuorumCoefficientSetEvent(BIGINT_ONE, BIGINT_10K);
      handleQuorumCoefficientSet(event2);
      assert.bigIntEquals(
        BIGINT_10K,
        getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient,
      );
    });
  });

  describe('handleProposalObjectionPeriodSet', () => {
    test('sets the objectionPeriodEndBlock field', () => {
      const proposalEvent = new ParsedProposalV3();
      proposalEvent.id = '1';
      proposalEvent.proposer = proposerWithDelegate.toHexString();

      handleProposalCreated(proposalEvent);
      assert.fieldEquals('Proposal', '1', 'objectionPeriodEndBlock', '0');

      handleProposalObjectionPeriodSet(
        createProposalObjectionPeriodSetEvent(BIGINT_ONE, BIGINT_10K),
      );
      assert.fieldEquals('Proposal', '1', 'objectionPeriodEndBlock', '10000');
    });
  });

  describe('Proposal Updated', () => {
    beforeEach(() => {
      const proposalEvent = new ParsedProposalV3();
      proposalEvent.id = proposalId.toString();
      proposalEvent.proposer = proposerWithDelegate.toHexString();
      proposalEvent.createdTimestamp = updateBlockTimestamp.minus(BIGINT_ONE);
      proposalEvent.createdBlock = updateBlockNumber.minus(BIGINT_ONE);
      proposalEvent.targets = [signerWithNoDelegate];
      proposalEvent.values = [BigInt.fromI32(987)];
      proposalEvent.signatures = ['first signature'];
      proposalEvent.calldatas = [Bytes.fromI32(888)];
      proposalEvent.description = '# Original Title\nOriginal body';
      proposalEvent.title = extractTitle(proposalEvent.description);

      handleProposalCreated(proposalEvent);
    });

    test('handleProposalDescriptionUpdated', () => {
      const updateDescription = '# Updated Title\nUpdated body';
      const updateMessage = 'some update message';

      handleProposalDescriptionUpdated(
        createProposalDescriptionUpdatedEvent(
          txHash,
          logIndex,
          updateBlockTimestamp,
          updateBlockNumber,
          proposalId,
          proposerWithDelegate,
          updateDescription,
          updateMessage,
        ),
      );

      const proposal = Proposal.load(proposalId.toString())!;
      assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp);
      assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock);
      assert.stringEquals(updateDescription, proposal.description);
      assert.stringEquals(extractTitle(updateDescription), proposal.title);

      // check that the original values remained as is
      assert.bytesEquals(signerWithNoDelegate, proposal.targets![0]);
      assert.bigIntEquals(BigInt.fromI32(987), proposal.values![0]);
      assert.stringEquals('first signature', proposal.signatures![0]);
      assert.bytesEquals(Bytes.fromI32(888), proposal.calldatas![0]);

      const updatedVersionId = txHash.toHexString().concat('-').concat(logIndex.toString());
      const updatedVersion = ProposalVersion.load(updatedVersionId)!;
      assert.stringEquals(proposalId.toString(), updatedVersion.proposal);
      assert.bigIntEquals(updateBlockTimestamp, updatedVersion.createdAt);
      assert.stringEquals(updateDescription, updatedVersion.description);
      assert.stringEquals(extractTitle(updateDescription), updatedVersion.title);
      assert.stringEquals(updateMessage, updatedVersion.updateMessage);

      // check that the original values are saved
      assert.bytesEquals(signerWithNoDelegate, updatedVersion.targets![0]);
      assert.bigIntEquals(BigInt.fromI32(987), updatedVersion.values![0]);
      assert.stringEquals('first signature', updatedVersion.signatures![0]);
      assert.bytesEquals(Bytes.fromI32(888), updatedVersion.calldatas![0]);
    });

    test('handleProposalTransactionsUpdated', () => {
      const updateTargets = [signerWithDelegate];
      const updateValues = [BigInt.fromI32(321)];
      const updateSignatures = ['update signature'];
      const updateCalldatas = [Bytes.fromI32(312)];
      const updateMessage = 'some update message';

      handleProposalTransactionsUpdated(
        createProposalTransactionsUpdatedEvent(
          txHash,
          logIndex,
          updateBlockTimestamp,
          updateBlockNumber,
          proposalId,
          proposerWithDelegate,
          updateTargets,
          updateValues,
          updateSignatures,
          updateCalldatas,
          updateMessage,
        ),
      );

      const proposal = Proposal.load(proposalId.toString())!;
      assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp);
      assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock);
      assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], proposal.targets![0]);
      assert.bigIntEquals(updateValues[0], proposal.values![0]);
      assert.stringEquals(updateSignatures[0], proposal.signatures![0]);
      assert.bytesEquals(updateCalldatas[0], proposal.calldatas![0]);

      // check that the original values remained as is
      assert.stringEquals('# Original Title\nOriginal body', proposal.description);
      assert.stringEquals('Original Title', proposal.title);

      const updatedVersionId = txHash.toHexString().concat('-').concat(logIndex.toString());
      const updatedVersion = ProposalVersion.load(updatedVersionId)!;
      assert.stringEquals(proposalId.toString(), updatedVersion.proposal);
      assert.bigIntEquals(updateBlockTimestamp, updatedVersion.createdAt);
      assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], updatedVersion.targets![0]);
      assert.bigIntEquals(updateValues[0], updatedVersion.values![0]);
      assert.stringEquals(updateSignatures[0], updatedVersion.signatures![0]);
      assert.bytesEquals(updateCalldatas[0], updatedVersion.calldatas![0]);
      assert.stringEquals(updateMessage, updatedVersion.updateMessage);

      // check that the original values are saved
      assert.stringEquals('# Original Title\nOriginal body', updatedVersion.description);
      assert.stringEquals('Original Title', updatedVersion.title);
    });

    test('handleProposalUpdated', () => {
      const updateTargets = [signerWithDelegate];
      const updateValues = [BigInt.fromI32(321)];
      const updateSignatures = ['update signature'];
      const updateCalldatas = [Bytes.fromI32(312)];
      const updateDescription = '# Updated Title\nUpdated body';
      const updateMessage = 'some update message';

      handleProposalUpdated(
        createProposalUpdatedEvent(
          txHash,
          logIndex,
          updateBlockTimestamp,
          updateBlockNumber,
          proposalId,
          proposerWithDelegate,
          updateTargets,
          updateValues,
          updateSignatures,
          updateCalldatas,
          updateDescription,
          updateMessage,
        ),
      );

      const proposal = Proposal.load(proposalId.toString())!;
      assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp);
      assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock);
      assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], proposal.targets![0]);
      assert.bigIntEquals(updateValues[0], proposal.values![0]);
      assert.stringEquals(updateSignatures[0], proposal.signatures![0]);
      assert.bytesEquals(updateCalldatas[0], proposal.calldatas![0]);
      assert.stringEquals(updateDescription, proposal.description);
      assert.stringEquals(extractTitle(updateDescription), proposal.title);

      const updatedVersionId = txHash.toHexString().concat('-').concat(logIndex.toString());
      const updatedVersion = ProposalVersion.load(updatedVersionId)!;
      assert.stringEquals(proposalId.toString(), updatedVersion.proposal);
      assert.bigIntEquals(updateBlockTimestamp, updatedVersion.createdAt);
      assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], updatedVersion.targets![0]);
      assert.bigIntEquals(updateValues[0], updatedVersion.values![0]);
      assert.stringEquals(updateSignatures[0], updatedVersion.signatures![0]);
      assert.bytesEquals(updateCalldatas[0], updatedVersion.calldatas![0]);
      assert.stringEquals(updateDescription, updatedVersion.description);
      assert.stringEquals(extractTitle(updateDescription), updatedVersion.title);
      assert.stringEquals(updateMessage, updatedVersion.updateMessage);
    });
  });
});

describe('ParsedProposalV3', () => {
  describe('status set to PENDING', () => {
    test('fromV1Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV1Event(newPropEvent);

      assert.stringEquals(parsedProposal.status, STATUS_PENDING);
    });
    test('fromV3Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
      const newPropEvent = createProposalCreatedWithRequirementsEventV3(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV3Event(newPropEvent);

      assert.stringEquals(parsedProposal.status, STATUS_PENDING);
    });
  });
  describe('status set to ACTIVE', () => {
    test('fromV1Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
      propEventInput.eventBlockNumber = BigInt.fromI32(42);
      propEventInput.startBlock = BigInt.fromI32(41);
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV1Event(newPropEvent);

      assert.stringEquals(parsedProposal.status, STATUS_ACTIVE);
    });
    test('fromV3Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput(BIGINT_ZERO);
      propEventInput.eventBlockNumber = BigInt.fromI32(42);
      propEventInput.startBlock = BigInt.fromI32(41);
      const newPropEvent = createProposalCreatedWithRequirementsEventV3(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV3Event(newPropEvent);

      assert.stringEquals(parsedProposal.status, STATUS_ACTIVE);
    });
  });

  describe('extracts title', () => {
    test('fromV1Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput();
      propEventInput.description = '# Title text\nBody text';
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV1Event(newPropEvent);

      assert.stringEquals(parsedProposal.title, 'Title text');
      assert.stringEquals(parsedProposal.description, propEventInput.description);
    });
    test('fromV3Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput();
      propEventInput.description = '# Title text\nBody text';
      const newPropEvent = createProposalCreatedWithRequirementsEventV3(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV3Event(newPropEvent);

      assert.stringEquals(parsedProposal.title, 'Title text');
      assert.stringEquals(parsedProposal.description, propEventInput.description);
    });
  });

  describe('parses signers', () => {
    test('fromV1Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput();
      propEventInput.signers = [Address.fromString(SOME_ADDRESS)];
      const newPropEvent = createProposalCreatedWithRequirementsEventV1(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV1Event(newPropEvent);

      assert.i32Equals(parsedProposal.signers.length, 0);
    });
    test('fromV3Event', () => {
      const propEventInput = stubProposalCreatedWithRequirementsEventInput();
      propEventInput.signers = [Address.fromString(SOME_ADDRESS), proposerWithDelegate];
      const newPropEvent = createProposalCreatedWithRequirementsEventV3(propEventInput);

      const parsedProposal = ParsedProposalV3.fromV3Event(newPropEvent);

      assert.i32Equals(parsedProposal.signers.length, 2);
      assert.stringEquals(parsedProposal.signers[0], SOME_ADDRESS);
      assert.stringEquals(parsedProposal.signers[1], proposerWithDelegate.toHexString());
    });
  });
});

describe('forking', () => {
  describe('escrow deposit and withdraw', () => {
    afterAll(() => {
      clearStore();
    });

    test('one deposit with 3 nouns, one withdrawal of 1 noun, results in 2 escrowed nouns', () => {
      const escrowBlockTimestamp = BigInt.fromI32(946684800);
      const withdrawBlockTimestamp = BigInt.fromI32(956684800);
      const nouner = Address.fromString('0x0000000000000000000000000000000000000001');
      const depositTokenIds = [BigInt.fromI32(1), BigInt.fromI32(4), BigInt.fromI32(2)];
      const withdrawTokenIds = [BigInt.fromI32(1)];
      const proposalIds = [BigInt.fromI32(1234)];
      const forkId = BIGINT_ZERO;

      handleEscrowedToFork(
        createEscrowedToForkEvent(
          txHash,
          BIGINT_ZERO,
          escrowBlockTimestamp,
          nouner,
          depositTokenIds,
          proposalIds,
          'some reason',
          forkId,
        ),
      );

      handleWithdrawFromForkEscrow(
        createWithdrawFromForkEscrowEvent(
          txHash,
          BIGINT_ZERO,
          withdrawBlockTimestamp,
          nouner,
          withdrawTokenIds,
          forkId,
        ),
      );

      const fork = getOrCreateFork(forkId);
      assert.i32Equals(fork.tokensInEscrowCount, 2);
      assert.i32Equals(fork.escrowedNouns.load().length, 2);

      let escrowedNoun = EscrowedNoun.load(forkId.toString().concat('-4'))!;
      let escrowDespositId = txHash.toHexString().concat('-0');
      assert.stringEquals(escrowedNoun.fork, forkId.toString());
      assert.stringEquals(escrowedNoun.noun, '4');
      assert.stringEquals(escrowedNoun.owner, nouner.toHexString());
      assert.stringEquals(escrowedNoun.escrowDeposit, escrowDespositId);

      let escrowDeposit = EscrowDeposit.load(escrowDespositId)!;
      assert.stringEquals(escrowDeposit.fork, forkId.toString());
      assert.bigIntEquals(escrowDeposit.createdAt, escrowBlockTimestamp);
      assert.stringEquals(escrowDeposit.owner, nouner.toHexString());
      assert.i32Equals(escrowDeposit.tokenIDs.length, 3);
      assert.bigIntEquals(escrowDeposit.tokenIDs[0], BigInt.fromI32(1));
      assert.bigIntEquals(escrowDeposit.tokenIDs[1], BigInt.fromI32(4));
      assert.bigIntEquals(escrowDeposit.tokenIDs[2], BigInt.fromI32(2));
      assert.bigIntEquals(escrowDeposit.proposalIDs[0], BigInt.fromI32(1234));
      assert.stringEquals(escrowDeposit.reason!, 'some reason');
    });
  });
});

describe('Proposal status changes', () => {
  beforeEach(() => {
    const proposalEvent = new ParsedProposalV3();
    proposalEvent.id = proposalId.toString();
    proposalEvent.proposer = proposerWithDelegate.toHexString();
    proposalEvent.targets = changetype<Bytes[]>([Address.fromString(SOME_ADDRESS)]);
    proposalEvent.values = [BigInt.fromI32(123)];
    proposalEvent.signatures = ['some signature'];
    proposalEvent.signers = [proposerWithDelegate.toHexString()];
    proposalEvent.calldatas = [Bytes.fromI32(312)];
    proposalEvent.createdTimestamp = updateBlockTimestamp.minus(BIGINT_ONE);
    proposalEvent.createdBlock = updateBlockNumber.minus(BIGINT_ONE);
    proposalEvent.createdTransactionHash = Bytes.fromI32(11);
    proposalEvent.description = 'some description';
    proposalEvent.title = 'some title';

    handleProposalCreated(proposalEvent);
  });

  test('handleProposalCanceled', () => {
    handleProposalCanceled(
      createProposalCanceledEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        proposalId,
      ),
    );

    const proposal = Proposal.load(proposalId.toString())!;
    assert.stringEquals(STATUS_CANCELLED, proposal.status);
    assert.bigIntEquals(updateBlockTimestamp, proposal.canceledTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.canceledBlock!);
  });

  test('handleProposalVetoed', () => {
    handleProposalVetoed(
      createProposalVetoedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        proposalId,
      ),
    );

    const proposal = Proposal.load(proposalId.toString())!;
    assert.stringEquals(STATUS_VETOED, proposal.status);
    assert.bigIntEquals(updateBlockTimestamp, proposal.vetoedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.vetoedBlock!);
  });

  test('handleProposalQueued', () => {
    const eta = updateBlockTimestamp.plus(BigInt.fromI32(100));
    handleProposalQueued(
      createProposalQueuedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        proposalId,
        eta,
      ),
    );

    const proposal = Proposal.load(proposalId.toString())!;
    assert.stringEquals(STATUS_QUEUED, proposal.status);
    assert.bigIntEquals(updateBlockTimestamp, proposal.queuedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.queuedBlock!);
    assert.bigIntEquals(eta, proposal.executionETA!);
  });

  test('handleProposalExecuted', () => {
    handleProposalExecuted(
      createProposalExecutedEvent(
        txHash,
        logIndex,
        updateBlockTimestamp,
        updateBlockNumber,
        proposalId,
      ),
    );

    const proposal = Proposal.load(proposalId.toString())!;
    assert.stringEquals(STATUS_EXECUTED, proposal.status);
    assert.bigIntEquals(updateBlockTimestamp, proposal.executedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.executedBlock!);
  });
});
