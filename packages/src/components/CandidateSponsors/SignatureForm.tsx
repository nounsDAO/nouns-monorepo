import { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './CandidateSponsors.module.css';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { TransactionStatus, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import config, { CHAIN_ID } from '../../config';
import { useAddSignature, ProposalCandidate } from '../../wrappers/nounsData';
import clsx from 'clsx';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from 'react-bootstrap';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import link from '../../assets/icons/Link.svg';

const domain = {
  name: 'Nouns DAO',
  chainId: CHAIN_ID,
  verifyingContract: config.addresses.nounsDAOProxy,
};

const createProposalTypes = {
  Proposal: [
    { name: 'proposer', type: 'address' },
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'signatures', type: 'string[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
    { name: 'expiry', type: 'uint256' },
  ],
};

const updateProposalTypes = {
  UpdateProposal: [
    { name: 'proposalId', type: 'uint256' },
    { name: 'proposer', type: 'address' },
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'signatures', type: 'string[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
    { name: 'expiry', type: 'uint256' },
  ],
};

type Props = {
  id: string;
  transactionState: 'None' | 'Success' | 'Mining' | 'Fail' | 'Exception';
  setTransactionState: Function;
  setIsFormDisplayed: Function;
  candidate: ProposalCandidate;
  handleRefetchCandidateData: Function;
  setDataFetchPollInterval: Function;
  proposalIdToUpdate: number;
};

function SignatureForm(props: Props) {
  const [reasonText, setReasonText] = useState('');
  const [expirationDate, setExpirationDate] = useState<number>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { library } = useEthers();
  const signer = library?.getSigner();
  const { addSignature, addSignatureState } = useAddSignature();
  const [isGetSignatureWaiting, setIsGetSignatureWaiting] = useState(false);
  const [isGetSignaturePending, setIsGetSignaturePending] = useState(false);
  const [isGetSignatureTxSuccessful, setIsGetSignatureTxSuccessful] = useState(false);
  const [getSignatureErrorMessage, setGetSignatureErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  async function calcProposalEncodeData(
    proposer: any,
    targets: any,
    values: any,
    signatures: any[],
    calldatas: any[],
    description: string,
  ) {
    const signatureHashes = signatures.map((sig: string) =>
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(sig)),
    );

    const calldatasHashes = calldatas.map((calldata: ethers.utils.BytesLike) =>
      ethers.utils.keccak256(calldata),
    );

    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'bytes32', 'bytes32', 'bytes32', 'bytes32', 'bytes32'],
      [
        proposer,
        ethers.utils.keccak256(ethers.utils.solidityPack(['address[]'], [targets])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['uint256[]'], [values])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32[]'], [signatureHashes])),
        ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32[]'], [calldatasHashes])),
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description)),
      ],
    );

    return encodedData;
  }

  const getSignature = async () => {
    setIsGetSignatureWaiting(true);
    let signature;
    if (props.proposalIdToUpdate > 0) {
      const value = {
        proposalId: props.proposalIdToUpdate,
        proposer: props.candidate.proposer,
        targets: props.candidate.version.content.targets,
        values: props.candidate.version.content.values,
        signatures: props.candidate.version.content.signatures,
        calldatas: props.candidate.version.content.calldatas,
        description: props.candidate.version.content.description,
        expiry: expirationDate,
      };
      signature = await signer!
        ._signTypedData(domain, updateProposalTypes, value)
        .then((sig: any) => {
          setIsGetSignatureWaiting(false);
          setIsGetSignatureTxSuccessful(true);
          return sig;
        })
        .catch((err: any) => {
          setGetSignatureErrorMessage(err.message);
          setIsGetSignatureWaiting(false);
        });
    } else {
      if (!props.candidate) return;
      const value = {
        proposer: props.candidate.proposer,
        targets: props.candidate.version.content.targets,
        values: props.candidate.version.content.values,
        signatures: props.candidate.version.content.signatures,
        calldatas: props.candidate.version.content.calldatas,
        description: props.candidate.version.content.description,
        expiry: expirationDate,
      };
      signature = await signer!
        ._signTypedData(domain, createProposalTypes, value)
        .then((sig: any) => {
          setIsGetSignatureWaiting(false);
          setIsGetSignatureTxSuccessful(true);
          return sig;
        })
        .catch((err: any) => {
          setGetSignatureErrorMessage(err.message);
          setIsGetSignatureWaiting(false);
        });
    }
    return signature;
  };

  async function sign() {
    const signature = await getSignature();
    if (signature) {
      setIsGetSignatureWaiting(false);
      setIsWaiting(true);
      const encodedProp = await calcProposalEncodeData(
        props.candidate.proposer,
        props.candidate.version.content.targets,
        props.candidate.version.content.values,
        props.candidate.version.content.signatures,
        props.candidate.version.content.calldatas,
        props.candidate.version.content.description,
      );

      const encodedPropUpdate = ethers.utils.solidityPack(
        ['uint256', 'bytes'],
        [props.proposalIdToUpdate, encodedProp],
      );
      // signature set, submit signature
      await addSignature(
        signature,
        expirationDate,
        props.candidate.proposer,
        props.candidate.slug,
        props.proposalIdToUpdate, // proposalIdToUpdate
        props.proposalIdToUpdate > 0 ? encodedPropUpdate : encodedProp,
        reasonText,
      );
    }
  }

  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
    setIsGetSignatureWaiting(false);
    setIsGetSignaturePending(false);
    setGetSignatureErrorMessage('');
    setIsGetSignatureTxSuccessful(false);
    setIsOverlayVisible(false);
    props.setDataFetchPollInterval(0);
  };

  const handleAddSignatureState = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'PendingSignature':
        setIsWaiting(true);
        break;
      case 'Mining':
        setIsLoading(true);
        setIsWaiting(false);
        props.setDataFetchPollInterval(50);
        break;
      case 'Success':
        props.handleRefetchCandidateData();
        setIsTxSuccessful(true);
        setIsLoading(false);
        break;
      case 'Fail':
        props.setDataFetchPollInterval(0);
        setErrorMessage(state.errorMessage);
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'Exception':
        props.setDataFetchPollInterval(0);
        setErrorMessage(state.errorMessage);
        setIsLoading(false);
        setIsWaiting(false);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleAddSignatureState(addSignatureState);
  }, [addSignatureState, handleAddSignatureState]);

  useEffect(() => {
    if (
      isWaiting ||
      isLoading ||
      isTxSuccessful ||
      errorMessage ||
      isGetSignatureWaiting ||
      isGetSignaturePending ||
      isGetSignatureTxSuccessful ||
      getSignatureErrorMessage
    ) {
      setIsOverlayVisible(true);
    }
  }, [
    isWaiting,
    isLoading,
    isTxSuccessful,
    errorMessage,
    isGetSignatureWaiting,
    isGetSignaturePending,
    isGetSignatureTxSuccessful,
    getSignatureErrorMessage,
  ]);

  const [dateErrorMessage, setDateErrorMessage] = useState<string>('');

  useEffect(() => {
    if (expirationDate === undefined) return;
    const today = new Date();
    if (+dayjs(expirationDate) > +dayjs(today) / 1000) {
      setDateErrorMessage('');
    } else {
      setDateErrorMessage('Date must be in the future');
    }
  }, [expirationDate]);

  return (
    <div className={classes.formWrapper}>
      <>
        <div className={clsx(classes.fields, (isWaiting || isLoading) && classes.disabled)}>
          <h4 className={classes.formLabel}>Sponsor this proposal candidate</h4>
          <textarea
            placeholder="Optional reason"
            value={reasonText}
            onChange={event => setReasonText(event.target.value)}
            disabled={isWaiting || isLoading}
          />

          <h4 className={classes.formLabel}>Expiration date (required)</h4>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]} // only future dates
            onChange={e => setExpirationDate(+dayjs(e.target.value).unix())}
            disabled={isWaiting || isLoading}
          />
          {dateErrorMessage && <p className={classes.dateErrorMessage}>{dateErrorMessage}</p>}
        </div>
        <div className="text-center">
          {isWaiting || isLoading ? (
            <img src="/loading-noggles.svg" alt="loading" className={classes.loadingNoggles} />
          ) : (
            <button
              className={classes.button}
              onClick={() => {
                sign();
              }}
              disabled={
                props.transactionState === 'Mining' ||
                expirationDate === undefined ||
                dateErrorMessage !== ''
              }
            >
              {props.proposalIdToUpdate ? 'Re-sign' : 'Sponsor'}
            </button>
          )}
        </div>

        {isOverlayVisible && (
          <div className={classes.submitSignatureStatusOverlay}>
            <span
              className={clsx(
                (isWaiting || isGetSignatureWaiting || isLoading || isGetSignaturePending) &&
                classes.loadingButton,
              )}
            >
              {(isWaiting || isGetSignatureWaiting || isLoading || isGetSignaturePending) && (
                <img
                  src="/loading-noggles.svg"
                  alt="loading"
                  className={classes.transactionModalSpinner}
                />
              )}
              {isGetSignatureWaiting && 'Awaiting signature'}
              {isWaiting && 'Awaiting confirmation'}
              {isGetSignaturePending && 'Confirming'}
              {isLoading && 'Submitting signature'}
            </span>
            {(getSignatureErrorMessage || errorMessage) && (
              <p className={clsx(classes.statusMessage, classes.errorMessage)}>
                {getSignatureErrorMessage || errorMessage}
                <button
                  onClick={() => {
                    clearTransactionState();
                  }}
                >
                  Try again
                </button>
              </p>
            )}
            {isTxSuccessful && (
              <>
                <p className={clsx(classes.statusMessage, classes.successMessage)}>
                  <a
                    href={
                      addSignatureState.transaction &&
                      `${buildEtherscanTxLink(addSignatureState.transaction.hash)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Signature added successfully
                    {addSignatureState.transaction && (
                      <img src={link} width={16} alt="link symbol" />
                    )}
                  </a>
                </p>
              </>
            )}
            <>
              <ul className={classes.steps}>
                <li>
                  <strong>
                    {(isGetSignatureWaiting || isGetSignaturePending) && (
                      <span className={classes.spinner}>
                        <Spinner animation="border" />
                      </span>
                    )}
                    {isGetSignatureTxSuccessful && (
                      <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                    )}
                    {getSignatureErrorMessage && (
                      <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                    )}
                  </strong>
                  <Trans>Signature request</Trans>
                </li>
                <li>
                  <strong>
                    {(isWaiting || isLoading) && (
                      <span className={classes.spinner}>
                        <Spinner animation="border" />
                      </span>
                    )}
                    {isTxSuccessful && (
                      <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                    )}
                    {(getSignatureErrorMessage || errorMessage) && (
                      <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                    )}
                    {!(
                      isWaiting ||
                      isLoading ||
                      isTxSuccessful ||
                      errorMessage ||
                      getSignatureErrorMessage
                    ) && <span className={classes.placeholder}></span>}
                  </strong>
                  <Trans>Submit signature</Trans>
                </li>
              </ul>
            </>

            {/* close overlay */}
            {isTxSuccessful && (
              <button
                className={classes.closeButton}
                onClick={() => {
                  props.setIsFormDisplayed(false);
                  clearTransactionState();
                }}
              >
                &times;
              </button>
            )}
          </div>
        )}
      </>
      <p className={classes.note}>
        <Trans>
          Once a signed proposal is onchain, signers will need to wait until the proposal is queued
          or defeated before putting another proposal onchain.
        </Trans>
      </p>
    </div>
  );
}

export default SignatureForm;
