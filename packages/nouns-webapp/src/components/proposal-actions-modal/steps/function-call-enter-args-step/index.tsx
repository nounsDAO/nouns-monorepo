import type { ProposalActionModalStepProps } from '@/components/proposal-actions-modal';
import type { Abi, AbiFunction } from 'viem';

import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import { encodeFunctionData, getAbiItem } from 'viem';

import 'bs-custom-file-input';
import 'react-stepz/dist/index.css';

import ModalBottomButtonRow from '@/components/modal-bottom-button-row';
import ModalTitle from '@/components/modal-title';
import { cn } from '@/lib/utils';

import classes from './function-call-enter-args-step.module.css';

const parseArguments = (abi: Abi | undefined, func: string, args: string[]) => {
  return args.map((a, i) => {
    const abiItem = abi != null ? (getAbiItem({ abi, name: func }) as AbiFunction) : undefined;
    const type = abiItem?.inputs?.[i]?.type;
    if (type === 'tuple' || (type?.endsWith('[]') ?? false)) {
      return JSON.parse(a);
    }
    return a;
  });
};

const FunctionCallEnterArgsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const abi = state.abi;
  const func = state.function ?? '';

  const [args, setArguments] = useState<string[]>([]);
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);
  const [invalidArgument, setInvalidArgument] = useState(false);

  useEffect(() => {
    if (invalidArgument) {
      setInvalidArgument(false);
    }
  }, [args, invalidArgument]);

  useEffect(() => {
    const argumentsValidator = (a: string[]) => {
      if (func === '' || !abi) {
        return true;
      }

      try {
        const abiItem = getAbiItem({ abi, name: func }) as AbiFunction;
        if ((abiItem?.inputs?.length ?? 0) === 0) return true;

        // Try to encode function data to see if args are valid
        encodeFunctionData({
          abi: [abiItem],
          functionName: func,
          args: parseArguments(abi, func, a),
        });
        return true;
      } catch {
        setInvalidArgument(true);
        return false;
      }
    };

    if (argumentsValidator(args) && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [abi, args, func, isValidForNextStage]);

  const setArgument = (index: number, value: string) => {
    const values = [...args];
    values[index] = value;
    setArguments(values);
  };

  const getAbiInputs = () => {
    if (abi == null || func === '') return [];
    const abiItem = getAbiItem({ abi, name: func }) as AbiFunction;
    return abiItem?.inputs ?? [];
  };

  const inputs = getAbiInputs();

  return (
    <div>
      <ModalTitle>
        <Trans>Add Function Call Arguments</Trans>
      </ModalTitle>

      {invalidArgument && (
        <div className={classes.invalid}>
          <Trans>Invalid Arguments</Trans>
        </div>
      )}
      {inputs.length > 0 ? (
        <FormGroup as="div" className="grid grid-cols-12 gap-3">
          {inputs.map((input, i) => (
            <React.Fragment key={i}>
              <span className={cn(classes.label, 'col-span-12')}>{input.name}</span>
              <div className="col-span-12 sm:col-span-12">
                <InputGroup className="mb-1">
                  <InputGroup.Text className={classes.inputGroupText}>{input.type}</InputGroup.Text>
                  <FormControl
                    className={classes.inputGroup}
                    value={args[i] ?? ''}
                    onChange={e => setArgument(i, e.target.value)}
                  />
                </InputGroup>
              </div>
            </React.Fragment>
          ))}
        </FormGroup>
      ) : (
        <Trans>No arguments required </Trans>
      )}

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Review and Add</Trans>}
        isNextBtnDisabled={inputs.length > 0 ? !isValidForNextStage : false}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            args: parseArguments(abi, func, args),
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default FunctionCallEnterArgsStep;
