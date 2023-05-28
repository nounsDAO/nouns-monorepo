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
import { useDelegateVotes, useNTokenBalance, useUserDelegatee } from '../../wrappers/nToken';
import { useCryptoPunksVote } from '../../wrappers/useCryptoPunkVote/hook';
import { usePickByState } from '../../utils/pickByState';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import { useActiveLocale } from '../../hooks/useActivateLocale';
import pIcon from '../../assets/P.png';
import { ogpunksByOwner } from '../../wrappers/subgraph';
import { useQuery } from '@apollo/client';
import { lowerCaseAddress, shortAddress } from '../../utils/addressAndENSDisplayUtils';
import BrandSpinner from '../BrandSpinner';

interface ChangeDelegatePannelProps {
  onDismiss: () => void;
}

interface OgPunk {
  id: string;
  delegate: {
    id: string;
  };
}

export enum ChangeDelegateState {
  ENTER_DELEGATE_ADDRESS,
  CHANGING,
  CHANGE_SUCCESS,
  CHANGE_FAILURE,
}

/**
 * Gets localized title component based on current ChangeDelegateState or active delegate id
 * @param state
 * @param id
 */
const getTitleFromStateOrId = (state: ChangeDelegateState, id: string) => {
  if (id.length) return <Trans>Updating...</Trans>;

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
  const { onDismiss } = props;

  const [changeDelegateState, setChangeDelegateState] = useState<ChangeDelegateState>(
    ChangeDelegateState.ENTER_DELEGATE_ADDRESS,
  );

  const { library, account } = useEthers();

  const [delegateAddress, setDelegateAddress] = useState('');
  const [delegateInputText, setDelegateInputText] = useState('');
  const [delegateInputClass, setDelegateInputClass] = useState<string>('');
  const availableVotes = useNTokenBalance(account ?? '') ?? 0;
  const { send: delegateVotes, state: delegateState } = useDelegateVotes();
  const locale = useActiveLocale();
  const currentDelegate = useUserDelegatee();
  const [ogPunks, setOgPunks] = useState<OgPunk[]>([]);
  const { send: delegateOgPunksVotes, state: delegateOgPunksState } = useCryptoPunksVote();
  const [activeOgPunkId, setActiveOgPunkId] = useState<string>('');

  const { loading, error, data, refetch } = useQuery(
    ogpunksByOwner(lowerCaseAddress(account ?? '')),
    {
      skip: !account,
    },
  );

  useEffect(() => {
    !loading && !error && setOgPunks(data.ogpunks);
  }, [loading, error, data]);

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

  const showEtherscanTxLink = (hash?: string) =>
    window.open(buildEtherscanTxLink(hash ?? ''), '_blank')?.focus();

  const handleResetDelegate = () => {
    setDelegateAddress('');
    setDelegateInputText('');
    setChangeDelegateState(ChangeDelegateState.ENTER_DELEGATE_ADDRESS);
  };

  const handleDelegateVotes = () => delegateVotes(delegateAddress).then(handleResetDelegate);

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
                Delegate {availableVotes} {availableVotes === 1 ? 'Vote' : 'Votes'}
              </>
            )}
          </div>
        }
        buttonStyle={
          isAddress(delegateAddress) && delegateAddress !== currentDelegate
            ? NavBarButtonStyle.DELEGATE_SECONDARY
            : NavBarButtonStyle.DELEGATE_DISABLED
        }
        onClick={handleDelegateVotes}
        disabled={
          changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
          !isAddress(delegateAddress)
        }
      />,
      <NavBarButton
        buttonText={<Trans>View on Etherscan</Trans>}
        buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
        onClick={() => showEtherscanTxLink(delegateState.transaction?.hash)}
        disabled={false}
      />,
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
                Delegate {availableVotes} {availableVotes === 1 ? 'Vote' : 'Votes'}
              </>
            )}
          </div>
        }
        buttonStyle={
          isAddress(delegateAddress) && delegateAddress !== currentDelegate
            ? NavBarButtonStyle.DELEGATE_SECONDARY
            : NavBarButtonStyle.DELEGATE_DISABLED
        }
        onClick={() => delegateVotes(delegateAddress)}
        disabled={
          changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
          !isAddress(delegateAddress)
        }
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
      <>
        Enter the Ethereum address or ENS name of the account you would like to delegate your votes
        to.
      </>,
      <>
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes are being delegated
        to a new account.
      </>,
      <>
        Your <span style={{ fontWeight: 'bold' }}>{availableVotes}</span> votes have been delegated
        to a new account.
      </>,
      <>{delegateState.errorMessage}</>,
    ],
  );

  const renderDelegatee = (ogpunk: OgPunk) => {
    if (!ogpunk.delegate) {
      return 'None';
    } else if (ogpunk.delegate.id === lowerCaseAddress(account)) {
      return 'You';
    } else return shortAddress(ogpunk.delegate.id);
  };

  const handleDelegateOgPunk = (id: string) => {
    setActiveOgPunkId(id);
    delegateOgPunksVotes(delegateAddress, id)
      .then(() => refetch())
      .finally(() => {
        setActiveOgPunkId('');
        handleResetDelegate();
      });
  };

  const getPosition = (ogpunk: OgPunk) => {
    const id = parseInt(ogpunk.id);
    const pictureSize = 24;
    const backgroundSize = 2400;

    const row = Math.floor(id / (backgroundSize / pictureSize));
    const column = id % (backgroundSize / pictureSize);

    const x = column * pictureSize;
    const y = row * pictureSize;

    const positionX = `${-x}px`;
    const positionY = `${-y}px`;

    return `${positionX} ${positionY}`;
  };

  const noError = !(changeDelegateState === ChangeDelegateState.CHANGE_FAILURE);

  return (
    <>
      <div className={currentDelegatePannelClasses.wrapper}>
        <h1
          className={clsx(
            currentDelegatePannelClasses.title,
            locale !== 'en-US' ? !noError && classes.nonEnBottomMargin : '',
          )}
        >
          {getTitleFromStateOrId(
            changeDelegateState,
            delegateOgPunksState.status === 'Mining' ? activeOgPunkId : '',
          )}
        </h1>
        <p className={currentDelegatePannelClasses.copy}>{primaryCopy}</p>
      </div>

      {noError && (
        <FormControl
          className={clsx(classes.delegateInput, delegateInputClass)}
          type="string"
          onChange={e => {
            setDelegateAddress(e.target.value);
            setDelegateInputText(e.target.value);
          }}
          value={delegateInputText}
          placeholder="Enter delegate address..."
        />
      )}
      <Collapse in={noError}>
        <div className={classes.delegateCandidateInfoWrapper}>
          {changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
          delegateAddress === currentDelegate ? (
            <span className={classes.alreadyDelegatedCopy}>
              <Trans>You've already delegated to this address</Trans>
            </span>
          ) : (
            <DelegationCandidateInfo
              address={delegateAddress || ''}
              votesToAdd={availableVotes}
              changeModalState={changeDelegateState}
            />
          )}
        </div>
      </Collapse>
      {noError && (
        <>
          <div className={classes.delegateWrapper}>
            <div className={classes.headingWrapper}>
              <div className={classes.avatarWrapper}>
                <div className={classes.avatar}>
                  <img src={pIcon} alt="New CryptoPunks" />
                </div>
              </div>
              <div className={classes.headingText}>
                <Trans>New CryptoPunks</Trans>
              </div>
            </div>
            {primaryButton}
          </div>
          <div className={classes.ogPunksWrapper}>
            {ogPunks.map(ogpunk => (
              <div key={ogpunk.id} className={classes.delegateRow}>
                <div className={classes.ogPunkWrapper}>
                  <div className={classes.ogPunkAvatarWrapper}>
                    <div
                      className={classes.ogPunkAvatar}
                      style={{ backgroundPosition: getPosition(ogpunk) }}
                    />
                  </div>
                  <div className={classes.ogPunkText}>
                    CryptoPunk {ogpunk.id}
                    <span>{renderDelegatee(ogpunk)}</span>
                  </div>
                </div>
                {delegateOgPunksState.status === 'Mining' && ogpunk.id === activeOgPunkId ? (
                  <div className={classes.delegateTxWrapper}>
                    <div className={classes.spinner}>
                      <BrandSpinner />
                    </div>
                    <NavBarButton
                      buttonText={<Trans>View on Etherscan</Trans>}
                      buttonStyle={NavBarButtonStyle.DELEGATE_PRIMARY}
                      onClick={() => showEtherscanTxLink(delegateOgPunksState.transaction?.hash)}
                      disabled={false}
                    />
                  </div>
                ) : (
                  <NavBarButton
                    buttonText={<Trans>Delegate</Trans>}
                    buttonStyle={
                      !isAddress(delegateAddress) ||
                      ogpunk.delegate?.id === lowerCaseAddress(delegateAddress)
                        ? NavBarButtonStyle.DELEGATE_DISABLED
                        : undefined
                    }
                    onClick={() => handleDelegateOgPunk(ogpunk.id)}
                    disabled={
                      changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS &&
                      !isAddress(delegateAddress)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
      <div className={classes.buttonWrapper}>
        {noError && (
          <div className={classes.noteText}>
            <Trans>
              Note: OG CryptoPunks will need to be delegated to your own address if you'd like to
              use them to vote. One delegation transaction is required per OG CryptoPunk. There are
              no batch txs for OG Punks.
            </Trans>
          </div>
        )}
        <NavBarButton
          buttonText={<Trans>Close</Trans>}
          buttonStyle={NavBarButtonStyle.DELEGATE_BACK}
          onClick={onDismiss}
        />
        {changeDelegateState === ChangeDelegateState.ENTER_DELEGATE_ADDRESS && (
          <div
            className={clsx(
              classes.customButtonHighlighter,
              isAddress(delegateAddress) && classes.extened,
            )}
          />
        )}
      </div>
    </>
  );
};

export default ChangeDelegatePannel;
