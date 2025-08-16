import type { Address } from '@/utils/types';
import type { AbiFunction } from 'viem';

import React, { ChangeEvent, useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { Abi, isAddress } from 'viem';

import ABIUpload from '@/components/abi-upload';
import BrandDropdown from '@/components/brand-dropdown';
import BrandTextEntry from '@/components/brand-text-entry';
import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import { buildEtherscanApiQuery } from '@/utils/etherscan';

import { ProposalActionModalStepProps } from '../..';

import 'bs-custom-file-input';
import 'react-stepz/dist/index.css';

const FunctionCallSelectFunctionStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [address, setAddress] = useState<Address>(state.address ?? ('' as Address));
  const [abi, setABI] = useState<Abi>();
  const [value, setValue] = useState(state.amount ? state.amount.toString() : '');
  const [func, setFunction] = useState(state.function ?? '');

  const [isABIUploadValid, setABIUploadValid] = useState<boolean>();
  const [abiFileName, setABIFileName] = useState<string | undefined>('');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (state.abi != null) {
      setABI(state.abi);
      setABIFileName('etherscan-abi-download.json');
    }

    if (
      state.address.length > 0 &&
      isAddress(state.address) &&
      state.abi != null &&
      !isValidForNextStage
    ) {
      setIsValidForNextStage(true);
    }
  }, [isValidForNextStage, state]);

  useEffect(() => {
    if (
      address.length > 0 &&
      isAddress(address) &&
      isABIUploadValid === true &&
      !isValidForNextStage
    ) {
      setIsValidForNextStage(true);
    }
  }, [address, isABIUploadValid, isValidForNextStage]);

  useEffect(() => {
    if (abi != null) {
      // Find first function in the ABI
      const functions = (abi as Abi).filter(
        item => item.type === 'function' && Boolean(item.name),
      ) as AbiFunction[];

      if (functions.length > 0) {
        setFunction(functions[0].name);
      }
    }
  }, [abi]);

  let abiErrorTimeout: NodeJS.Timeout;
  const setABIInvalid = () => {
    setABIUploadValid(false);
    setABIFileName(undefined);
    abiErrorTimeout = setTimeout(() => {
      setABIUploadValid(undefined);
    }, 5_000);
  };

  const validateAndSetABI = (file: File | undefined) => {
    if (abiErrorTimeout != null) {
      clearTimeout(abiErrorTimeout);
    }
    if (file == null) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const abiString = e?.target?.result?.toString() ?? '';
        const parsedAbi = JSON.parse(abiString);
        // Handle both raw ABI array and ABI wrapped in 'abi' property
        const abiArray = Array.isArray(parsedAbi) ? parsedAbi : parsedAbi.abi;

        setABI(abiArray as Abi);
        setABIUploadValid(true);
        setABIFileName(file.name);
      } catch {
        setABIInvalid();
      }
    };
    reader.readAsText(file);
  };

  const getContractInformation = async (address: string) => {
    const response = await fetch(buildEtherscanApiQuery(address));
    const json = await response.json();
    return json?.result?.[0];
  };

  const getABI = async (address: string) => {
    let info = await getContractInformation(address);
    if (info?.Proxy === '1' && isAddress(info?.Implementation)) {
      info = await getContractInformation(info.Implementation);
    }
    return info.ABI;
  };

  const populateABIIfExists = async (address: string) => {
    if (abiErrorTimeout != null) {
      clearTimeout(abiErrorTimeout);
    }

    try {
      const result = await getABI(address);
      const parsedAbi = JSON.parse(result);
      setABI(parsedAbi as Abi);
      setABIUploadValid(true);
      setABIFileName('etherscan-abi-download.json');
    } catch {
      setABIUploadValid(undefined);
      setABIFileName(undefined);
    }
  };
  const addressValidator = (s: string) => {
    if (!isAddress(s)) {
      return false;
    }
    // To avoid blocking stepper progress, do not `await`
    populateABIIfExists(s);
    return true;
  };

  return (
    <div>
      <ModalTitle>
        <Trans>Add Function Call Arguments</Trans>
      </ModalTitle>

      <BrandTextEntry
        label={'Contract Address'}
        onChange={e => {
          setAddress(e.target.value as Address);
          addressValidator(e.target.value);
        }}
        value={address}
        type="string"
        min="0"
        placeholder="0x..."
      />

      <BrandTextEntry
        label={'Included ETH (optional)'}
        onChange={e => setValue(e.target.value)}
        value={value}
        type="number"
        placeholder="0"
      />

      <BrandDropdown
        value={func}
        onChange={e => setFunction(e.target.value)}
        label={'Select Contract Function'}
        chevronTop={35}
      >
        {abi != null
          ? (abi as Abi)
              .filter(item => item.type === 'function' && Boolean(item.name))
              .map(item => (
                <option key={(item as AbiFunction).name} value={(item as AbiFunction).name}>
                  {(item as AbiFunction).name}
                </option>
              ))
          : null}
      </BrandDropdown>

      <ABIUpload
        abiFileName={abiFileName}
        isValid={isABIUploadValid}
        isInvalid={isABIUploadValid === false}
        onChange={(e: ChangeEvent<HTMLInputElement>) => validateAndSetABI(e.target.files?.[0])}
      />

      <ModalBottomButtonRow
        isNextBtnDisabled={!isValidForNextStage}
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Add Arguments</Trans>}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            abi,
            amount: value,
            address,
            function: func,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default FunctionCallSelectFunctionStep;
