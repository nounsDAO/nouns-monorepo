import React, { useEffect, useState } from 'react';

import { Col, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap';

import { ProposalActionModalStepProps } from '../..';

import classes from './FunctionCallEnterArgsStep.module.css';

import 'bs-custom-file-input';
import 'react-stepz/dist/index.css';
import { Trans } from '@lingui/react/macro';

import ModalTitle from '@/components/ModalTitle';
import ModalBottomButtonRow from '@/components/ModalBottomButtonRow';

import { Interface } from 'ethers/lib/utils';

const parseArguments = (abi: Interface | undefined, func: string, args: string[]) => {
  return args.map((a, i) => {
    const type = abi?.functions[func]?.inputs?.[i].type;
    if (type === 'tuple' || type?.endsWith('[]')) {
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
      if (!func) {
        return true;
      }

      try {
        return !!abi?._encodeParams(abi?.functions[func]?.inputs, parseArguments(abi, func, a));
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
      {abi?.functions[func]?.inputs?.length ? (
        <FormGroup as={Row}>
          {abi?.functions[func]?.inputs.map((input, i) => (
            <React.Fragment key={i}>
              <span className={classes.label}>{input.name}</span>
              <Col sm="12">
                <InputGroup className="mb-1">
                  <InputGroup.Text className={classes.inputGroupText}>{input.type}</InputGroup.Text>
                  <FormControl
                    className={classes.inputGroup}
                    value={args[i] ?? ''}
                    onChange={e => setArgument(i, e.target.value)}
                  />
                </InputGroup>
              </Col>
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
        isNextBtnDisabled={abi?.functions[func]?.inputs.length ? !isValidForNextStage : false}
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
