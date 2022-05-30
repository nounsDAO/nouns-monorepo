import { Trans } from '@lingui/macro';
import { useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { Collapse, FormControl } from 'react-bootstrap';
import currentDelegatePannelClasses from '../CurrentDelegatePannel/CurrentDelegatePannel.module.css';
import DelegationCandidateInfo from '../DelegationCandidateInfo';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import classes from './ChangeDelegatePannel.module.css';
import { useDelegateVotes, useUserVotes } from '../../wrappers/nounToken';
import { usePickByState } from '../../utils/pickByState';
import { buildEtherscanTxLink } from '../../utils/etherscan';

interface ChangeDelegatePannelProps {
  onDismiss: () => void;
}

export enum ChangeDelegateState {
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

const ChangeDelegatePannel: React.FC<ChangeDelegatePannelProps> = props => {
  const { onDismiss } = props;

  const [changeDelegateState, setChangeDelegateState] = useState<ChangeDelegateState>(
    ChangeDelegateState.ENTRY_DELEGEE,
  );

  const { library } = useEthers();

  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateInputText, setDelegateInputText] = useState('');
  const [delegateInputClass, setDelegateInputClass] = useState<string>('');
  const availableVotes = useUserVotes() ?? 0;
  const { send: delegateVotes, state: delageeState } = useDelegateVotes(delegateAddress);

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

  const etherscanTxLink = buildEtherscanTxLink(delageeState.transaction?.hash ?? '');

  const primaryButton = usePickByState(
    changeDelegateState,
    [
      ChangeDelegateState.ENTRY_DELEGEE,
      ChangeDelegateState.CHANGING,
      ChangeDelegateState.CHANGE_SUCCESS,
      ChangeDelegateState.CHANGE_FAILURE,
    ],
    [
      <NavBarButton
        // TODO make button color and style state dependant
        buttonText={
          <span style={{ zIndex: '101' }}>
            <Trans>
              Delegate{' '}
              <span style={{ marginLeft: '0.2rem', marginRight: '0.2rem' }}>
                {' '}
                {availableVotes}{' '}
              </span>{' '}
              votes
            </Trans>
          </span>
        }
        buttonStyle={
          isAddress(delegateAddress)
            ? NavBarButtonStyle.DELEGATE_SECONDARY
            : NavBarButtonStyle.DELEGATE_DISABLED
        }
        onClick={() => {
          delegateVotes(delegateAddress);
        }}
        disabled={
          changeDelegateState === ChangeDelegateState.ENTRY_DELEGEE && !isAddress(delegateAddress)
        }
      />,
      <NavBarButton
        // TODO make button color and style state dependant
        buttonText={<Trans>View on Etherscan</Trans>}
        buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
        onClick={() => {
          window.open(etherscanTxLink, '_blank')?.focus();
        }}
        disabled={false}
      />,
      <NavBarButton
        buttonText={<Trans>Close</Trans>}
        buttonStyle={NavBarButtonStyle.DELEGATE_SECONDARY}
        onClick={onDismiss}
      />,
      <></>,
    ],
  );

  const primaryCopy = usePickByState(
    changeDelegateState,
    [
      ChangeDelegateState.ENTRY_DELEGEE,
      ChangeDelegateState.CHANGING,
      ChangeDelegateState.CHANGE_SUCCESS,
      ChangeDelegateState.CHANGE_FAILURE,
    ],
    // eslint-disable-next-line no-sparse-arrays
    [
      <Trans>
        Enter the Ethereum address or ENS name of the account you would like to delegate your votes
        to.
      </Trans>,
      <Trans>
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes are being delegated
        to a new account.
      </Trans>,
      <Trans>
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes have been delegated
        to a new account.
      </Trans>,
      ,
      <>{delageeState.errorMessage}</>,
    ],
  );

  return (
    <>
      <div className={currentDelegatePannelClasses.wrapper}>
        <h1 className={currentDelegatePannelClasses.title}>
          {getTitleFromState(changeDelegateState)}
        </h1>
        <p className={currentDelegatePannelClasses.copy}>{primaryCopy}</p>
      </div>

      {!(changeDelegateState === ChangeDelegateState.CHANGE_FAILURE) && (
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
      )}

      <Collapse
        in={
          isAddress(delegateAddress) &&
          !(changeDelegateState === ChangeDelegateState.CHANGE_FAILURE)
        }
      >
        <div
          style={{
            padding: '0rem 0.25rem 0rem',
            marginTop: '0.5rem',
          }}
        >
          {isAddress(delegateAddress) && (
            <DelegationCandidateInfo
              address={delegateAddress || ''}
              changeModalState={changeDelegateState}
            />
          )}
        </div>
      </Collapse>

      {/* Button section */}
      <div className={classes.buttonWrapper}>
        <NavBarButton
          buttonText={
            changeDelegateState === ChangeDelegateState.CHANGE_SUCCESS ? (
              <Trans>Change</Trans>
            ) : (
              <Trans>Close</Trans>
            )
          }
          buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
          onClick={
            changeDelegateState === ChangeDelegateState.CHANGE_SUCCESS
              ? () => {
                  setDelegateAddress('');
                  setDelegateInputText('');
                  setChangeDelegateState(ChangeDelegateState.ENTRY_DELEGEE);
                }
              : onDismiss
          }
        />
        {changeDelegateState === ChangeDelegateState.ENTRY_DELEGEE && (
          <div
            className={clsx(
              classes.customButtonHighlighter,
              isAddress(delegateAddress) && classes.extened,
            )}
          />
        )}
        {primaryButton}
      </div>
    </>
  );
};

export default ChangeDelegatePannel;
