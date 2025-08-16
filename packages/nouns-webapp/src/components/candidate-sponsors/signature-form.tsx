import { ReactNode, useCallback, useEffect, useState } from 'react';

import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Spinner } from 'react-bootstrap';
import { isNullish } from 'remeda';
import {
  encodeAbiParameters,
  encodePacked,
  getAddress,
  hexToBytes,
  keccak256,
  toBytes,
} from 'viem';
import { useSignTypedData } from 'wagmi';

import link from '@/assets/icons/Link.svg';
import { nounsGovernorAddress } from '@/contracts';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Address } from '@/utils/types';
import { defaultChain } from '@/wagmi';
import { ProposalCandidate, useAddSignature } from '@/wrappers/nouns-data';

import classes from './candidate-sponsors.module.css';

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
} as const;

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
} as const;

type SignatureFormProps = {
  id: string;
  transactionState: 'None' | 'Success' | 'Mining' | 'Fail' | 'Exception';
  setTransactionState: (state: 'None' | 'Success' | 'Mining' | 'Fail' | 'Exception') => void;
  setIsFormDisplayed: (displayed: boolean) => void;
  candidate: ProposalCandidate;
  handleRefetchCandidateData: () => void;
  setDataFetchPollInterval: (interval: number | null) => void;
  proposalIdToUpdate: number;
};

const SignatureForm = (props: Readonly<SignatureFormProps>) => {
  const [reasonText, setReasonText] = useState('');
  const [expirationDate, setExpirationDate] = useState<number>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { addSignature, addSignatureState } = useAddSignature();
  const [isGetSignatureWaiting, setIsGetSignatureWaiting] = useState(false);
  const [isGetSignaturePending, setIsGetSignaturePending] = useState(false);
  const [isGetSignatureTxSuccessful, setIsGetSignatureTxSuccessful] = useState(false);
  const [getSignatureErrorMessage, setGetSignatureErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');

  const chainId = defaultChain.id;

  const [domain, setDomain] = useState({
    name: 'Nouns DAO',
    chainId,
    verifyingContract: nounsGovernorAddress[chainId],
  });

  useEffect(() => {
    setDomain(prev => ({
      ...prev,
      verifyingContract: nounsGovernorAddress[chainId],
    }));
  }, []);

  // Hook for EIP-712 typed data signing
  const { data, signTypedData, isPending: isSignPending } = useSignTypedData();
  async function calcProposalEncodeData(
    proposer: string,
    targets: string[],
    values: bigint[],
    signatures: string[],
    calldatas: `0x${string}`[],
    description: string,
  ) {
    // Convert each signature to a hash
    const signatureHashes = signatures.map((sig: string) => keccak256(toBytes(sig)));

    // Convert each calldata to a hash
    const calldatasHashes = calldatas.map((calldata: `0x${string}`) =>
      keccak256(hexToBytes(calldata)),
    );

    // Encode the data using viem's encodeAbiParameters
    const encodedData = encodeAbiParameters(
      [
        { name: 'proposer', type: 'address' },
        { name: 'targetsHash', type: 'bytes32' },
        { name: 'valuesHash', type: 'bytes32' },
        { name: 'signaturesHash', type: 'bytes32' },
        { name: 'calldatasHash', type: 'bytes32' },
        { name: 'descriptionHash', type: 'bytes32' },
      ],
      [
        getAddress(proposer),
        keccak256(encodePacked(['address[]'], [targets.map(v => v as Address)])),
        keccak256(encodePacked(['uint256[]'], [values])),
        keccak256(encodePacked(['bytes32[]'], [signatureHashes])),
        keccak256(encodePacked(['bytes32[]'], [calldatasHashes])),
        keccak256(toBytes(description)),
      ],
    );

    return encodedData;
  }

  const getSignature = async () => {
    setIsGetSignatureWaiting(true);

    try {
      if (props.proposalIdToUpdate > 0) {
        // Create the value for an update proposal
        const value = {
          proposalId: BigInt(props.proposalIdToUpdate),
          proposer: getAddress(props.candidate.proposer),
          targets: props.candidate.version.content.targets.map(target => getAddress(target)),
          values: props.candidate.version.content.values.map(value => BigInt(value)),
          signatures: props.candidate.version.content.signatures,
          calldatas: props.candidate.version.content.calldatas,
          description: props.candidate.version.content.description,
          expiry: BigInt(expirationDate ?? 0),
        };

        // Trigger the signature request
        signTypedData({
          domain,
          types: updateProposalTypes,
          primaryType: 'UpdateProposal',
          message: value,
        });
      } else {
        if (isNullish(props.candidate)) return;

        // Create the value for a new proposal
        const value = {
          proposer: getAddress(props.candidate.proposer),
          targets: props.candidate.version.content.targets.map(target => getAddress(target)),
          values: props.candidate.version.content.values.map(value => BigInt(value)),
          signatures: props.candidate.version.content.signatures,
          calldatas: props.candidate.version.content.calldatas,
          description: props.candidate.version.content.description,
          expiry: BigInt(expirationDate ?? 0),
        };

        // Trigger the signature request
        signTypedData({
          domain,
          types: createProposalTypes,
          primaryType: 'Proposal',
          message: value,
        });
      }

      setIsGetSignatureWaiting(false);
      setIsGetSignatureTxSuccessful(true);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGetSignatureErrorMessage(err.message);
      } else {
        setGetSignatureErrorMessage('Unknown error occurred');
      }
      setIsGetSignatureWaiting(false);
      return undefined;
    }
  };

  async function sign() {
    const signature = await getSignature();
    if (signature) {
      setIsGetSignatureWaiting(false);
      setIsWaiting(true);

      // Calculate encoded proposal data
      const encodedProp = await calcProposalEncodeData(
        props.candidate.proposer,
        props.candidate.version.content.targets,
        props.candidate.version.content.values.map(value => BigInt(value)),
        props.candidate.version.content.signatures,
        props.candidate.version.content.calldatas,
        props.candidate.version.content.description,
      );

      // If this is a proposal update, pack the proposal ID with the encoded data
      const encodedPropUpdate =
        props.proposalIdToUpdate > 0
          ? encodePacked(['uint256', 'bytes'], [BigInt(props.proposalIdToUpdate), encodedProp])
          : encodedProp;

      // Submit the signature
      await addSignature({
        args: [
          signature as `0x${string}`,
          !isNullish(expirationDate) ? BigInt(expirationDate) : 0n,
          props.candidate.proposer as `0x${string}`,
          props.candidate.slug,
          BigInt(props.proposalIdToUpdate), // proposalIdToUpdate
          props.proposalIdToUpdate > 0 ? encodedPropUpdate : encodedProp,
          reasonText,
        ],
      });
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

  const handleAddSignatureState = useCallback(
    ({ errorMessage, status }: { errorMessage?: string; status: string }) => {
      switch (status) {
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
        case 'Exception':
          props.setDataFetchPollInterval(0);
          setErrorMessage(errorMessage);
          setIsLoading(false);
          setIsWaiting(false);
          break;
      }
    },
    [],
  );

  useEffect(() => {
    handleAddSignatureState(addSignatureState);
  }, [addSignatureState, handleAddSignatureState]);

  // Update overlay visibility when signing states change
  useEffect(() => {
    if (
      isWaiting ||
      isLoading ||
      isTxSuccessful ||
      Boolean(errorMessage) ||
      isGetSignatureWaiting ||
      isSignPending || // Using wagmi's isPending instead of custom state
      isGetSignatureTxSuccessful ||
      Boolean(getSignatureErrorMessage)
    ) {
      setIsOverlayVisible(true);
    }
  }, [
    isWaiting,
    isLoading,
    isTxSuccessful,
    errorMessage,
    isGetSignatureWaiting,
    isSignPending, // Using wagmi's isPending instead of custom state
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

  // Effect to handle the signature data changes
  useEffect(() => {
    if (data && isGetSignatureWaiting) {
      setIsGetSignatureWaiting(false);
      setIsGetSignatureTxSuccessful(true);
    }
  }, [data, isGetSignatureWaiting]);

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
              type="button"
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
              {isSignPending && 'Confirming signature'}
              {isLoading && 'Submitting signature'}
            </span>
            {Boolean(getSignatureErrorMessage || errorMessage) && (
              <p className={clsx(classes.statusMessage, classes.errorMessage)}>
                {getSignatureErrorMessage || errorMessage}
                <button
                  type="button"
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
                      addSignatureState.transaction?.hash &&
                      `${buildEtherscanTxLink(addSignatureState.transaction.hash)}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    Signature added successfully
                    {addSignatureState.transaction != null && (
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
                    {(isGetSignatureWaiting || isSignPending) && (
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
                    {Boolean(getSignatureErrorMessage || errorMessage) && (
                      <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                    )}
                    {!(
                      isWaiting ||
                      isLoading ||
                      isTxSuccessful ||
                      Boolean(errorMessage) ||
                      Boolean(getSignatureErrorMessage)
                    ) && <span className={classes.placeholder}></span>}
                  </strong>
                  <Trans>Submit signature</Trans>
                </li>
              </ul>
            </>

            {/* close overlay */}
            {isTxSuccessful && (
              <button
                type="button"
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
};

export default SignatureForm;
