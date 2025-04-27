import {
  assert,
  clearStore,
  test,
  describe,
  afterAll,
  beforeEach,
  afterEach,
  createMockedFunction,
} from 'matchstick-as/assembly/index';
import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { EscrowDeposit, EscrowedNoun, Proposal, ProposalVersion } from '../src/types/schema';
import {
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
  saveProposalExtraDetails,
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
  createProposalCreatedEvent,
  ProposalCreatedData,
} from './utils';
import {
  BIGINT_10K,
  BIGINT_ONE,
  BIGINT_ZERO,
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

    createMockedFunction(
      Address.fromString(SOME_ADDRESS),
      'adjustedTotalSupply',
      'adjustedTotalSupply():(uint256)',
    ).returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(600))]);
  });

  describe('handleProposalCreated', () => {
    describe('field setting', () => {
      test('copies values from ParsedProposalV3 and saves a ProposalVersion', () => {
        const createdBlock = BigInt.fromI32(100);
        const propData = new ProposalCreatedData();
        propData.id = BigInt.fromI32(42);
        propData.proposer = proposerWithDelegate;
        propData.targets = [Address.fromString(SOME_ADDRESS)];
        propData.values = [BigInt.fromI32(123)];
        propData.signatures = ['some signature'];
        propData.calldatas = [Bytes.fromI32(312)];
        propData.startBlock = createdBlock.plus(BigInt.fromI32(200));
        propData.endBlock = createdBlock.plus(BigInt.fromI32(300));
        propData.description = 'some description';
        propData.eventBlockNumber = createdBlock;
        propData.eventBlockTimestamp = BigInt.fromI32(946684800);
        propData.txHash = Bytes.fromI32(11);
        propData.logIndex = BigInt.fromI32(2);
        propData.address = Address.fromString(SOME_ADDRESS);

        const propExtraDetails = new ParsedProposalV3();
        propExtraDetails.id = propData.id.toString();
        propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
        propExtraDetails.proposalThreshold = BigInt.fromI32(42);
        propExtraDetails.quorumVotes = BigInt.fromI32(43);

        handleProposalCreated(createProposalCreatedEvent(propData));
        saveProposalExtraDetails(propExtraDetails);

        const proposal = Proposal.load('42')!;
        assert.stringEquals(proposal.proposer!, propData.proposer.toHexString());
        assert.bytesEquals(proposal.targets![0], propData.targets[0]);
        assert.bigIntEquals(proposal.values![0], propData.values[0]);
        assert.stringEquals(proposal.signatures![0], propData.signatures[0]);
        assert.bytesEquals(proposal.calldatas![0], propData.calldatas[0]);
        assert.bigIntEquals(proposal.createdTimestamp!, propData.eventBlockTimestamp);
        assert.bigIntEquals(proposal.createdBlock!, propData.eventBlockNumber);
        assert.bytesEquals(proposal.createdTransactionHash!, propData.txHash);
        assert.bigIntEquals(proposal.startBlock!, propData.startBlock);
        assert.bigIntEquals(proposal.endBlock!, propData.endBlock);
        assert.bigIntEquals(proposal.updatePeriodEndBlock!, propExtraDetails.updatePeriodEndBlock);
        assert.bigIntEquals(proposal.proposalThreshold!, propExtraDetails.proposalThreshold);
        assert.bigIntEquals(proposal.quorumVotes!, propExtraDetails.quorumVotes);
        assert.stringEquals(proposal.description!, propData.description);
        assert.stringEquals(proposal.title!, extractTitle(propData.description));
        assert.stringEquals(proposal.status!, STATUS_PENDING);
        const versionId = propData.txHash
          .toHexString()
          .concat('-')
          .concat(propData.logIndex.toString());
        const propVersion = ProposalVersion.load(versionId)!;
        assert.stringEquals('42', propVersion.proposal);
        assert.bigIntEquals(propData.eventBlockTimestamp, propVersion.createdAt);
        assert.bytesEquals(changetype<Bytes[]>(propData.targets)[0], propVersion.targets![0]);
        assert.bigIntEquals(propData.values[0], propVersion.values![0]);
        assert.stringEquals(propData.signatures[0], propVersion.signatures![0]);
        assert.bytesEquals(propData.calldatas[0], propVersion.calldatas![0]);
        assert.stringEquals(propData.description, propVersion.description);
        assert.stringEquals(extractTitle(propData.description), propVersion.title);
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

        const data = new ProposalCreatedData();
        data.id = BigInt.fromI32(43);
        data.proposer = proposerWithDelegate;
        data.description = 'some description';
        data.txHash = Bytes.fromI32(11);
        data.logIndex = BigInt.fromI32(2);
        data.address = Address.fromString(SOME_ADDRESS);
        const proposalEvent = createProposalCreatedEvent(data);

        handleProposalCreated(proposalEvent);

        assert.fieldEquals('Proposal', '43', 'totalSupply', '601');
        assert.fieldEquals('Proposal', '43', 'minQuorumVotesBPS', '100');
        assert.fieldEquals('Proposal', '43', 'maxQuorumVotesBPS', '150');
        assert.fieldEquals('Proposal', '43', 'quorumCoefficient', '1');
      });
      test('sets votes and objection period block to zero', () => {
        const data = new ProposalCreatedData();
        data.id = BigInt.fromI32(44);
        data.proposer = proposerWithDelegate;
        data.description = 'some description';
        data.txHash = Bytes.fromI32(11);
        data.logIndex = BigInt.fromI32(2);
        data.address = Address.fromString(SOME_ADDRESS);
        const proposalEvent = createProposalCreatedEvent(data);

        handleProposalCreated(proposalEvent);

        assert.fieldEquals('Proposal', '44', 'forVotes', '0');
        assert.fieldEquals('Proposal', '44', 'againstVotes', '0');
        assert.fieldEquals('Proposal', '44', 'abstainVotes', '0');
        assert.fieldEquals('Proposal', '44', 'objectionPeriodEndBlock', '0');
      });
    });
  });
});

describe('handleVoteCast', () => {
  beforeEach(() => {
    createMockedFunction(
      Address.fromString(SOME_ADDRESS),
      'adjustedTotalSupply',
      'adjustedTotalSupply():(uint256)',
    ).returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(200))]);
  });
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
    const data = new ProposalCreatedData();
    data.id = BIGINT_ONE;
    data.proposer = proposerWithDelegate;
    data.description = 'some description';
    data.txHash = Bytes.fromI32(11);
    data.logIndex = BigInt.fromI32(2);
    data.address = Address.fromString(SOME_ADDRESS);
    data.eventBlockNumber = BIGINT_ZERO;
    handleProposalCreated(createProposalCreatedEvent(data));

    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = data.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BigInt.fromI32(42);
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);

    let savedProp = Proposal.load(data.id.toString());
    assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes!);

    const voter = Address.fromString(SOME_ADDRESS);
    const support = 0; // against
    const votes = BigInt.fromI32(32);
    const voteEvent = createVoteCastEvent(voter, data.id, support, votes);
    handleVoteCast(voteEvent);

    savedProp = Proposal.load(data.id.toString());
    assert.bigIntEquals(BIGINT_ONE, savedProp!.quorumVotes!);
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
    const data = new ProposalCreatedData();
    data.id = BIGINT_ONE;
    data.proposer = proposerWithDelegate;
    data.description = 'some description';
    data.txHash = Bytes.fromI32(11);
    data.logIndex = BigInt.fromI32(2);
    data.address = Address.fromString(SOME_ADDRESS);
    data.eventBlockNumber = BIGINT_ONE;
    handleProposalCreated(createProposalCreatedEvent(data));

    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = data.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BIGINT_ONE;
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);

    const voter = Address.fromString(SOME_ADDRESS);
    const propId = BIGINT_ONE;
    const support = 0; // against
    const votes = BigInt.fromI32(32);
    const voteEvent = createVoteCastEvent(voter, propId, support, votes);
    handleVoteCast(voteEvent);
    const savedProp = Proposal.load(propId.toString());
    assert.bigIntEquals(BigInt.fromI32(68), savedProp!.quorumVotes!);
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
    const data = new ProposalCreatedData();
    data.id = BIGINT_ONE;
    data.proposer = proposerWithDelegate;
    data.description = 'some description';
    data.txHash = Bytes.fromI32(11);
    data.logIndex = BigInt.fromI32(2);
    data.address = Address.fromString(SOME_ADDRESS);
    data.eventBlockNumber = BIGINT_ONE;
    handleProposalCreated(createProposalCreatedEvent(data));
    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = data.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BIGINT_ONE;
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);

    handleAllQuorumParamEvents(500, 6000, BigInt.fromI32(3_000_000));
    const voter = Address.fromString(SOME_ADDRESS);
    const propId = BIGINT_ONE;
    const support = 0; // against
    const votes = BigInt.fromI32(25);
    const voteEvent = createVoteCastEvent(voter, propId, support, votes);
    handleVoteCast(voteEvent);
    const savedProp = Proposal.load(propId.toString());
    assert.bigIntEquals(BigInt.fromI32(50), savedProp!.quorumVotes!);
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
    assert.bigIntEquals(BIGINT_ONE, getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient);

    const event2 = createQuorumCoefficientSetEvent(BIGINT_ONE, BIGINT_10K);
    handleQuorumCoefficientSet(event2);
    assert.bigIntEquals(BIGINT_10K, getOrCreateDynamicQuorumParams(BIGINT_ZERO).quorumCoefficient);
  });
});

describe('handleProposalObjectionPeriodSet', () => {
  test('sets the objectionPeriodEndBlock field', () => {
    const propData = new ProposalCreatedData();
    propData.id = BIGINT_ONE;
    propData.proposer = proposerWithDelegate;
    propData.targets = [Address.fromString(SOME_ADDRESS)];
    propData.values = [BigInt.fromI32(123)];
    propData.signatures = ['some signature'];
    propData.calldatas = [Bytes.fromI32(312)];
    propData.startBlock = BigInt.fromI32(203);
    propData.endBlock = BigInt.fromI32(303);
    propData.description = 'some description';
    propData.eventBlockNumber = BigInt.fromI32(103);
    propData.eventBlockTimestamp = BigInt.fromI32(42);
    propData.txHash = Bytes.fromI32(11);
    propData.logIndex = BigInt.fromI32(1);
    propData.address = Address.fromString(SOME_ADDRESS);
    handleProposalCreated(createProposalCreatedEvent(propData));

    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = propData.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BIGINT_ONE;
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);

    assert.fieldEquals('Proposal', '1', 'objectionPeriodEndBlock', '0');

    handleProposalObjectionPeriodSet(createProposalObjectionPeriodSetEvent(BIGINT_ONE, BIGINT_10K));
    assert.fieldEquals('Proposal', '1', 'objectionPeriodEndBlock', '10000');
  });
});

describe('Proposal Updated', () => {
  beforeEach(() => {
    const propData = new ProposalCreatedData();
    propData.id = proposalId;
    propData.proposer = proposerWithDelegate;
    propData.targets = [signerWithNoDelegate];
    propData.values = [BigInt.fromI32(987)];
    propData.signatures = ['first signature'];
    propData.calldatas = [Bytes.fromI32(888)];
    propData.startBlock = BigInt.fromI32(203);
    propData.endBlock = BigInt.fromI32(303);
    propData.description = '# Original Title\nOriginal body';
    propData.eventBlockNumber = updateBlockNumber.minus(BIGINT_ONE);
    propData.eventBlockTimestamp = updateBlockTimestamp.minus(BIGINT_ONE);
    propData.txHash = Bytes.fromI32(11);
    propData.logIndex = BigInt.fromI32(1);
    propData.address = Address.fromString(SOME_ADDRESS);

    handleProposalCreated(createProposalCreatedEvent(propData));

    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = propData.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BIGINT_ONE;
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);
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
    assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock!);
    assert.stringEquals(updateDescription, proposal.description!);
    assert.stringEquals(extractTitle(updateDescription), proposal.title!);

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
    assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock!);
    assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], proposal.targets![0]);
    assert.bigIntEquals(updateValues[0], proposal.values![0]);
    assert.stringEquals(updateSignatures[0], proposal.signatures![0]);
    assert.bytesEquals(updateCalldatas[0], proposal.calldatas![0]);

    // check that the original values remained as is
    assert.stringEquals('# Original Title\nOriginal body', proposal.description!);
    assert.stringEquals('Original Title', proposal.title!);

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
    assert.bigIntEquals(updateBlockTimestamp, proposal.lastUpdatedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.lastUpdatedBlock!);
    assert.bytesEquals(changetype<Bytes[]>(updateTargets)[0], proposal.targets![0]);
    assert.bigIntEquals(updateValues[0], proposal.values![0]);
    assert.stringEquals(updateSignatures[0], proposal.signatures![0]);
    assert.bytesEquals(updateCalldatas[0], proposal.calldatas![0]);
    assert.stringEquals(updateDescription, proposal.description!);
    assert.stringEquals(extractTitle(updateDescription), proposal.title!);

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

describe('ParsedProposalV3', () => {
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
    const propData = new ProposalCreatedData();
    propData.id = proposalId;
    propData.proposer = proposerWithDelegate;
    propData.targets = [Address.fromString(SOME_ADDRESS)];
    propData.values = [BigInt.fromI32(123)];
    propData.signatures = ['some signature'];
    propData.calldatas = [Bytes.fromI32(312)];
    propData.startBlock = BigInt.fromI32(203);
    propData.endBlock = BigInt.fromI32(303);
    propData.description = 'some description';
    propData.eventBlockNumber = BigInt.fromI32(103);
    propData.eventBlockTimestamp = BigInt.fromI32(42);
    propData.txHash = Bytes.fromI32(11);
    propData.logIndex = BigInt.fromI32(1);
    propData.address = Address.fromString(SOME_ADDRESS);

    handleProposalCreated(createProposalCreatedEvent(propData));

    const propExtraDetails = new ParsedProposalV3();
    propExtraDetails.id = propData.id.toString();
    propExtraDetails.updatePeriodEndBlock = BigInt.fromI32(150);
    propExtraDetails.proposalThreshold = BIGINT_ONE;
    propExtraDetails.quorumVotes = BIGINT_ONE;
    saveProposalExtraDetails(propExtraDetails);
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
    assert.stringEquals(STATUS_CANCELLED, proposal.status!);
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
    assert.stringEquals(STATUS_VETOED, proposal.status!);
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
    assert.stringEquals(STATUS_QUEUED, proposal.status!);
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
    assert.stringEquals(STATUS_EXECUTED, proposal.status!);
    assert.bigIntEquals(updateBlockTimestamp, proposal.executedTimestamp!);
    assert.bigIntEquals(updateBlockNumber, proposal.executedBlock!);
  });
});
