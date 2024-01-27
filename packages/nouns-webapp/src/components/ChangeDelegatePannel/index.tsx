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
import {
  useAccountVotes,
  useDelegateVotes,
  useNounTokenBalance,
  useUserDelegatee,
} from '../../wrappers/nounToken';
import { usePickByState } from '../../utils/pickByState';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import BrandSpinner from '../BrandSpinner';
import { useProposalThreshold } from '../../wrappers/nounsDao';

interface ChangeDelegatePannelProps {
  onDismiss: () => void;
  delegateTo?: string;
}

export enum ChangeDelegateState {
  ENTER_DELEGATE_ADDRESS,
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
      return <Trans>Updating...</Trans>;
    case ChangeDelegateState.CHANGE_SUCCESS:
      return <Trans>Delegate Updated!</Trans>;
    case ChangeDelegateState.CHANGE_FAILURE:
      return <Trans>Delegate Update Failed</Trans>;
    default:
      return <Trans>Update Delegate</Trans>;
  }
};

const ChangeDelegatePannel: React.FC<ChangeDelegatePannelProps> = props => {
  const { onDismiss, delegateTo } = props;

  const [changeDelegateState, setChangeDelegateState] = useState<ChangeDelegateState>(
    ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
  );

  const { library, account } = useEthers();

  const [delegateAddress, setDelegateAddress] = useState(delegateTo ?? '');
  const [delegateInputText, setDelegateInputText] = useState(delegateTo ?? '');
  const [delegateInputClass, setDelegateInputClass] = useState<string>('');
  const [hasResolvedDeepLinkedENS, setHasResolvedDeepLinkedENS] = useState(false);
  const availableVotes = useNounTokenBalance(account ?? '') ?? 0;
  const { send: delegateVotes, state: delegateState } = useDelegateVotes();
  const locale = useActiveLocale();
  const currentDelegate = useUserDelegatee();
  const proposalThreshold = useProposalThreshold();
  const accountVotes = useAccountVotes(account ?? '') ?? 0;

  useEffect(() => {
    if (delegateState.status === 'Success') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_SUCCESS);
    }

    if (delegateState.status === 'Exception' || delegateState.status === 'Fail') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_FAILURE);
    }

    if (delegateState.status === 'Mining') {
      setChangeDelegateState(ChangeDelegateState.CHANGING);
    }
  }, [delegateState]);

  useEffect(() => {
    const checkIsValidENS = async () => {
      const reverseENSResult = await library?.resolveName(delegateAddress);
      if (reverseENSResult) {
        setDelegateAddress(reverseENSResult);
      }
      setHasResolvedDeepLinkedENS(true);
    };

    checkIsValidENS();
  }, [delegateAddress, delegateTo, library]);

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
  }, [delegateAddress, delegateTo, hasResolvedDeepLinkedENS]);

  const etherscanTxLink = buildEtherscanTxLink(delegateState.transaction?.hash ?? '');

  const primaryButton = usePickByState(
    changeDelegateState,
    [
      ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
      ChangeDelegateState.CHANGING,
      ChangeDelegateState.CHANGE_SUCCESS,
      ChangeDelegateState.CHANGE_FAILURE,
    ],
    [
      <NavBarButton
        buttonText={
          <div className={classes.delegateKVotesBtn}>
            {locale === 'en-US ' ? (
              <>
                Delegate <span className={classes.highlightCircle}>{availableVotes}</span>
                {availableVotes === 1 ? <>Vote</> : <>Votes</>}
              </>
            ) : (
              <>
                {availableVotes === 1 ? (
                  <Trans>Delegate {availableVotes} Vote</Trans>
                ) : (
                  <Trans>Delegate {availableVotes} Votes</Trans>
                )}
              </>
            )}
          </div>
        }
        buttonStyle={
          isAddress(delegateAddress) && delegateAddress !== currentDelegate && availableVotes > 0
            ? NavBarButtonStyle.DELEGATE_SECONDARY
            : NavBarButtonStyle.DELEGATE_DISABLED
        }
        onClick={() => {
          delegateVotes(delegateAddress);
        }}
        disabled={
          (changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
            !isAddress(delegateAddress)) ||
          availableVotes === 0
        }
      />,
      <NavBarButton
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
      ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
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
      <>{delegateState.errorMessage}</>,
    ],
  );

  const vote = <Trans>vote</Trans>
  const votes = <Trans>votes</Trans>

  return (
    <>
      <div className={currentDelegatePannelClasses.wrapper}>
        <h1
          className={clsx(
            currentDelegatePannelClasses.title,
            locale !== 'en-US' ? classes.nonEnBottomMargin : '',
          )}
        >
          {getTitleFromState(changeDelegateState)}
        </h1>
        <p className={currentDelegatePannelClasses.copy}>{primaryCopy}</p>
        {availableVotes > 0 && accountVotes - availableVotes < (proposalThreshold ?? 0) + 1 && (
          <div className={classes.changeDelegateWarning}>
            <Trans>
              Your account will have less than {(proposalThreshold ?? 0) + 1}{' '}
              {proposalThreshold === 0 || proposalThreshold === undefined ? vote : votes} after
              this delegation. Unexecuted props you've created will now be cancelable by anyone.
            </Trans>
          </div>
        )}
      </div>

      {!(changeDelegateState === ChangeDelegateState.CHANGE_FAILURE) && delegateTo === undefined && (
        <FormControl
          className={clsx(classes.delegateInput, delegateInputClass)}
          type="string"
          onChange={e => {
            setDelegateAddress(e.target.value);
            setDelegateInputText(e.target.value);
          }}
          value={delegateInputText}
          placeholder={locale === 'en-US' ? '0x... or ...eth' : '0x... / ...eth'}
        />
      )}

      {delegateTo !== undefined && !isAddress(delegateAddress) && (
        <div className={classes.delegteDeepLinkSpinner}>
          <BrandSpinner />
        </div>
      )}

      <Collapse
        in={
          isAddress(delegateAddress) &&
          !(changeDelegateState === ChangeDelegateState.CHANGE_FAILURE)
        }
      >
        <div className={classes.delegateCandidateInfoWrapper}>
          {changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
          delegateAddress === currentDelegate ? (
            <span className={classes.alreadyDelegatedCopy}>
              <Trans>You've already delegated to this address</Trans>
            </span>
          ) : (
            <>
              {isAddress(delegateAddress) && (
                <DelegationCandidateInfo
                  address={delegateAddress || ''}
                  votesToAdd={availableVotes}
                  changeModalState={changeDelegateState}
                />
              )}
            </>
          )}
        </div>
      </Collapse>

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
                  setChangeDelegateState(ChangeDelegateState.ENTER_DELEGATE_ADDRESS);
                }
              : onDismiss
          }
        />
        {changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS && (
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
