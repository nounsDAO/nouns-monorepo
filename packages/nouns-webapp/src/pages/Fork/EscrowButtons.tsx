import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './Fork.module.css';
import { Trans } from '@lingui/macro';
import { TransactionStatus, useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { useIsApprovedForAll, useSetApprovalForAll } from '../../wrappers/nounToken';
import config from '../../config';
import { useEscrowToFork } from '../../wrappers/nounsDao';
import { ethers } from 'ethers';
import { NounsTokenABI } from '@nouns/sdk';
import { useReadonlyProvider } from '../../hooks/useReadonlyProvider';

type Props = {}

function EscrowButtons({ }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const [isApproved, setIsApproved] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { setApproval, setApprovalState } = useSetApprovalForAll();
  const isApprovedForAll = useIsApprovedForAll();
  const { account } = useEthers();
  const provider = useReadonlyProvider();
  // const handleEscrowToFork = () => {
  //   // escrowToFork(27, 1, "the reason");
  //   escrowToFork();
  // }

  useEffect(() => {
    const testContract = async () => {
      const tokenContract = new ethers.Contract(config.addresses.nounsToken, NounsTokenABI, provider);
      const test = await tokenContract.contractURI();
      console.log('test', test)
    }
    testContract();
    // getting error when trying to check approval. 
    // commenting out for now
    const getIsApproved = async (account: string, dao: string) => {
      const tokenContract = new ethers.Contract(config.addresses.nounsToken, NounsTokenABI, provider);
      const isApproved = await tokenContract.isApprovedForAll('0xCB43078C32423F5348Cab5885911C3B5faE217F9', dao);
      setIsApproved(isApproved);
    }
    if (account) {
      getIsApproved(account, config.addresses.nounsDAOProxy);
    }
  }, [account]);



  const handleSetApproval = () => {
    setApproval(config.addresses.nounsDAOProxy, true);
  }

  const handleGetIsApprovedState = useCallback((state: TransactionStatus) => {
    console.log('handleGetIsApprovedState', state)
    switch (state.status) {
      case 'None':
        setIsApprovalLoading(false);
        break;
      case 'Mining':
        setIsApprovalLoading(true);
        break;
      case 'Success':
        setIsApprovalLoading(false);
        setIsApproved(true);
        console.log('is approved')
        break;
      case 'Fail':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsApprovalLoading(false);
        break;
      case 'Exception':
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsApprovalLoading(false);
        break;
    }
  }, []);


  const handleSetApprovalStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        break;
      case 'Fail':
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        break;
      case 'Exception':
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        break;
    }
  }, []);

  const handleEscrowToForkStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsLoading(false);
        break;
      case 'Mining':
        setIsLoading(true);
        break;
      case 'Success':
        setIsLoading(false);
        // setIsVoteSuccessful(true);
        break;
      case 'Fail':
        // setFailureCopy(<Trans>Transaction Failed</Trans>);
        setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsLoading(false);
        // setIsVoteFailed(true);
        break;
      case 'Exception':
        // setFailureCopy(<Trans>Error</Trans>);
        // setErrorMessage(
        //   // getVoteErrorMessage(state?.errorMessage) || <Trans>Please try again.</Trans>,
        // );
        setIsLoading(false);
        // setIsVoteFailed(true);
        break;
    }
  }, []);

  useEffect(() => {
    handleEscrowToForkStateChange(escrowToForkState);
  }, [escrowToForkState, handleEscrowToForkStateChange]);

  useEffect(() => {
    handleSetApprovalStateChange(setApprovalState);
  }, [setApprovalState, handleSetApprovalStateChange]);

  return (
    <>
      <button className={clsx(classes.button, classes.primaryButton)}
        // onClick={() => handleEscrowToFork()}
        onClick={async () => {
          // waiting on contract update to test approval
          // setApproval(config.addresses.nounsDAOProxy, true);
          // setIsLoading(true);
          // escrowToFork([27], [1], "the reason");
          // escrowToFork([27], [0], "");
        }}
      >Add Nouns to Escrow [contract] </button>
    </>
  )
}

export default EscrowButtons