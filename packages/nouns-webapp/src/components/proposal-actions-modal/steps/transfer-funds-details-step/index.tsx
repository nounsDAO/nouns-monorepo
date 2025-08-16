import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { isAddress } from 'viem';

import BrandDropdown from '@/components/brand-dropdown';
import BrandNumericEntry from '@/components/brand-numeric-entry';
import BrandTextEntry from '@/components/brand-text-entry';
import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import { Address } from '@/utils/types';

import { ProposalActionModalStepProps } from '../..';

export enum SupportedCurrency {
  ETH = 'ETH',
  WETH = 'WETH',
  STETH = 'STETH',
  USDC = 'USDC',
}

const TransferFundsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [currency, setCurrency] = useState<SupportedCurrency>(
    state.TransferFundsCurrency ?? SupportedCurrency.USDC,
  );
  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [formattedAmount, setFormattedAmount] = useState<string>(state.amount ?? '');
  const [address, setAddress] = useState<Address>((state.address as Address) ?? ('0x' as Address));
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (isAddress(address) && parseFloat(amount) > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  const isValidNumber = (value: string): boolean => {
    try {
      return value.trim() !== '' && !isNaN(parseFloat(value));
    } catch {
      return false;
    }
  };

  return (
    <div>
      <ModalTitle>
        <Trans>Add Transfer Funds Action</Trans>
      </ModalTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency}
        onChange={e => setCurrency(SupportedCurrency[e.target.value as SupportedCurrency])}
        chevronTop={38}
      >
        <option value="USDC">USDC</option>
        <option value="ETH">ETH</option>
        <option value="STETH">Lido Staked ETH</option>
      </BrandDropdown>

      <BrandNumericEntry
        label={'Amount'}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder={`0 ${currency}`}
        isInvalid={parseFloat(amount) > 0 && !isValidNumber(amount)}
      />

      <BrandTextEntry
        label={'Recipient'}
        onChange={e => setAddress(e.target.value as Address)}
        value={address}
        type="string"
        placeholder="0x..."
        isInvalid={address.length === 0 ? false : !isAddress(address)}
      />

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Review and Add</Trans>}
        isNextBtnDisabled={!isValidForNextStage}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            amount,
            address,
            TransferFundsCurrency: currency,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default TransferFundsDetailsStep;
