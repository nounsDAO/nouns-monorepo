import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classes from './AddNounsToForkModal.module.css'
import SolidColorBackgroundModal from '../SolidColorBackgroundModal'
import { InputGroup, FormText, FormControl, FormSelect, Spinner } from 'react-bootstrap'
import { useAllProposals, useEscrowToFork } from '../../wrappers/nounsDao'
import clsx from 'clsx'
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro'
import { TransactionStatus, useEthers } from '@usedapp/core'
import config from '../../config';
import { useSetApprovalForAll, useUserOwnedNounIds, useUserVotes, useIsApprovedForAll, useSetApprovalForTokenId } from '../../wrappers/nounToken'
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
type Props = {
  setIsModalOpen: Function;
  isModalOpen: boolean;
  isForkingPeriod: boolean;
  title: string;
  description: string;
  selectLabel: string;
  selectDescription: string;
  account: string;
}

export default function AddNounsToForkModal(props: Props) {
  const [reasonText, setReasonText] = React.useState('');
  const [selectedProposals, setSelectedProposals] = React.useState<number[]>([]);
  const [selectedNouns, setSelectedNouns] = React.useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isTwoStepProcess, setIsTwoStepProcess] = React.useState(false);
  const { data: proposals } = useAllProposals();
  const proposalsList = proposals?.map((proposal, i) => {
    return (
      <option key={i} value={proposal.id}>{proposal.id} - {proposal.title}</option>
    )
  });
  const ownedNouns = useUserOwnedNounIds();
  const { approveTokenId, approveTokenIdState } = useSetApprovalForTokenId();

  // approval transactions
  const [isApprovalWaiting, setIsApprovalWaiting] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isApprovalError, setIsApprovalError] = useState(false);
  const [approvalErrorMessage, setApprovalErrorMessage] = useState<ReactNode>('');
  const [isApprovalTxSuccessful, setIsApprovalTxSuccessful] = useState(false);

  // handle transactions 
  const [isLoading, setIsLoading] = useState(false);


  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { setApproval, setApprovalState, isApprovedForAll } = useSetApprovalForAll();
  // const isApprovedForAll = useIsApprovedForAll();
  console.log('isApprovedForAll', isApprovedForAll)
  console.log('isWaiting', isWaiting)

  const clearTransactionState = () => {
    setIsWaiting(false);
    setIsLoading(false);
    setIsError(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
    setIsApprovalWaiting(false);
    setIsApprovalLoading(false);
    setIsApprovalError(false);
    setApprovalErrorMessage('');
    setIsApprovalTxSuccessful(false);
    setIsTwoStepProcess(false);
  }
  const clearState = () => {
    setIsConfirmModalOpen(false);
    props.setIsModalOpen(false);
    setSelectedNouns([]);
    setSelectedProposals([]);
    setReasonText('');
    clearTransactionState();
  }

  const checkApprovalStatus = () => {
    console.log('checkApprovalStatus', approveTokenIdState)
    // if (approveTokenIdState.status === 'Success') {
    //   setIsLoading(false);
    //   setIsWaiting(false);
    //   return approveTokenIdState
    // } else if (approveTokenIdState.status === 'Fail' || approveTokenIdState.status === 'Exception') {
    //   setIsLoading(false);
    //   setIsWaiting(false);
    //   return approveTokenIdState
    // } else {
    console.log('setTimeout');
    setTimeout(checkApprovalStatus, 500)
    // }
    return approveTokenIdState
  }


  const handleSubmission = () => {
    clearTransactionState();
    console.log('approval status', approveTokenIdState.status)
    if (isApprovedForAll) {
      // if approved for all
      setIsWaiting(false);
      setIsLoading(true);
      escrowToFork(selectedNouns, selectedProposals, reasonText);
    } else {
      setIsTwoStepProcess(true);
      setApproval(config.addresses.nounsDAOProxy, true);
      // check approval for each noun // removed for now to simplify. ran into trouble with state returning for all requests instead of just one at a time
      // handleApproveAndAddTokenIds(selectedNouns);
    }

  }

  const handleApproveAll = async (nounIds: number[]) => {
    // handleSetApproval();
    setApproval(config.addresses.nounsDAOProxy, true);
  }

  const handleApproveAndAddTokenIds = async (nounIds: number[]) => {
    const approvals = Promise.all(nounIds.map(async (nounId) => {
      // check if approved
      // if not approved

      approveTokenId(config.addresses.nounsDAOProxy, nounId);
      // const status = checkApprovalStatus();
      // if (status.status === 'Success') {
      //   console.log('approved')
      //   return status
      // }
      // checkApprovalStatus(status);
      // if (!isAwaitingApproval) {
      //   return approveTokenIdState
      // } else {
      //   console.log('isAwaitingApproval', isAwaitingApproval)

      // }



      // console.log('approveTokenIdState', approveTokenIdState);
      // TODO: need to wait until error or success
      // console.log('switch handleApproveAndAddTokenIds', approveTokenIdState.status);
      // switch (approveTokenIdState.status) {

      //   // case 'None':
      //   //   console.log('None')
      //   //   setIsLoading(false);
      //   //   break;
      //   // case 'Mining':
      //   //   console.log('Mining')
      //   //   // setIsLoading(true);
      //   //   break;
      //   case 'Success':
      //     setIsLoading(false);
      //     return approveTokenIdState
      //     // setIsVoteSuccessful(true);
      //     break;
      //   case 'Fail':
      //     // setFailureCopy(<Trans>Transaction Failed</Trans>);
      //     // setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
      //     setIsLoading(false);
      //     return approveTokenIdState;
      //   // setIsVoteFailed(true);
      //   // break;
      //   case 'Exception':
      //     // setFailureCopy(<Trans>Error</Trans>);
      //     // setErrorMessage(
      //     //   state?.errorMessage || <Trans>Please try again.</Trans>,
      //     // );
      //     setIsError(true);
      //     setIsLoading(false);
      //     return approveTokenIdState
      //   // setIsVoteFailed(true);
      //   // break;
      // }
      // return approveTokenIdState

    }))

    // const allApproved = (await approvals).every((result) => {
    //   console.log('result', result, result.status)
    //   // result.status === 'Success'
    //   return result.status === 'Success'
    // })

    // const allApproved = (await approvals).every((result) => result?.status === 'Success');

    // await approvals.then((results) => {
    //   console.log('results', results)
    //   if (allApproved) {
    //     console.log('allApproved', allApproved)
    //     return allApproved
    //   }

    // }).catch((error) => {
    //   console.log('error handleApproveAndAddTokenIds', error)
    // });


    // if (allApproved) {
    //   setIsWaiting(false);
    //   setIsLoading(true);
    //   escrowToFork(nounIds, selectedProposals, reasonText);
    // }
    // else {
    //   console.log('not allApproved')
    //   setIsWaiting(false);
    //   // setErrorMessage('not allApproved')
    // }


    // console.log('approvals', await approvals)
    // .then((results) => {
    //   console.log('results', results)
    //   const allApproved = results.every((result) => result.status === 'Success')
    //   if (allApproved) {
    //     console.log('allApproved')
    //     escrowToFork(nounIds, selectedProposals, reasonText);
    //   }
    //   else {
    //     console.log('not allApproved')
    //   }
    // }).catch((error) => {
    //   console.log('error handleApproveAndAddTokenIds', error)
    // })
    // return approvals;
  };

  // const handleApproveTokenIds = (nounIds: number[]) => {
  //   console.log('handleApproveTokenIds', nounIds)
  //   nounIds.map((nounId) => {
  //     approveTokenId(nounId);
  //   })
  // }

  const handleEscrowToFork = () => {
    // escrowToFork(27, 1, "the reason");
    // escrowToFork();
  }


  const [approvalQueue, setApprovalQueue] = useState<{ id: number, status: string }[]>([]);


  const handleSetApproval = () => {
    setApproval(config.addresses.nounsDAOProxy, true);
  }

  const handleSetApprovalForAllAndAddToEscrowStateChange = useCallback((state: TransactionStatus) => {
    switch (state.status) {
      case 'None':
        setIsApprovalLoading(false);
        break;
      case 'PendingSignature':
        setIsApprovalWaiting(true);
        break;
      case 'Mining':
        setIsApprovalLoading(true);
        setIsApprovalWaiting(false);
        break;
      case 'Success':
        setIsApprovalLoading(false);
        // successfully approved, now escrow
        escrowToFork(selectedNouns, selectedProposals, reasonText);
        break;
      case 'Fail':
        setApprovalErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
        setIsApprovalLoading(false);
        break;
      case 'Exception':
        setApprovalErrorMessage(
          state?.errorMessage || <Trans>Please try again.</Trans>,
        );
        setIsApprovalLoading(false);
        setIsApprovalWaiting(false);
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
        setIsWaiting(false);
        // setIsVoteFailed(true);
        break;
    }
  }, []);

  // const handleApproveTokenIdStateChange = useCallback((state: TransactionStatus) => {
  //   switch (state.status) {
  //     case 'None':
  //       setIsLoading(false);
  //       setIsWaiting(false);
  //       // setIsAwaitingApproval(false);
  //       break;
  //     case 'Mining':
  //       setIsLoading(true);
  //       setIsWaiting(false);
  //       break;
  //     case 'Success':
  //       setIsLoading(false);
  //       // setIsAwaitingApproval(false);
  //       // setIsVoteSuccessful(true);
  //       break;
  //     case 'Fail':
  //       // setFailureCopy(<Trans>Transaction Failed</Trans>);
  //       setErrorMessage(state?.errorMessage || <Trans>Please try again.</Trans>);
  //       setIsLoading(false);
  //       setIsWaiting(false);
  //       // setIsAwaitingApproval(false);
  //       // setIsVoteFailed(true);
  //       break;
  //     case 'Exception':
  //       // setFailureCopy(<Trans>Error</Trans>);
  //       setErrorMessage(
  //         state?.errorMessage || <Trans>Please try again.</Trans>,
  //       );
  //       setIsLoading(false);
  //       setIsWaiting(false);
  //       // setIsAwaitingApproval(false);
  //       // setIsVoteFailed(true);
  //       break;
  //   }
  // }, []);

  useEffect(() => {
    handleEscrowToForkStateChange(escrowToForkState);
  }, [escrowToForkState, handleEscrowToForkStateChange]);

  useEffect(() => {
    handleSetApprovalForAllAndAddToEscrowStateChange(setApprovalState);
  }, [setApprovalState, handleSetApprovalForAllAndAddToEscrowStateChange]);

  // useEffect(() => {
  //   console.log('approveTokenIdState', approveTokenIdState)
  //   // if (isAwaitingApproval) {
  //   //   checkApprovalStatus();
  //   // }
  //   handleApproveTokenIdStateChange(approveTokenIdState);
  // }, [approveTokenIdState, handleApproveTokenIdStateChange]);



  const confirmModalContent = (
    <div className={classes.confirmModalContent}>
      <h2 className={classes.modalTitle}>Confirm</h2>
      <p className={classes.modalDescription}>By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone.</p>
      <button className={clsx(classes.button, classes.primaryButton)}
      // onClick={() => setIsConfirmModalOpen(false)}
      >Join</button>
      <button className={clsx(classes.button, classes.secondaryButton)}
        onClick={() => setIsConfirmModalOpen(false)}
      >Cancel</button>
    </div>
  );

  const modalContent = (
    <div className={classes.modalContent}>
      <h2 className={classes.modalTitle}>
        <Trans>
          Add Nouns to escrow
        </Trans>
      </h2>
      <p className={classes.modalDescription}>
        <Trans>
          Nouners can withdraw their tokens from escrow as long as the forking period hasn't started. Nouns in escrow are not eligible to vote or submit proposals.
        </Trans>
      </p>
      <div className={classes.fields}>
        <InputGroup className={classes.inputs}>
          <div>
            <FormText><strong>Reason</strong> (optional)</FormText>
            <FormControl
              className={classes.reasonInput}
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder={"Your reason for forking"}
            />
          </div>
          <div>
            <FormText><strong>Proposals that triggered this decision</strong> (optional)</FormText>
            <FormSelect
              className={classes.selectMenu}
              onChange={(e) => {
                setSelectedProposals([...selectedProposals, +e.target.value]);
              }}
            >
              <option>Select proposal(s)</option>
              {proposalsList}
            </FormSelect>
          </div>
        </InputGroup>
      </div>
      <div className={classes.selectedProposals}>
        {selectedProposals.map((proposalId) => {
          const prop = proposals.find((proposal) => proposal.id && +proposal.id === proposalId);
          return (
            <div className={classes.selectedProposal}>
              <span><a href={`/vote/${prop?.id}`} target="_blank" rel="noreferrer"><strong>{prop?.id}</strong> {prop?.title}</a></span>
              <button
                onClick={() => {
                  const newSelectedProposals = selectedProposals.filter((id) => id !== proposalId);
                  setSelectedProposals(newSelectedProposals);
                }}
                className={classes.removeButton}><MinusCircleIcon /></button>
            </div>
          )
        })
        }
      </div>
      <div className={classes.sectionHeader}>
        <div className={classes.sectionLabel}>
          <p>
            <strong>
              <Trans>
                Select Nouns to escrow
              </Trans>
            </strong>
          </p>
          <p>
            <Trans>
              Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the escrow period.
            </Trans>
          </p>
        </div>
        <button
          onClick={() => {
            ownedNouns && selectedNouns.length === ownedNouns.length ?
              setSelectedNouns([]) :
              setSelectedNouns(ownedNouns || [])
          }}
        >{selectedNouns.length === ownedNouns?.length ? 'Unselect' : "Select"} all</button>
      </div>
      <div className={classes.nounsList}>
        {ownedNouns && ownedNouns.map((nounId: number) => {
          return (
            <button
              onClick={() => {
                selectedNouns.includes(nounId) ?
                  setSelectedNouns(selectedNouns.filter((id) => id !== nounId)) :
                  setSelectedNouns([...selectedNouns, nounId]);
              }}
              disabled={isWaiting || isLoading || isApprovalWaiting || isApprovalLoading}
              className={clsx(classes.nounButton, selectedNouns.includes(nounId) && classes.selectedNounButton)}
            >
              <img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} />
              Noun {nounId}
            </button>
          )
        })}
      </div>
      <div className={classes.modalActions}>

        {/* {isApprovedForAll ? ( */}
        {!(approvalErrorMessage || errorMessage) && (
          <button
            className={clsx(classes.button, classes.primaryButton, (isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && classes.loadingButton)}
            disabled={
              selectedNouns.length === 0 || isWaiting || isLoading || isApprovalWaiting || isApprovalLoading
            }
            onClick={() => {
              // isApprovedForAll ? handleSubmission() : handleApproveTokenIds(selectedNouns)
              // props.isForkingPeriod ? setIsConfirmModalOpen(true) : props.setIsModalOpen(false)
              handleSubmission();
            }}
          >
            {/* {!isWaiting && !isLoading && !isTxSuccessful && !isError && ( */}
            {!isWaiting && !isLoading && !isApprovalWaiting && !isApprovalLoading && (
              <>
                Add {selectedNouns.length > 0 && selectedNouns.length} Noun{selectedNouns.length === 1 ? '' : 's'} to {props.isForkingPeriod ? 'fork' : 'escrow'}
              </>
            )}

            <span>
              {(isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && <img src="/loading-noggles.svg" alt="loading" className={classes.transactionModalSpinner} />}
              {(isApprovalWaiting) && 'Awaiting approval'}
              {(isWaiting) && 'Awaiting confirmation'}
              {isApprovalLoading && 'Approving'}
              {isLoading && 'Adding'}
            </span>
          </button>
        )}
        {(approvalErrorMessage || errorMessage) && (
          <p className={clsx(classes.statusMessage, classes.errorMessage)}>
            {approvalErrorMessage || errorMessage}
            <button
              onClick={() => {
                clearTransactionState();
              }}
            >Try again</button>
          </p>
        )}
        {isTwoStepProcess && (
          <>
            <ul className={classes.steps}>
              <li>
                <strong>
                  {/* <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color='green' /> */}
                  {/* <span className={classes.spinner}><Spinner animation="border" /></span> */}
                  {(isApprovalWaiting || isApprovalLoading) && <span className={classes.spinner}><Spinner animation="border" /></span>}
                  {isApprovalTxSuccessful && <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} />}
                  {approvalErrorMessage && <FontAwesomeIcon icon={faXmark} height={20} width={20} color='red' />}
                </strong>
                <Trans>Set approval</Trans>
              </li>
              <li>
                <strong>
                  {(isWaiting || isLoading) && <Spinner animation="border" />}
                  {isTxSuccessful && <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} />}
                  {(errorMessage || approvalErrorMessage) && <FontAwesomeIcon icon={faXmark} height={20} width={20} color='red' />}
                  {(!(isWaiting || isLoading || isTxSuccessful || errorMessage || approvalErrorMessage)) && <span className={classes.placeholder}></span>}
                </strong>
                <Trans>Add Nouns to escrow</Trans>
              </li>

            </ul>
          </>
        )}

        {isTxSuccessful && <p className={classes.statusMessage}>Success! Your Nouns have been approved.</p>}
        {/* {isError && errorMessage} */}
        {/* ) : (
          <>


            <button
              className={clsx(classes.button, classes.primaryButton)}
              disabled={selectedNouns.length === 0}
              onClick={() => {
                handleApproveTokenIds(selectedNouns)
              }}
            >
              Approve {selectedNouns.length > 0 && selectedNouns.length} Nouns
            </button>

          </>

        )} */}

        {!isApprovedForAll || !(isWaiting || isLoading || isTxSuccessful || errorMessage || approvalErrorMessage) && (
          <p className={classes.approvalNote}>You'll be asked to approve access</p>
        )}

        {/* todo: add back in to support approve individual ids */}
        {/* {!isApprovedForAll && (
          <>
            <p className={classes.approvalNote}>You'll be asked to approve each noun individually. Or you can <button
              // className={clsx(classes.button, classes.primaryButton)}
              disabled={selectedNouns.length === 0}
              onClick={() => {
                handleSetApproval()
              }}
            >
              approve all
            </button></p>
            {selectedNouns.length > 0 && (<hr />)}
          </>
        )} */}
        {selectedNouns.length > 0 && (
          <p>
            Adding {selectedNouns.map((nounId) => `Noun ${nounId}`).join(', ')}
          </p>
        )}

      </div>

      <hr />
      <button
        onClick={() => {
          setApproval(config.addresses.nounsDAOProxy, false);
        }}
      >revoke approval</button>
    </div >

  )
  // const forkingModalContent = (
  //   <div className={classes.modalContent}>
  //     <h2 className={classes.modalTitle}>
  //       <Trans>
  //         Join the fork
  //       </Trans>
  //     </h2>
  //     <p className={classes.modalDescription}>
  //       <Trans>
  //         By joining this fork you are giving up your Nouns to be retrieved in the new fork. This cannot be undone.
  //       </Trans>
  //     </p>
  //     <div className={classes.fields}>
  //       <InputGroup className={classes.inputs}>
  //         <div>
  //           <FormText><strong>Reason</strong> (optional)</FormText>
  //           <FormControl
  //             className={classes.reasonInput}
  //             value={reasonText}
  //             onChange={e => setReasonText(e.target.value)}
  //             placeholder={"Your reason for forking"}
  //           />
  //         </div>
  //         <div>
  //           <FormText><strong>Proposals that triggered this decision</strong> (optional)</FormText>
  //           <FormSelect
  //             className={classes.selectMenu}
  //             onChange={(e) => {
  //               setSelectedProposals([...selectedProposals, +e.target.value]);
  //             }}
  //           >
  //             <option>Select proposal(s)</option>
  //             {proposalsList}
  //           </FormSelect>
  //         </div>
  //       </InputGroup>
  //     </div>
  //     <div className={classes.selectedProposals}>
  //       {selectedProposals.map((proposalId) => {
  //         const prop = proposals.find((proposal) => proposal.id && +proposal.id === proposalId);
  //         return (
  //           <div className={classes.selectedProposal}>
  //             <span><a href={`/vote/${prop?.id}`} target="_blank" rel="noreferrer"><strong>{prop?.id}</strong> {prop?.title}</a></span>
  //             <button
  //               onClick={() => {
  //                 const newSelectedProposals = selectedProposals.filter((id) => id !== proposalId);
  //                 setSelectedProposals(newSelectedProposals);
  //               }}
  //               className={classes.removeButton}><MinusCircleIcon /></button>
  //           </div>
  //         )
  //       })
  //       }
  //     </div>
  //     <div className={classes.sectionHeader}>
  //       <div className={classes.sectionLabel}>
  //         <p>
  //           <strong>
  //             <Trans>
  //               Select Nouns to join the fork
  //             </Trans>
  //           </strong>
  //         </p>
  //         <p>
  //           <Trans>
  //             Add as many or as few of your Nouns as you’d like.  Additional Nouns can be added during the forking period
  //           </Trans>
  //         </p>
  //       </div>
  //       <button
  //         onClick={() => {
  //           selectedNouns.length === ownedNouns?.length ?
  //             setSelectedNouns([]) :
  //             setSelectedNouns(ownedNouns || [])
  //         }}
  //       >{selectedNouns.length === ownedNouns?.length ? 'Unselect' : "Select"} all</button>
  //     </div>
  //     <div className={classes.nounsList}>
  //       {ownedNouns && ownedNouns.map((nounId: number) => {
  //         return (
  //           <button
  //             onClick={() => {
  //               selectedNouns.includes(nounId) ?
  //                 setSelectedNouns(selectedNouns.filter((id) => id !== nounId)) :
  //                 setSelectedNouns([...selectedNouns, nounId]);
  //             }}
  //             className={clsx(classes.nounButton, selectedNouns.includes(nounId) && classes.selectedNounButton)}
  //           >
  //             <img src={`https://noun.pics/${nounId}`} alt="noun" className={classes.nounImage} />
  //             Noun {nounId}
  //           </button>
  //         )
  //       })}
  //     </div>
  //     <div className={classes.modalActions}>
  //       <button
  //         className={clsx(classes.button, classes.primaryButton)}
  //         disabled={selectedNouns.length === 0}
  //         onClick={() => {
  //           handleSubmission()
  //         }}
  //       // onClick={() => {
  //       //   props.isForkingPeriod ? setIsConfirmModalOpen(true) : props.setIsModalOpen(false)
  //       // }}
  //       >
  //         Add {selectedNouns.length > 0 && selectedNouns.length} Noun{selectedNouns.length === 1 ? '' : 's'} to {props.isForkingPeriod ? 'fork' : 'escrow'}
  //       </button>
  //       <p>
  //         {selectedNouns.map((nounId) => `Noun ${nounId}`).join(', ')}
  //       </p>
  //     </div>
  //   </div >

  // )
  return (
    <>
      <SolidColorBackgroundModal
        show={props.isModalOpen && !isConfirmModalOpen}
        onDismiss={() => {
          // props.setIsModalOpen(false);
          // setIsConfirmModalOpen(false);
          clearState();
        }}
        // content={props.isForkingPeriod ? forkingModalContent : modalContent}
        content={modalContent}
      />
      <SolidColorBackgroundModal
        show={isConfirmModalOpen}
        onDismiss={() => setIsConfirmModalOpen(false)}
        content={confirmModalContent}
      />
    </>
  )
}