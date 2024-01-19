import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  NounsDAO,
  ProposalCreatedWithRequirements,
  ProposalCreatedWithRequirements1,
} from '../types/NounsDAO/NounsDAO';
import { BIGINT_ZERO, STATUS_ACTIVE, STATUS_PENDING } from '../utils/constants';

export class ParsedProposalV3 {
  id: string = '';
  proposer: string = '';
  txHash: string = '';
  logIndex: string = '';
  targets: Bytes[] = [];
  values: BigInt[] = [];
  signatures: string[] = [];
  calldatas: Bytes[] = [];
  createdTimestamp: BigInt = BIGINT_ZERO;
  createdBlock: BigInt = BIGINT_ZERO;
  createdTransactionHash: Bytes = Bytes.fromI32(0);
  startBlock: BigInt = BIGINT_ZERO;
  endBlock: BigInt = BIGINT_ZERO;
  updatePeriodEndBlock: BigInt = BIGINT_ZERO;
  proposalThreshold: BigInt = BIGINT_ZERO;
  quorumVotes: BigInt = BIGINT_ZERO;
  description: string = '';
  title: string = '';
  status: string = '';
  signers: string[] = [];
  adjustedTotalSupply: BigInt = BIGINT_ZERO;

  static fromV1Event(event: ProposalCreatedWithRequirements1): ParsedProposalV3 {
    const proposal = new ParsedProposalV3();

    proposal.id = event.params.id.toString();
    proposal.proposer = event.params.proposer.toHexString();
    proposal.txHash = event.transaction.hash.toHexString();
    proposal.logIndex = event.logIndex.toString();
    proposal.targets = changetype<Bytes[]>(event.params.targets);
    proposal.values = event.params.values;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;
    proposal.createdTimestamp = event.block.timestamp;
    proposal.createdBlock = event.block.number;
    proposal.createdTransactionHash = event.transaction.hash;
    proposal.startBlock = event.params.startBlock;
    proposal.endBlock = event.params.endBlock;
    proposal.proposalThreshold = event.params.proposalThreshold;
    proposal.quorumVotes = event.params.quorumVotes;
    proposal.description = event.params.description.split('\\n').join('\n'); // The Graph's AssemblyScript version does not support string.replace
    proposal.title = extractTitle(proposal.description);
    proposal.status = event.block.number >= proposal.startBlock ? STATUS_ACTIVE : STATUS_PENDING;

    return proposal;
  }

  static fromV3Event(event: ProposalCreatedWithRequirements): ParsedProposalV3 {
    const proposal = new ParsedProposalV3();
    const nounsDAO = NounsDAO.bind(event.address);

    proposal.id = event.params.id.toString();
    proposal.proposer = event.params.proposer.toHexString();
    proposal.txHash = event.transaction.hash.toHexString();
    proposal.targets = changetype<Bytes[]>(event.params.targets);
    proposal.values = event.params.values;
    proposal.signatures = event.params.signatures;
    proposal.calldatas = event.params.calldatas;
    proposal.createdTimestamp = event.block.timestamp;
    proposal.createdBlock = event.block.number;
    proposal.createdTransactionHash = event.transaction.hash;
    proposal.startBlock = event.params.startBlock;
    proposal.endBlock = event.params.endBlock;
    proposal.proposalThreshold = event.params.proposalThreshold;
    proposal.quorumVotes = event.params.quorumVotes;
    proposal.description = event.params.description.split('\\n').join('\n'); // The Graph's AssemblyScript version does not support string.replace
    proposal.title = extractTitle(proposal.description);
    proposal.status = event.block.number >= proposal.startBlock ? STATUS_ACTIVE : STATUS_PENDING;

    proposal.signers = new Array<string>(event.params.signers.length);
    for (let i = 0; i < event.params.signers.length; i++) {
      proposal.signers[i] = event.params.signers[i].toHexString();
    }

    proposal.updatePeriodEndBlock = event.params.updatePeriodEndBlock;
    proposal.adjustedTotalSupply = nounsDAO.adjustedTotalSupply();

    return proposal;
  }
}

/**
 * Extracts the title from a proposal's description. Returns 'Untitled' if the title is empty.
 * Note: Assemblyscript does not support regular expressions.
 * @param description The proposal description
 */
export function extractTitle(description: string): string {
  // Extract a markdown title from a proposal body that uses the `# Title` or `Title\n===` formats
  let splitDescription = description.split('#', 3);
  if (splitDescription.length > 1) {
    splitDescription.shift(); // Remove any characters before `#`
  }
  let title = splitDescription.join('').split('\n', 1).join('').trim();

  // Remove bold and italics
  title = title.replaceAll('**', '').replaceAll('__', '');

  if (title == '') {
    return 'Untitled';
  }
  return title;
}
