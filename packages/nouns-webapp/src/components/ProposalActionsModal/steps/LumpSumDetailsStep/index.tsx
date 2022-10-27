import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import BrandDropdown from '../../../BrandDropdown';
import BrandTextEntry from '../../../BrandTextEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';

export enum SupportedCurrency {
  ETH = 'ETH',
  USDC = 'USDC',
}

const LumpSumDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [currency, setCurrency] = useState<SupportedCurrency>(
    state.lumpSumCurrency ?? SupportedCurrency.ETH,
  );
  const [amount, setAmount] = useState<number>(state.amount ?? 0);
  const [address, setAddress] = useState(state.address ?? '');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (utils.isAddress(address) && amount > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  return (
    <div>
      <ModalTitle>
        <Trans>Add Lump Sum Action</Trans>
      </ModalTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency === SupportedCurrency.ETH ? 'ETH' : 'USDC'}
        onChange={e => {
          if (e.target.value === 'ETH') {
            setCurrency(SupportedCurrency.ETH);
          } else {
            setCurrency(SupportedCurrency.USDC);
          }
        }}
        chevronTop={38}
      >
        <option value="ETH">ETH</option>
        <option value="USDC">USDC</option>
      </BrandDropdown>

      <BrandTextEntry
        label={'Amount'}
        value={amount}
        onChange={e => setAmount(parseInt(e.target.value))}
        type="number"
        min="0"
        placeholder={currency === SupportedCurrency.ETH ? '0 ETH' : '0 USDC'}
        isInvalid={amount > 0 && new BigNumber(amount).isNaN()}
      />

      <BrandTextEntry
        label={'Recipient'}
        onChange={e => setAddress(e.target.value)}
        value={address}
        type="string"
        placeholder="0x..."
        isInvalid={address.length === 0 ? false : !utils.isAddress(address)}
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
            lumpSumCurrency: currency,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default LumpSumDetailsStep;
