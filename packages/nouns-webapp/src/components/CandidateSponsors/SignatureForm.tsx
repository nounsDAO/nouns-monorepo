import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classes from './CandidateSponsors.module.css';
import dayjs from 'dayjs';
import { Trans } from '@lingui/macro';
import { TransactionStatus, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import config, { CHAIN_ID } from '../../config';
import { useCandidateProposal, useAddSignature, ProposalCandidate } from '../../wrappers/nounsData';
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
};

function SignatureForm(props: Props) {
  const [reasonText, setReasonText] = useState('');
  const [expirationDate, setExpirationDate] = useState<number>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { library } = useEthers();
  const signer = library?.getSigner();

  const [proposalIdToUpdate,
    // setProposalIdToUpdate
    // todo: does this need to be set? 
  ] = useState('');

  // const candidateProposal = useCandidateProposal(props.id);
  const { addSignature, addSignatureState } = useAddSignature();

  const [isGetSignatureWaiting, setIsGetSignatureWaiting] = useState(false);
  const [isGetSignaturePending, setIsGetSignaturePending] = useState(false);
  const [isGetSignatureTxSuccessful, setIsGetSignatureTxSuccessful] = useState(false);
  const [getSignatureErrorMessage, setGetSignatureErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  // const [isAddSignaturePending, setIsAddSignaturePending] = useState(false);
  // const [isAddSignatureWaiting, setIsAddSignatureWaiting] = useState(false);
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

    if (proposalIdToUpdate) {
      const value = {
        proposer: props.candidate.proposer,
        targets: props.candidate.version.targets,
        values: props.candidate.version.values,
        signatures: props.candidate.version.signatures,
        calldatas: props.candidate.version.calldatas,
        description: props.candidate.version.description,
        expiry: expirationDate,
        proposalId: proposalIdToUpdate,
      };
      signature = await signer!._signTypedData(domain, updateProposalTypes, value);
    } else {
      if (!props.candidate) return;
      const value = {
        proposer: props.candidate.proposer,
        targets: props.candidate.version.targets,
        values: props.candidate.version.values,
        signatures: props.candidate.version.signatures,
        calldatas: props.candidate.version.calldatas,
        description: props.candidate.version.description,
        expiry: expirationDate,
      };
      signature = await signer!._signTypedData(domain, createProposalTypes, value).then(
        (sig: any) => {
          console.log('sig', sig);
          setIsGetSignatureWaiting(false);
          setIsGetSignatureTxSuccessful(true);
          return sig;
        },
      ).catch((err: any) => {
        console.log('err', err);
        setGetSignatureErrorMessage(err.message);
        setIsGetSignatureWaiting(false);
      });
    }
    return signature;
  }

  async function sign() {
    // if (!candidateProposal) return;

    const signature = await getSignature();
    console.log('signature', signature);
    if (signature) {
      setIsGetSignatureWaiting(false);
      setIsWaiting(true);
      const encodedProp = await calcProposalEncodeData(
        props.candidate.proposer,
        props.candidate.version.targets,
        props.candidate.version.values,
        props.candidate.version.signatures,
        props.candidate.version.calldatas,
        props.candidate.version.description,
      );
      console.log('>>> encodedProp', encodedProp)
      // signature set, submit signature
      await addSignature(
        signature,
        expirationDate,
        props.candidate.proposer,
        props.candidate.slug,
        encodedProp,
        reasonText,
      );
    }
    // let signature;

    // // get signature
    // setIsAddSignatureWaiting(true);
    // if (proposalIdToUpdate && candidateProposal) {
    //   const value = {
    //     proposer: candidateProposal.proposer,
    //     targets: candidateProposal.version.targets,
    //     values: candidateProposal.version.values,
    //     signatures: candidateProposal.version.signatures,
    //     calldatas: candidateProposal.version.calldatas,
    //     description: candidateProposal.version.description,
    //     expiry: expirationDate,
    //     proposalId: proposalIdToUpdate,
    //   };
    //   signature = await signer!._signTypedData(domain, updateProposalTypes, value);
    // } else {
    //   if (!candidateProposal) return;
    //   const value = {
    //     proposer: candidateProposal.proposer,
    //     targets: candidateProposal.version.targets,
    //     values: candidateProposal.version.values,
    //     signatures: candidateProposal.version.signatures,
    //     calldatas: candidateProposal.version.calldatas,
    //     description: candidateProposal.version.description,
    //     expiry: expirationDate,
    //   };
    //   signature = await signer!._signTypedData(domain, createProposalTypes, value);
    // }

    // const encodedProp = await calcProposalEncodeData(
    //   candidateProposal.proposer,
    //   candidateProposal.version.targets,
    //   candidateProposal.version.values,
    //   candidateProposal.version.signatures,
    //   candidateProposal.version.calldatas,
    //   candidateProposal.version.description,
    // );

    // await addSignature(
    //   signature,
    //   expirationDate,
    //   candidateProposal.proposer,
    //   candidateProposal.slug,
    //   encodedProp,
    //   reasonText,
    // );
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
  }

  const [submitSignatureStatusMessage, setSubmitSignatureStatusMessage] = React.useState<{
    title: string;
    message: string;
    show: boolean;
  }>();

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
        setSubmitSignatureStatusMessage({
          title: 'Success',
          message: 'Signature added',
          show: true,
        });
        setIsTxSuccessful(true);
        setIsLoading(false);
        // props.handleRefetchCandidateData();
        break;
      case 'Fail':
        setErrorMessage(state.errorMessage);
        // setSubmitSignatureStatusMessage({
        //   title: 'Transaction Failed',
        //   message: 'There was a problem submitting the signature.',
        //   show: true,
        // });
        setIsLoading(false);
        setIsWaiting(false);
        break;
      case 'Exception':
        setErrorMessage(state.errorMessage);
        // setSubmitSignatureStatusMessage({
        //   title: 'Error',
        //   message: 'There was a problem submitting the signature.',
        //   show: true,
        // });
        setIsLoading(false);
        setIsWaiting(false);
        break;
    }
  }, []);

  useEffect(() => {
    handleAddSignatureState(addSignatureState);
  }, [addSignatureState, handleAddSignatureState]);

  useEffect(() => {
    if (isWaiting || isLoading || isTxSuccessful || errorMessage || isGetSignatureWaiting || isGetSignaturePending || isGetSignatureTxSuccessful || getSignatureErrorMessage) {
      setIsOverlayVisible(true);
    }
  }, [isWaiting, isLoading, isTxSuccessful, errorMessage, isGetSignatureWaiting, isGetSignaturePending, isGetSignatureTxSuccessful, getSignatureErrorMessage]);

  console.log('errors: ', errorMessage, getSignatureErrorMessage);
  return (
    <div className={classes.formWrapper}>
      {/* {!candidateProposal ? (
        <h4 className={classes.formLabel}>Error loading candidate details</h4>
      ) : ( */}
      <>
        <div className={clsx(
          classes.fields,
          (isWaiting || isLoading) && classes.disabled
        )}>
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
            onChange={e => setExpirationDate(+dayjs(e.target.value))}
            disabled={isWaiting || isLoading}
          />
        </div>
        <div className="text-center">
          {(isWaiting || isLoading) ? (
            <img src="/loading-noggles.svg" alt="loading" className={classes.loadingNoggles} />
          ) : (
            <button
              className={classes.button}
              onClick={() => {
                sign();
                // not using pending status while waiting for user to sign the first signature because rejected signatures are not caught
              }}
              disabled={props.transactionState === 'Mining' || expirationDate === undefined}
            >
              Sponsor
            </button>
          )}
        </div>


        {/* {submitSignatureStatusMessage?.show && ( */}

        {isOverlayVisible && (
          <div className={classes.submitSignatureStatusOverlay}>
            <span className={clsx((isWaiting || isGetSignatureWaiting || isLoading || isGetSignaturePending) && classes.loadingButton)}>
              {(isWaiting || isGetSignatureWaiting || isLoading || isGetSignaturePending) && <img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />}
              {(isGetSignatureWaiting) && 'Awaiting signature'}
              {(isWaiting) && 'Awaiting confirmation'}
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
                  <a href={addSignatureState.transaction && `${buildEtherscanTxLink(addSignatureState.transaction.hash)}`} target="_blank" rel="noreferrer">
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
                    {(isGetSignatureWaiting || isGetSignaturePending) && <span className={classes.spinner}><Spinner animation="border" /></span>}
                    {isGetSignatureTxSuccessful && <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />}
                    {getSignatureErrorMessage && <FontAwesomeIcon icon={faXmark} height={20} width={20} color='red' />}
                  </strong>
                  <Trans>Signature request</Trans>
                </li>
                <li>
                  <strong>
                    {(isWaiting || isLoading) && <span className={classes.spinner}><Spinner animation="border" /></span>}
                    {isTxSuccessful && <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />}
                    {(getSignatureErrorMessage || errorMessage) && <FontAwesomeIcon icon={faXmark} height={20} width={20} color='red' />}
                    {(!(isWaiting || isLoading || isTxSuccessful || errorMessage || getSignatureErrorMessage)) && <span className={classes.placeholder}></span>}
                  </strong>
                  <Trans>Submit signature</Trans>
                </li>
              </ul>
            </>

            {/* close overlay */}
            {isTxSuccessful && (
              <button className={classes.closeButton} onClick={() => {
                props.setIsFormDisplayed(false);
                clearTransactionState();
              }}>
                &times;
              </button>
            )}
            {/* <p>
                <strong>
                  <Trans>
                    {submitSignatureStatusMessage?.title}
                  </Trans>
                </strong>
              </p> */}
            {/* {submitSignatureStatusMessage?.title === 'Success' ? (
                <p>
                  <strong>
                    <Trans>
                      {submitSignatureStatusMessage?.message}
                    </Trans>
                  </strong>
                </p>
              ) : (
                <p>
                  {submitSignatureStatusMessage?.message}
                  <button
                    className={classes.closeLink}
                    onClick={() => {
                      setSubmitSignatureStatusMessage(undefined);
                      setIsGetSignatureWaiting(false);
                      setIsGetSignaturePending(false);
                      setIsLoading(false);
                      setIsWaiting(false);

                    }}
                  >
                    <Trans>Please try again</Trans>
                  </button>
                </p>
              )} */}
          </div>
        )}
      </>
      {/* )} */}
    </div>
  );
}

export default SignatureForm;
