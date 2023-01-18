import React, { useEffect } from 'react';
import { ProposalActionModalStepProps } from '../..';
import { utils } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { ChangeEvent, useState } from 'react';
import 'bs-custom-file-input';
import 'react-stepz/dist/index.css';
import { buildEtherscanApiQuery } from '../../../../utils/etherscan';
import { Trans } from '@lingui/macro';
import ModalTitle from '../../../ModalTitle';
import BrandTextEntry from '../../../BrandTextEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import BrandDropdown from '../../../BrandDropdown';
import ABIUpload from '../../../ABIUpload';

const FunctionCallSelectFunctionStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [address, setAddress] = useState(state.address ?? '');
  const [abi, setABI] = useState<Interface>();
  const [value, setValue] = useState(state.amount ? state.amount.toString() : '');
  const [func, setFunction] = useState(state.function ?? '');

  const [isABIUploadValid, setABIUploadValid] = useState<boolean>();
  const [abiFileName, setABIFileName] = useState<string | undefined>('');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (state.abi) {
      setABI(state.abi);
      setABIFileName('etherscan-abi-download.json');
    }

    if (
      state.address.length > 0 &&
      utils.isAddress(state.address) &&
      state.abi &&
      !isValidForNextStage
    ) {
      setIsValidForNextStage(true);
    }
  }, [isValidForNextStage, state]);

  useEffect(() => {
    if (
      address.length > 0 &&
      utils.isAddress(address) &&
      isABIUploadValid &&
      !isValidForNextStage
    ) {
      setIsValidForNextStage(true);
    }
  }, [address, isABIUploadValid, isValidForNextStage]);

  useEffect(() => {
    if (abi) {
      setFunction(Object.keys(abi.functions)?.[0]);
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
    if (abiErrorTimeout) {
      clearTimeout(abiErrorTimeout);
    }
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const abi = e?.target?.result?.toString() ?? '';
        setABI(new Interface(JSON.parse(abi)));
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
    if (info?.Proxy === '1' && utils.isAddress(info?.Implementation)) {
      info = await getContractInformation(info.Implementation);
    }
    return info.ABI;
  };

  const populateABIIfExists = async (address: string) => {
    if (abiErrorTimeout) {
      clearTimeout(abiErrorTimeout);
    }

    try {
      const result = await getABI(address);
      setABI(new Interface(JSON.parse(result)));
      setABIUploadValid(true);
      setABIFileName('etherscan-abi-download.json');
    } catch {
      setABIUploadValid(undefined);
      setABIFileName(undefined);
    }
  };
  const addressValidator = (s: string) => {
    if (!utils.isAddress(s)) {
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
          setAddress(e.target.value);
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
        {abi && Object.keys(abi.functions).map(func => <option value={func}>{func}</option>)}
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
