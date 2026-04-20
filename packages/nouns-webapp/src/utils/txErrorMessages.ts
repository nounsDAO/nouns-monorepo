import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';

// Attempts to normalize various provider/wallet/viem/wagmi error shapes to a user-friendly string
export function formatTxErrorMessage(rawError?: unknown): string {
  if (!rawError) return i18n._(t`Something went wrong. Please try again.`);

  // Extract message text from different error shapes
  const message = extractMessage(rawError)?.toLowerCase() ?? '';

  // User rejection (common across wallets & libs)
  if (
    message.includes('user rejected') ||
    message.includes('request rejected') ||
    message.includes('action_rejected') ||
    message.includes('user denied') ||
    includesCode(rawError, 4001)
  ) {
    return i18n._(t`Transaction canceled.`);
  }

  // Insufficient funds
  if (message.includes('insufficient funds')) {
    return i18n._(t`Insufficient funds to complete this transaction.`);
  }

  // Gas/fee issues
  if (message.includes('replacement underpriced') || message.includes('replacement fee too low')) {
    return i18n._(t`Replacement fee too low; try again with higher gas.`);
  }

  if (message.includes('nonce too low')) {
    return i18n._(t`Nonce too low; try again in a few seconds.`);
  }

  // Contract reverts (common cases we can phrase nicely)
  if (message.includes('voter already voted')) {
    return i18n._(t`You have already voted on this proposal.`);
  }

  if (message.includes('proposal not active') || message.includes('voting is closed')) {
    return i18n._(t`Proposal is not active for voting.`);
  }

  if (message.includes('execution reverted') && message.includes('not owner')) {
    return i18n._(t`You are not authorized to perform this action.`);
  }

  // Token allowance / balance
  if (message.includes('insufficient allowance')) {
    return i18n._(t`Insufficient token allowance.`);
  }
  if (message.includes('transfer amount exceeds balance') || message.includes('insufficient balance')) {
    return i18n._(t`Insufficient token balance.`);
  }

  // Default fallback
  const original = extractMessage(rawError);
  if (original && original.length < 160) {
    // Show concise original if it is short enough
    return original;
  }
  return i18n._(t`Something went wrong. Please try again.`);
}

function extractMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;

  // viem/wagmi error style
  // @ts-expect-error – best-effort extraction from unknown shapes
  const message: string | undefined = error?.shortMessage || error?.message || error?.cause?.message;
  if (message) return message;

  try {
    return JSON.stringify(error);
  } catch (_) {
    return undefined;
  }
}

function includesCode(error: unknown, code: number): boolean {
  // @ts-expect-error – best-effort extraction from unknown shapes
  return error?.code === code || error?.cause?.code === code;
}


