/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query GetSeeds($first: Int!) {\n      seeds(first: $first) {\n        id\n        background\n        body\n        accessory\n        head\n        glasses\n      }\n    }\n  ": typeof types.GetSeedsDocument,
    "\n    query GetProposal($id: ID!) {\n      proposal(id: $id) {\n        id\n        description\n        status\n        proposalThreshold\n        quorumVotes\n        forVotes\n        againstVotes\n        abstainVotes\n        createdTransactionHash\n        createdBlock\n        createdTimestamp\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        executionETA\n        targets\n        values\n        signatures\n        calldatas\n        onTimelockV1\n        voteSnapshotBlock\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  ": typeof types.GetProposalDocument,
    "\n    query GetPartialProposals($first: Int!) {\n      proposals(first: $first, orderBy: createdBlock, orderDirection: asc) {\n        id\n        title\n        status\n        forVotes\n        againstVotes\n        abstainVotes\n        quorumVotes\n        executionETA\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        onTimelockV1\n        signers {\n          id\n        }\n      }\n    }\n  ": typeof types.GetPartialProposalsDocument,
    "\n    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          or: [\n            { status: PENDING, endBlock_gt: $currentBlock }\n            { status: ACTIVE, endBlock_gt: $currentBlock }\n          ]\n        }\n      ) {\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  ": typeof types.GetActivePendingUpdatableProposersDocument,
    "\n    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          status: PENDING\n          endBlock_gt: $currentBlock\n          updatePeriodEndBlock_gt: $currentBlock\n        }\n      ) {\n        id\n      }\n    }\n  ": typeof types.GetUpdatableProposalsDocument,
    "\n    query GetCandidateProposals($first: Int!) {\n      proposalCandidates(first: $first) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  ": typeof types.GetCandidateProposalsDocument,
    "\n    query GetCandidateProposal($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  ": typeof types.GetCandidateProposalDocument,
    "\n    query GetCandidateProposalVersions($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        canceled\n        createdTransactionHash\n        versions {\n          id\n          createdTimestamp\n          updateMessage\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n          }\n        }\n        latestVersion {\n          id\n        }\n      }\n    }\n  ": typeof types.GetCandidateProposalVersionsDocument,
    "\n    query GetProposalVersions($id: ID!) {\n      proposalVersions(where: { proposal_: { id: $id } }) {\n        id\n        createdAt\n        updateMessage\n        title\n        description\n        targets\n        values\n        signatures\n        calldatas\n        proposal {\n          id\n        }\n      }\n    }\n  ": typeof types.GetProposalVersionsDocument,
    "\n  query GetAuction($id: ID!) {\n    auction(id: $id) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        seed {\n          id\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        blockNumber\n        txIndex\n        amount\n      }\n    }\n  }\n": typeof types.GetAuctionDocument,
    "\n    query GetBidsByAuction($auctionId: String!) {\n      bids(where: { auction: $auctionId }) {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txIndex\n        bidder {\n          id\n        }\n        noun {\n          id\n        }\n      }\n    }\n  ": typeof types.GetBidsByAuctionDocument,
    "\n    query GetNoun($id: ID!) {\n      noun(id: $id) {\n        id\n        seed {\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n    }\n  ": typeof types.GetNounDocument,
    "\n    query GetNounsIndex {\n      nouns {\n        id\n        owner {\n          id\n        }\n      }\n    }\n  ": typeof types.GetNounsIndexDocument,
    "\n  query GetLatestAuctions($first: Int = 1000, $skip: Int = 0) {\n    auctions(orderBy: startTime, orderDirection: desc, first: $first, skip: $skip) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txHash\n        txIndex\n        bidder {\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetLatestAuctionsDocument,
    "\n    query GetLatestBids($first: Int!) {\n      bids(first: $first, orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        bidder {\n          id\n        }\n        amount\n        blockTimestamp\n        txIndex\n        blockNumber\n        auction {\n          id\n          startTime\n          endTime\n          settled\n        }\n      }\n    }\n  ": typeof types.GetLatestBidsDocument,
    "\n    query GetNounVotingHistory($nounId: ID!, $first: Int!) {\n      noun(id: $nounId) {\n        id\n        votes(first: $first) {\n          blockNumber\n          proposal {\n            id\n          }\n          support\n          supportDetailed\n          voter {\n            id\n          }\n        }\n      }\n    }\n  ": typeof types.GetNounVotingHistoryDocument,
    "\n    query GetNounTransferHistory($nounId: String!, $first: Int!) {\n      transferEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousHolder {\n          id\n        }\n        newHolder {\n          id\n        }\n        blockNumber\n      }\n    }\n  ": typeof types.GetNounTransferHistoryDocument,
    "\n    query GetNounDelegationHistory($nounId: String!, $first: Int!) {\n      delegationEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousDelegate {\n          id\n        }\n        newDelegate {\n          id\n        }\n        blockNumber\n      }\n    }\n  ": typeof types.GetNounDelegationHistoryDocument,
    "\n    query GetCreateTimestampAllProposals {\n      proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {\n        id\n        createdTimestamp\n      }\n    }\n  ": typeof types.GetCreateTimestampAllProposalsDocument,
    "\n    query GetProposalVotes($proposalId: String!) {\n      votes(where: { proposal: $proposalId, votesRaw_gt: 0 }) {\n        supportDetailed\n        voter {\n          id\n        }\n      }\n    }\n  ": typeof types.GetProposalVotesDocument,
    "\n    query GetDelegateNounsAtBlock($delegates: [ID!]!, $block: Int!) {\n      delegates(where: { id_in: $delegates }, block: { number: $block }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  ": typeof types.GetDelegateNounsAtBlockDocument,
    "\n    query GetCurrentlyDelegatedNouns($delegate: ID!) {\n      delegates(where: { id: $delegate }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  ": typeof types.GetCurrentlyDelegatedNounsDocument,
    "\n    query GetAdjustedNounSupplyAtPropSnapshot($proposalId: ID!) {\n      proposals(where: { id: $proposalId }) {\n        adjustedTotalSupply\n      }\n    }\n  ": typeof types.GetAdjustedNounSupplyAtPropSnapshotDocument,
    "\n    query GetPropUsingDynamicQuorum($proposalId: ID!) {\n      proposal(id: $proposalId) {\n        quorumCoefficient\n      }\n    }\n  ": typeof types.GetPropUsingDynamicQuorumDocument,
    "\n    query GetProposalFeedbacks($proposalId: ID!) {\n      proposalFeedbacks(where: { proposal_: { id: $proposalId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        proposal {\n          id\n        }\n      }\n    }\n  ": typeof types.GetProposalFeedbacksDocument,
    "\n    query GetCandidateFeedbacks($candidateId: ID!) {\n      candidateFeedbacks(where: { candidate_: { id: $candidateId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        candidate {\n          id\n        }\n      }\n    }\n  ": typeof types.GetCandidateFeedbacksDocument,
    "\n    query GetOwnedNouns($owner: ID!) {\n      nouns(where: { owner_: { id: $owner } }) {\n        id\n      }\n    }\n  ": typeof types.GetOwnedNounsDocument,
    "\n    query GetAccountEscrowedNouns($owner: ID!) {\n      escrowedNouns(where: { owner_: { id: $owner } }, first: 1000) {\n        noun {\n          id\n        }\n        fork {\n          id\n        }\n      }\n    }\n  ": typeof types.GetAccountEscrowedNounsDocument,
    "\n    query GetEscrowDepositEvents($forkId: String!) {\n      escrowDeposits(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  ": typeof types.GetEscrowDepositEventsDocument,
    "\n    query GetForkJoins($forkId: String!) {\n      forkJoins(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  ": typeof types.GetForkJoinsDocument,
    "\n    query GetEscrowWithdrawEvents($forkId: String!) {\n      escrowWithdrawals(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        tokenIDs\n      }\n    }\n  ": typeof types.GetEscrowWithdrawEventsDocument,
    "\n    query GetProposalTitles($ids: [ID!]!) {\n      proposals(where: { id_in: $ids }) {\n        id\n        title\n      }\n    }\n  ": typeof types.GetProposalTitlesDocument,
    "\n    query GetForkDetails($id: ID!) {\n      fork(id: $id) {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n        escrowedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n        joinedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n      }\n    }\n  ": typeof types.GetForkDetailsDocument,
    "\n    query GetForks {\n      forks {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n      }\n    }\n  ": typeof types.GetForksDocument,
    "\n    query GetIsForkActive($currentTimestamp: BigInt!) {\n      forks(where: { executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp }) {\n        forkID\n        forkingPeriodEndTimestamp\n      }\n    }\n  ": typeof types.GetIsForkActiveDocument,
};
const documents: Documents = {
    "\n    query GetSeeds($first: Int!) {\n      seeds(first: $first) {\n        id\n        background\n        body\n        accessory\n        head\n        glasses\n      }\n    }\n  ": types.GetSeedsDocument,
    "\n    query GetProposal($id: ID!) {\n      proposal(id: $id) {\n        id\n        description\n        status\n        proposalThreshold\n        quorumVotes\n        forVotes\n        againstVotes\n        abstainVotes\n        createdTransactionHash\n        createdBlock\n        createdTimestamp\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        executionETA\n        targets\n        values\n        signatures\n        calldatas\n        onTimelockV1\n        voteSnapshotBlock\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  ": types.GetProposalDocument,
    "\n    query GetPartialProposals($first: Int!) {\n      proposals(first: $first, orderBy: createdBlock, orderDirection: asc) {\n        id\n        title\n        status\n        forVotes\n        againstVotes\n        abstainVotes\n        quorumVotes\n        executionETA\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        onTimelockV1\n        signers {\n          id\n        }\n      }\n    }\n  ": types.GetPartialProposalsDocument,
    "\n    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          or: [\n            { status: PENDING, endBlock_gt: $currentBlock }\n            { status: ACTIVE, endBlock_gt: $currentBlock }\n          ]\n        }\n      ) {\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  ": types.GetActivePendingUpdatableProposersDocument,
    "\n    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          status: PENDING\n          endBlock_gt: $currentBlock\n          updatePeriodEndBlock_gt: $currentBlock\n        }\n      ) {\n        id\n      }\n    }\n  ": types.GetUpdatableProposalsDocument,
    "\n    query GetCandidateProposals($first: Int!) {\n      proposalCandidates(first: $first) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  ": types.GetCandidateProposalsDocument,
    "\n    query GetCandidateProposal($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  ": types.GetCandidateProposalDocument,
    "\n    query GetCandidateProposalVersions($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        canceled\n        createdTransactionHash\n        versions {\n          id\n          createdTimestamp\n          updateMessage\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n          }\n        }\n        latestVersion {\n          id\n        }\n      }\n    }\n  ": types.GetCandidateProposalVersionsDocument,
    "\n    query GetProposalVersions($id: ID!) {\n      proposalVersions(where: { proposal_: { id: $id } }) {\n        id\n        createdAt\n        updateMessage\n        title\n        description\n        targets\n        values\n        signatures\n        calldatas\n        proposal {\n          id\n        }\n      }\n    }\n  ": types.GetProposalVersionsDocument,
    "\n  query GetAuction($id: ID!) {\n    auction(id: $id) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        seed {\n          id\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        blockNumber\n        txIndex\n        amount\n      }\n    }\n  }\n": types.GetAuctionDocument,
    "\n    query GetBidsByAuction($auctionId: String!) {\n      bids(where: { auction: $auctionId }) {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txIndex\n        bidder {\n          id\n        }\n        noun {\n          id\n        }\n      }\n    }\n  ": types.GetBidsByAuctionDocument,
    "\n    query GetNoun($id: ID!) {\n      noun(id: $id) {\n        id\n        seed {\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n    }\n  ": types.GetNounDocument,
    "\n    query GetNounsIndex {\n      nouns {\n        id\n        owner {\n          id\n        }\n      }\n    }\n  ": types.GetNounsIndexDocument,
    "\n  query GetLatestAuctions($first: Int = 1000, $skip: Int = 0) {\n    auctions(orderBy: startTime, orderDirection: desc, first: $first, skip: $skip) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txHash\n        txIndex\n        bidder {\n          id\n        }\n      }\n    }\n  }\n": types.GetLatestAuctionsDocument,
    "\n    query GetLatestBids($first: Int!) {\n      bids(first: $first, orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        bidder {\n          id\n        }\n        amount\n        blockTimestamp\n        txIndex\n        blockNumber\n        auction {\n          id\n          startTime\n          endTime\n          settled\n        }\n      }\n    }\n  ": types.GetLatestBidsDocument,
    "\n    query GetNounVotingHistory($nounId: ID!, $first: Int!) {\n      noun(id: $nounId) {\n        id\n        votes(first: $first) {\n          blockNumber\n          proposal {\n            id\n          }\n          support\n          supportDetailed\n          voter {\n            id\n          }\n        }\n      }\n    }\n  ": types.GetNounVotingHistoryDocument,
    "\n    query GetNounTransferHistory($nounId: String!, $first: Int!) {\n      transferEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousHolder {\n          id\n        }\n        newHolder {\n          id\n        }\n        blockNumber\n      }\n    }\n  ": types.GetNounTransferHistoryDocument,
    "\n    query GetNounDelegationHistory($nounId: String!, $first: Int!) {\n      delegationEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousDelegate {\n          id\n        }\n        newDelegate {\n          id\n        }\n        blockNumber\n      }\n    }\n  ": types.GetNounDelegationHistoryDocument,
    "\n    query GetCreateTimestampAllProposals {\n      proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {\n        id\n        createdTimestamp\n      }\n    }\n  ": types.GetCreateTimestampAllProposalsDocument,
    "\n    query GetProposalVotes($proposalId: String!) {\n      votes(where: { proposal: $proposalId, votesRaw_gt: 0 }) {\n        supportDetailed\n        voter {\n          id\n        }\n      }\n    }\n  ": types.GetProposalVotesDocument,
    "\n    query GetDelegateNounsAtBlock($delegates: [ID!]!, $block: Int!) {\n      delegates(where: { id_in: $delegates }, block: { number: $block }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  ": types.GetDelegateNounsAtBlockDocument,
    "\n    query GetCurrentlyDelegatedNouns($delegate: ID!) {\n      delegates(where: { id: $delegate }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  ": types.GetCurrentlyDelegatedNounsDocument,
    "\n    query GetAdjustedNounSupplyAtPropSnapshot($proposalId: ID!) {\n      proposals(where: { id: $proposalId }) {\n        adjustedTotalSupply\n      }\n    }\n  ": types.GetAdjustedNounSupplyAtPropSnapshotDocument,
    "\n    query GetPropUsingDynamicQuorum($proposalId: ID!) {\n      proposal(id: $proposalId) {\n        quorumCoefficient\n      }\n    }\n  ": types.GetPropUsingDynamicQuorumDocument,
    "\n    query GetProposalFeedbacks($proposalId: ID!) {\n      proposalFeedbacks(where: { proposal_: { id: $proposalId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        proposal {\n          id\n        }\n      }\n    }\n  ": types.GetProposalFeedbacksDocument,
    "\n    query GetCandidateFeedbacks($candidateId: ID!) {\n      candidateFeedbacks(where: { candidate_: { id: $candidateId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        candidate {\n          id\n        }\n      }\n    }\n  ": types.GetCandidateFeedbacksDocument,
    "\n    query GetOwnedNouns($owner: ID!) {\n      nouns(where: { owner_: { id: $owner } }) {\n        id\n      }\n    }\n  ": types.GetOwnedNounsDocument,
    "\n    query GetAccountEscrowedNouns($owner: ID!) {\n      escrowedNouns(where: { owner_: { id: $owner } }, first: 1000) {\n        noun {\n          id\n        }\n        fork {\n          id\n        }\n      }\n    }\n  ": types.GetAccountEscrowedNounsDocument,
    "\n    query GetEscrowDepositEvents($forkId: String!) {\n      escrowDeposits(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  ": types.GetEscrowDepositEventsDocument,
    "\n    query GetForkJoins($forkId: String!) {\n      forkJoins(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  ": types.GetForkJoinsDocument,
    "\n    query GetEscrowWithdrawEvents($forkId: String!) {\n      escrowWithdrawals(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        tokenIDs\n      }\n    }\n  ": types.GetEscrowWithdrawEventsDocument,
    "\n    query GetProposalTitles($ids: [ID!]!) {\n      proposals(where: { id_in: $ids }) {\n        id\n        title\n      }\n    }\n  ": types.GetProposalTitlesDocument,
    "\n    query GetForkDetails($id: ID!) {\n      fork(id: $id) {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n        escrowedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n        joinedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n      }\n    }\n  ": types.GetForkDetailsDocument,
    "\n    query GetForks {\n      forks {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n      }\n    }\n  ": types.GetForksDocument,
    "\n    query GetIsForkActive($currentTimestamp: BigInt!) {\n      forks(where: { executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp }) {\n        forkID\n        forkingPeriodEndTimestamp\n      }\n    }\n  ": types.GetIsForkActiveDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetSeeds($first: Int!) {\n      seeds(first: $first) {\n        id\n        background\n        body\n        accessory\n        head\n        glasses\n      }\n    }\n  "): typeof import('./graphql.js').GetSeedsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetProposal($id: ID!) {\n      proposal(id: $id) {\n        id\n        description\n        status\n        proposalThreshold\n        quorumVotes\n        forVotes\n        againstVotes\n        abstainVotes\n        createdTransactionHash\n        createdBlock\n        createdTimestamp\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        executionETA\n        targets\n        values\n        signatures\n        calldatas\n        onTimelockV1\n        voteSnapshotBlock\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetProposalDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPartialProposals($first: Int!) {\n      proposals(first: $first, orderBy: createdBlock, orderDirection: asc) {\n        id\n        title\n        status\n        forVotes\n        againstVotes\n        abstainVotes\n        quorumVotes\n        executionETA\n        startBlock\n        endBlock\n        updatePeriodEndBlock\n        objectionPeriodEndBlock\n        onTimelockV1\n        signers {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetPartialProposalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetActivePendingUpdatableProposers($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          or: [\n            { status: PENDING, endBlock_gt: $currentBlock }\n            { status: ACTIVE, endBlock_gt: $currentBlock }\n          ]\n        }\n      ) {\n        proposer {\n          id\n        }\n        signers {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetActivePendingUpdatableProposersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetUpdatableProposals($first: Int!, $currentBlock: BigInt!) {\n      proposals(\n        first: $first\n        where: {\n          status: PENDING\n          endBlock_gt: $currentBlock\n          updatePeriodEndBlock_gt: $currentBlock\n        }\n      ) {\n        id\n      }\n    }\n  "): typeof import('./graphql.js').GetUpdatableProposalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCandidateProposals($first: Int!) {\n      proposalCandidates(first: $first) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetCandidateProposalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCandidateProposal($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        createdTransactionHash\n        canceled\n        versions {\n          content {\n            title\n          }\n        }\n        latestVersion {\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n            proposalIdToUpdate\n            contentSignatures {\n              id\n              signer {\n                id\n                proposals {\n                  id\n                }\n              }\n              sig\n              expirationTimestamp\n              canceled\n              reason\n            }\n            matchingProposalIds\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetCandidateProposalDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCandidateProposalVersions($id: ID!) {\n      proposalCandidate(id: $id) {\n        id\n        slug\n        proposer\n        lastUpdatedTimestamp\n        canceled\n        createdTransactionHash\n        versions {\n          id\n          createdTimestamp\n          updateMessage\n          content {\n            title\n            description\n            targets\n            values\n            signatures\n            calldatas\n            encodedProposalHash\n          }\n        }\n        latestVersion {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetCandidateProposalVersionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetProposalVersions($id: ID!) {\n      proposalVersions(where: { proposal_: { id: $id } }) {\n        id\n        createdAt\n        updateMessage\n        title\n        description\n        targets\n        values\n        signatures\n        calldatas\n        proposal {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetProposalVersionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetAuction($id: ID!) {\n    auction(id: $id) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        seed {\n          id\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        blockNumber\n        txIndex\n        amount\n      }\n    }\n  }\n"): typeof import('./graphql.js').GetAuctionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetBidsByAuction($auctionId: String!) {\n      bids(where: { auction: $auctionId }) {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txIndex\n        bidder {\n          id\n        }\n        noun {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetBidsByAuctionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetNoun($id: ID!) {\n      noun(id: $id) {\n        id\n        seed {\n          background\n          body\n          accessory\n          head\n          glasses\n        }\n        owner {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetNounDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetNounsIndex {\n      nouns {\n        id\n        owner {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetNounsIndexDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetLatestAuctions($first: Int = 1000, $skip: Int = 0) {\n    auctions(orderBy: startTime, orderDirection: desc, first: $first, skip: $skip) {\n      id\n      amount\n      settled\n      bidder {\n        id\n      }\n      startTime\n      endTime\n      noun {\n        id\n        owner {\n          id\n        }\n      }\n      bids {\n        id\n        amount\n        blockNumber\n        blockTimestamp\n        txHash\n        txIndex\n        bidder {\n          id\n        }\n      }\n    }\n  }\n"): typeof import('./graphql.js').GetLatestAuctionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetLatestBids($first: Int!) {\n      bids(first: $first, orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        bidder {\n          id\n        }\n        amount\n        blockTimestamp\n        txIndex\n        blockNumber\n        auction {\n          id\n          startTime\n          endTime\n          settled\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetLatestBidsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetNounVotingHistory($nounId: ID!, $first: Int!) {\n      noun(id: $nounId) {\n        id\n        votes(first: $first) {\n          blockNumber\n          proposal {\n            id\n          }\n          support\n          supportDetailed\n          voter {\n            id\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetNounVotingHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetNounTransferHistory($nounId: String!, $first: Int!) {\n      transferEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousHolder {\n          id\n        }\n        newHolder {\n          id\n        }\n        blockNumber\n      }\n    }\n  "): typeof import('./graphql.js').GetNounTransferHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetNounDelegationHistory($nounId: String!, $first: Int!) {\n      delegationEvents(where: { noun: $nounId }, first: $first) {\n        id\n        previousDelegate {\n          id\n        }\n        newDelegate {\n          id\n        }\n        blockNumber\n      }\n    }\n  "): typeof import('./graphql.js').GetNounDelegationHistoryDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCreateTimestampAllProposals {\n      proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {\n        id\n        createdTimestamp\n      }\n    }\n  "): typeof import('./graphql.js').GetCreateTimestampAllProposalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetProposalVotes($proposalId: String!) {\n      votes(where: { proposal: $proposalId, votesRaw_gt: 0 }) {\n        supportDetailed\n        voter {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetProposalVotesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetDelegateNounsAtBlock($delegates: [ID!]!, $block: Int!) {\n      delegates(where: { id_in: $delegates }, block: { number: $block }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetDelegateNounsAtBlockDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCurrentlyDelegatedNouns($delegate: ID!) {\n      delegates(where: { id: $delegate }) {\n        id\n        nounsRepresented {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetCurrentlyDelegatedNounsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAdjustedNounSupplyAtPropSnapshot($proposalId: ID!) {\n      proposals(where: { id: $proposalId }) {\n        adjustedTotalSupply\n      }\n    }\n  "): typeof import('./graphql.js').GetAdjustedNounSupplyAtPropSnapshotDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetPropUsingDynamicQuorum($proposalId: ID!) {\n      proposal(id: $proposalId) {\n        quorumCoefficient\n      }\n    }\n  "): typeof import('./graphql.js').GetPropUsingDynamicQuorumDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetProposalFeedbacks($proposalId: ID!) {\n      proposalFeedbacks(where: { proposal_: { id: $proposalId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        proposal {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetProposalFeedbacksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetCandidateFeedbacks($candidateId: ID!) {\n      candidateFeedbacks(where: { candidate_: { id: $candidateId } }) {\n        supportDetailed\n        votes\n        reason\n        createdTimestamp\n        voter {\n          id\n        }\n        candidate {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetCandidateFeedbacksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetOwnedNouns($owner: ID!) {\n      nouns(where: { owner_: { id: $owner } }) {\n        id\n      }\n    }\n  "): typeof import('./graphql.js').GetOwnedNounsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAccountEscrowedNouns($owner: ID!) {\n      escrowedNouns(where: { owner_: { id: $owner } }, first: 1000) {\n        noun {\n          id\n        }\n        fork {\n          id\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetAccountEscrowedNounsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetEscrowDepositEvents($forkId: String!) {\n      escrowDeposits(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  "): typeof import('./graphql.js').GetEscrowDepositEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetForkJoins($forkId: String!) {\n      forkJoins(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        reason\n        tokenIDs\n        proposalIDs\n      }\n    }\n  "): typeof import('./graphql.js').GetForkJoinsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetEscrowWithdrawEvents($forkId: String!) {\n      escrowWithdrawals(where: { fork: $forkId, tokenIDs_not: [] }, first: 1000) {\n        id\n        createdAt\n        owner {\n          id\n        }\n        tokenIDs\n      }\n    }\n  "): typeof import('./graphql.js').GetEscrowWithdrawEventsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetProposalTitles($ids: [ID!]!) {\n      proposals(where: { id_in: $ids }) {\n        id\n        title\n      }\n    }\n  "): typeof import('./graphql.js').GetProposalTitlesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetForkDetails($id: ID!) {\n      fork(id: $id) {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n        escrowedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n        joinedNouns(first: 1000) {\n          noun {\n            id\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql.js').GetForkDetailsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetForks {\n      forks {\n        id\n        forkID\n        executed\n        executedAt\n        forkTreasury\n        forkToken\n        tokensForkingCount\n        tokensInEscrowCount\n        forkingPeriodEndTimestamp\n      }\n    }\n  "): typeof import('./graphql.js').GetForksDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetIsForkActive($currentTimestamp: BigInt!) {\n      forks(where: { executed: true, forkingPeriodEndTimestamp_gt: $currentTimestamp }) {\n        forkID\n        forkingPeriodEndTimestamp\n      }\n    }\n  "): typeof import('./graphql.js').GetIsForkActiveDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
