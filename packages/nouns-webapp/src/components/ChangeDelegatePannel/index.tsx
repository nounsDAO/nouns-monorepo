import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { Collapse, FormControl } from 'react-bootstrap';
import currentDelegatePannelClasses from '../CurrentDelegatePannel/CurrentDelegatePannel.module.css';
import DelegationCandidateInfo from '../DelegationCandidateInfo';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import ShortAddress from '../ShortAddress';
import classes from './ChangeDelegatePannel.module.css';
import { useDelegateVotes, useUserVotes } from '../../wrappers/nounToken';

enum ChangeDelegateState {
  ENTRY_DELEGEE,
  CHANGING,
  CHANGE_SUCCESS,
  CHANGE_FAILURE,
}

/**
 * Gets localized title component based on current ChangeDelegateState
 * @param state
 */
const getTitleFromState = (state: ChangeDelegateState) => {
  switch (state) {
    case ChangeDelegateState.CHANGING:
      return <Trans>Changing...</Trans>;
    case ChangeDelegateState.CHANGE_SUCCESS:
      return <Trans>Delegate Changed!</Trans>;
    case ChangeDelegateState.CHANGE_FAILURE:
      return <Trans>Delegate Change Failed</Trans>;
    default:
      return <Trans>Change Delegate</Trans>;
  }
};

const ChangeDelegatePannel = () => {
  const [changeDelegateState, setChangeDelegateState] = useState<ChangeDelegateState>(
    ChangeDelegateState.ENTRY_DELEGEE,
  );

  const { library } = useEthers();

  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateInputText, setDelegateInputText] = useState('');
  const [delegateInputClass, setDelegateInputClass] = useState<string>('');
  const availableVotes = useUserVotes() ?? 0;
  const {send: delegateVotes, state: delageeState} = useDelegateVotes(delegateAddress);



  useEffect(() => {
    if (delageeState.status === 'Success') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_SUCCESS);
    }

    if (delageeState.status === 'Exception' || delageeState.status === 'Fail') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_FAILURE);
    }

    if (delageeState.status === 'Mining') {
      setChangeDelegateState(ChangeDelegateState.CHANGING);
    }

  }, [delageeState]);


  useEffect(() => {
    const getCurrentBlockNumber = async () => {
      setCurrentBlockNumber((await library?.getBlockNumber()) ?? 0);
    };

    getCurrentBlockNumber();
  }, [library]);

  useEffect(() => {
    const checkIsValidENS = async () => {
      const reverseENSResult = await library?.resolveName(delegateAddress);
      if (reverseENSResult) {
        setDelegateAddress(reverseENSResult);
      }
    };

    checkIsValidENS();
  }, [delegateAddress, library]);

  useEffect(() => {
    if (delegateAddress.length === 0) {
      setDelegateInputClass(classes.empty);
    } else {
      if (isAddress(delegateAddress)) {
        setDelegateInputClass(classes.valid);
      } else {
        setDelegateInputClass(classes.invalid);
      }
    }
  }, [delegateAddress]);

  return (
    <>
      <div className={currentDelegatePannelClasses.wrapper}>
        <h1 className={currentDelegatePannelClasses.title}>
          {getTitleFromState(changeDelegateState)}
        </h1>
        <p className={currentDelegatePannelClasses.copy}>
          <Trans>
            Enter the Ethereum address or ENS name of the account you would like to delegate your
            votes to.
          </Trans>
        </p>
      </div>

      <FormControl
        className={clsx(classes.bidInput, delegateInputClass)}
        type="string"
        onChange={e => {
          setDelegateAddress(e.target.value);
          setDelegateInputText(e.target.value);
        }}
        value={delegateInputText}
        placeholder={'0x... or ...eth'}
      />

      <Collapse in={isAddress(delegateAddress)}>
        <div
          style={{
            padding: '0rem 0.25rem 0rem',
            marginTop: '0.5rem',
          }}
        >
          {isAddress(delegateAddress) && (
            <DelegationCandidateInfo
              address={delegateAddress || ''}
              isChanging={changeDelegateState === ChangeDelegateState.CHANGING}
            />
          )}
        </div>
      </Collapse>

      {/* Button section */}
      <div className={classes.buttonWrapper}>
        <NavBarButton
          buttonText={<Trans>Close</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
          onClick={() => console.log('close')}
        />
        <NavBarButton
          // TODO make button color and style state dependant
          buttonText={
            <span>
              Delegate{' '}
              <span
                style={{
                  borderRadius: '50%',
                  height: '25px',
                  width: '25px',
                  display: 'inline-block',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,.25)',
                }}
              >
                {availableVotes}
              </span>{' '}
              Votes
            </span>
          }
          buttonStyle={NavBarButtonStyle.DELEGATE_SECONDARY}
          onClick={() => {
            delegateVotes(delegateAddress);
          }}
        />
      </div>
    </>
  );
};

export default ChangeDelegatePannel;
