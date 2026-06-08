import { useEffect } from 'react';

import { Alert, Form } from 'react-bootstrap';
import { formatEther, formatUnits } from 'viem';
import { useBalance } from 'wagmi';

import { nounsPayerAddress, nounsTreasuryAddress, useReadUsdcBalanceOf } from '@/contracts';
import { defaultChain } from '@/wagmi';

import classes from './TokenBuyerTopUpAlert.module.css';

interface TokenBuyerTopUpAlertProps {
  className?: string;
  includeTokenBuyerTopUp: boolean;
  onIncludeTokenBuyerTopUpChange: (include: boolean) => void;
  suggestedEth?: string;
  topUpEth?: string;
}

const formatUSDC = (value?: bigint | number) => {
  if (value === undefined) return 'Loading';
  const formatted =
    typeof value === 'bigint' ? formatUnits(value, 6) : (value / 1_000_000).toString();
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(formatted));
};

const formatSuggestedEth = (value?: string) => {
  if (!value || value === '0') return '0';
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
    Number(formatEther(BigInt(value))),
  );
};

const formatTreasuryEth = (value?: bigint) => {
  if (value === undefined) return 'Loading';
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(
    Number(formatEther(value)),
  );
};

const TokenBuyerTopUpAlert = ({
  className,
  includeTokenBuyerTopUp,
  onIncludeTokenBuyerTopUpChange,
  suggestedEth,
  topUpEth,
}: TokenBuyerTopUpAlertProps) => {
  const chainId = defaultChain.id;
  const payerAddress = nounsPayerAddress[chainId];
  const treasuryAddress = nounsTreasuryAddress[chainId];
  const displayedEth =
    includeTokenBuyerTopUp && topUpEth && topUpEth !== '0' ? topUpEth : suggestedEth;
  const displayedEthValue = displayedEth ? BigInt(displayedEth) : 0n;

  const { data: payerUSDCBalance } = useReadUsdcBalanceOf({
    args: [payerAddress],
    query: { enabled: !!payerAddress },
  });
  const { data: treasuryEthBalance } = useBalance({
    address: treasuryAddress,
    query: { enabled: !!treasuryAddress && displayedEthValue > 0n },
  });
  const payerBalance = `${formatUSDC(payerUSDCBalance)} USDC`;
  const isTreasuryEthInsufficient =
    treasuryEthBalance?.value !== undefined && displayedEthValue > treasuryEthBalance.value;

  useEffect(() => {
    if (includeTokenBuyerTopUp && isTreasuryEthInsufficient) {
      onIncludeTokenBuyerTopUpChange(false);
    }
  }, [includeTokenBuyerTopUp, isTreasuryEthInsufficient, onIncludeTokenBuyerTopUpChange]);

  return (
    <Alert variant="secondary" className={className}>
      <Form.Check
        className={classes.checkbox}
        type="checkbox"
        id="includeTokenBuyerTopUp"
        label={
          <>
            Top up the Token Buyer with{' '}
            <span className={classes.ethAmount}>{formatSuggestedEth(displayedEth)} ETH</span>.
            (Optional)
          </>
        }
        checked={includeTokenBuyerTopUp}
        disabled={isTreasuryEthInsufficient}
        onChange={e => onIncludeTokenBuyerTopUpChange(e.target.checked)}
      />

      <div className={classes.explainer}>
        This ETH is converted to USDC and the transaction should only be added if the Payer does not
        have enough USDC to cover your proposal. Current payer balance: {payerBalance}.
      </div>

      {isTreasuryEthInsufficient && (
        <div className={classes.warning}>
          DAO treasury only has {formatTreasuryEth(treasuryEthBalance?.value)} ETH, so this top-up
          is unavailable.
        </div>
      )}
    </Alert>
  );
};

export default TokenBuyerTopUpAlert;
