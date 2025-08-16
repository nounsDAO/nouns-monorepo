import React, { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Collapse, FormControl } from 'react-bootstrap';
import { isAddress } from 'viem';
import { useAccount, useEnsAddress } from 'wagmi';

import BrandSpinner from '@/components/brand-spinner';
import DelegationCandidateInfo from '@/components/delegation-candidate-info';
import NavBarButton, { NavBarButtonStyle } from '@/components/nav-bar-button';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { usePickByState } from '@/utils/pick-by-state';
import { Address } from '@/utils/types';
import { useProposalThreshold } from '@/wrappers/nounsDao';
import {
  useAccountVotes,
  useDelegateVotes,
  useNounTokenBalance,
  useUserDelegatee,
} from '@/wrappers/nounToken';

import classes from './change-delegate-panel.module.css';

import currentDelegatePannelClasses from '@/components/current-delegate-pannel/current-delegate-pannel.module.css';

interface ChangeDelegatePanelProps {
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

const ChangeDelegatePanel: React.FC<ChangeDelegatePanelProps> = props => {
  const { onDismiss, delegateTo } = props;

  const [changeDelegateState, setChangeDelegateState] = useState<ChangeDelegateState>(
    ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
  );

  const { address: account } = useAccount();

  const [delegateAddress, setDelegateAddress] = useState(delegateTo ?? '');
  const [delegateInputText, setDelegateInputText] = useState(delegateTo ?? '');
  const [delegateInputClass, setDelegateInputClass] = useState<string>('');
  const [hasResolvedDeepLinkedENS, setHasResolvedDeepLinkedENS] = useState(false);
  const availableVotes = useNounTokenBalance(account as Address) ?? 0;
  const { delegateVotes, delegateState } = useDelegateVotes();
  const locale = useActiveLocale();
  const currentDelegate = useUserDelegatee();
  const proposalThreshold = useProposalThreshold();
  const accountVotes = useAccountVotes(account || undefined) ?? 0;

  useEffect(() => {
    if (delegateState.status === 'Success') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_SUCCESS);
      return;
    }

    if (delegateState.status === 'Exception' || delegateState.status === 'Fail') {
      setChangeDelegateState(ChangeDelegateState.CHANGE_FAILURE);
      return;
    }

    if (delegateState.status === 'Mining') {
      setChangeDelegateState(ChangeDelegateState.CHANGING);
    }
  }, [delegateState]);

  const { data: resolvedAddress, isFetched } = useEnsAddress({
    name: delegateAddress,
    query: { enabled: Boolean(delegateAddress) },
  });

  useEffect(() => {
    if (!isFetched) return;

    if (resolvedAddress) {
      setDelegateAddress(resolvedAddress);
    }
    setHasResolvedDeepLinkedENS(true);
  }, [resolvedAddress, isFetched, setDelegateAddress, setHasResolvedDeepLinkedENS]);

  useEffect(() => {
    if (delegateAddress.length === 0) {
      setDelegateInputClass(classes.empty);
      return;
    }

    if (isAddress(delegateAddress)) {
      setDelegateInputClass(classes.valid);
      return;
    }

    setDelegateInputClass(classes.invalid);
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
        key="enter-delegate-address"
        buttonText={
          <div className={classes.delegateKVotesBtn}>
            {locale === 'en-US' ? (
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
          delegateVotes({ args: [delegateAddress as Address] });
        }}
        disabled={
          (changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
            !isAddress(delegateAddress)) ||
          availableVotes === 0
        }
      />,
      <NavBarButton
        key="changing"
        buttonText={<Trans>View on Etherscan</Trans>}
        buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
        onClick={() => {
          window.open(etherscanTxLink, '_blank')?.focus();
        }}
        disabled={false}
      />,
      <NavBarButton
        key="change-success"
        buttonText={<Trans>Close</Trans>}
        buttonStyle={NavBarButtonStyle.DELEGATE_SECONDARY}
        onClick={onDismiss}
      />,
      <React.Fragment key="change-failure"></React.Fragment>,
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

    [
      <Trans key="enter-address">
        Enter the Ethereum address or ENS name of the account you would like to delegate your votes
        to.
      </Trans>,
      <Trans key="votes-delegating">
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes are being delegated
        to a new account.
      </Trans>,
      <Trans key="votes-delegated">
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes have been delegated
        to a new account.
      </Trans>,
      <React.Fragment key="delegate-error">
        {delegateState.errorMessage?.message || String(delegateState.errorMessage || '')}
      </React.Fragment>,
    ],
  );

  return (
    <>
      <div className={'flex h-fit flex-col gap-3'}>
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
              {proposalThreshold === 0 || proposalThreshold === null ? 'vote' : 'votes'} after this
              delegation. Unexecuted props you&apos;ve created might become cancelable if you
              don&apos;t have enough sponsor votes.
            </Trans>
          </div>
        )}
      </div>

      {changeDelegateState !== ChangeDelegateState.CHANGE_FAILURE && delegateTo === undefined && (
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
          isAddress(delegateAddress) && changeDelegateState !== ChangeDelegateState.CHANGE_FAILURE
        }
      >
        <div className={classes.delegateCandidateInfoWrapper}>
          {changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
          delegateAddress === currentDelegate ? (
            <span className={classes.alreadyDelegatedCopy}>
              <Trans>You&apos;ve already delegated to this address</Trans>
            </span>
          ) : (
            <>
              {isAddress(delegateAddress) && (
                <DelegationCandidateInfo
                  address={delegateAddress as `0x${string}`}
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

export default ChangeDelegatePanel;
