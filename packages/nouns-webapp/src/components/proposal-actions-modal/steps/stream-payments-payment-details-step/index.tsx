import type { Address } from '@/utils/types';

import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { isAddress } from 'viem';

import BrandDropdown from '@/components/brand-dropdown';
import BrandNumericEntry from '@/components/brand-numeric-entry';
import BrandTextEntry from '@/components/brand-text-entry';
import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalSubTitle from '@/components/modal-subtitle';
import ModalTitle from '@/components/modal-title';

import { ProposalActionModalStepProps } from '../..';
import { SupportedCurrency } from '../transfer-funds-details-step';

const StreamPaymentsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onPrevBtnClick, onNextBtnClick, state, setState } = props;

  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [currency, setCurrency] = useState<SupportedCurrency.WETH | SupportedCurrency.USDC>(
    SupportedCurrency.USDC,
  );
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
    <>
      <ModalTitle>
        <Trans>Add Streaming Payment Action</Trans>
      </ModalTitle>

      <ModalSubTitle>
        <Trans>At this time only USDC and WETH streams are supported</Trans>
      </ModalSubTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency === SupportedCurrency.WETH ? 'WETH' : 'USDC'}
        onChange={e => {
          if (e.target.value === 'WETH') {
            setCurrency(SupportedCurrency.WETH);
          } else {
            setCurrency(SupportedCurrency.USDC);
          }
        }}
        chevronTop={38}
      >
        <option value="USDC">USDC</option>
        <option value="WETH">WETH</option>
      ./brand-dropdown>

      <BrandNumericEntry
        label={'Amount'}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder={`0 ${currency === SupportedCurrency.USDC ? 'USDC' : 'WETH'}`}
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
        nextBtnText={<Trans>Add Stream Date Details</Trans>}
        onNextBtnClick={() => {
          setState(x => ({ ...x, address, amount, TransferFundsCurrency: currency }));
          onNextBtnClick();
        }}
        isNextBtnDisabled={!isValidForNextStage}
      />
    </>
  );
};

export default StreamPaymentsDetailsStep;
