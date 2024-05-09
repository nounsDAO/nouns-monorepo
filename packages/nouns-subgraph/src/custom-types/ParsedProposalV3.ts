import { BigInt } from '@graphprotocol/graph-ts';
import {
  ProposalCreatedWithRequirements,
  ProposalCreatedWithRequirements1,
} from '../types/NounsDAO/NounsDAO';
import { ProposalCreatedWithRequirements1 as ProposalCreatedWithRequirementsV4 } from '../types/NounsDAOV4/NounsDAOV4';
import { BIGINT_ZERO } from '../utils/constants';

export class ParsedProposalV3 {
  id: string = '';
  txHash: string = '';
  updatePeriodEndBlock: BigInt = BIGINT_ZERO;
  proposalThreshold: BigInt = BIGINT_ZERO;
  quorumVotes: BigInt = BIGINT_ZERO;
  signers: string[] = [];
  clientId: BigInt = BIGINT_ZERO;

  static fromV1Event(event: ProposalCreatedWithRequirements1): ParsedProposalV3 {
    const proposal = new ParsedProposalV3();
    proposal.id = event.params.id.toString();
    proposal.txHash = event.transaction.hash.toHexString();
    proposal.proposalThreshold = event.params.proposalThreshold;
    proposal.quorumVotes = event.params.quorumVotes;

    return proposal;
  }

  static fromV3Event(event: ProposalCreatedWithRequirements): ParsedProposalV3 {
    const proposal = new ParsedProposalV3();
    proposal.id = event.params.id.toString();
    proposal.txHash = event.transaction.hash.toHexString();
    proposal.proposalThreshold = event.params.proposalThreshold;
    proposal.quorumVotes = event.params.quorumVotes;

    proposal.signers = new Array<string>(event.params.signers.length);
    for (let i = 0; i < event.params.signers.length; i++) {
      proposal.signers[i] = event.params.signers[i].toHexString();
    }

    proposal.updatePeriodEndBlock = event.params.updatePeriodEndBlock;

    return proposal;
  }

  static fromV4Event(event: ProposalCreatedWithRequirementsV4): ParsedProposalV3 {
    const proposal = new ParsedProposalV3();
    proposal.id = event.params.id.toString();
    proposal.txHash = event.transaction.hash.toHexString();
    proposal.proposalThreshold = event.params.proposalThreshold;
    proposal.quorumVotes = event.params.quorumVotes;
    proposal.signers = new Array<string>(event.params.signers.length);
    for (let i = 0; i < event.params.signers.length; i++) {
      proposal.signers[i] = event.params.signers[i].toHexString();
    }

    proposal.updatePeriodEndBlock = event.params.updatePeriodEndBlock;

    proposal.clientId = event.params.clientId;

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
