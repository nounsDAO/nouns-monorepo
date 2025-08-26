import React, { ReactNode, useCallback, useEffect, useState, useMemo } from 'react';

import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/react/macro';
import { FormControl, FormSelect, FormText, InputGroup, Spinner } from 'react-bootstrap';
import { map } from 'remeda';

import link from '@/assets/icons/Link.svg';
import SolidColorBackgroundModal from '@/components/solid-color-background-modal';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { useIsApprovedForAll, useSetApprovalForAll } from '@/wrappers/noun-token';
import { useAllProposals, useEscrowToFork, useJoinFork } from '@/wrappers/nouns-dao';

type AddNounsToForkModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  isForkingPeriod: boolean;
  title: string;
  description: string;
  selectLabel: string;
  selectDescription: string;
  account: string;
  ownedNouns: number[] | undefined;
  userEscrowedNouns: number[] | undefined;
  refetchData: () => void;
  setDataFetchPollInterval: (interval: number) => void;
  setIsConfirmModalOpen: (isOpen: boolean) => void;
};

const AddNounsToForkModal = (props: AddNounsToForkModalProps) => {
  const [reasonText, setReasonText] = React.useState('');
  const [selectedProposals, setSelectedProposals] = React.useState<number[]>([]);
  const [selectedNouns, setSelectedNouns] = React.useState<number[]>([]);
  const [isTwoStepProcess, setIsTwoStepProcess] = React.useState(false);
  // approval transactions
  const [isApprovalWaiting, setIsApprovalWaiting] = useState(false);
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [approvalErrorMessage, setApprovalErrorMessage] = useState<ReactNode>('');
  const [isApprovalTxSuccessful, setIsApprovalTxSuccessful] = useState(false);
  const { setApproval, setApprovalState } = useSetApprovalForAll();
  // handle transactions
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTxSuccessful, setIsTxSuccessful] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>('');
  const { escrowToFork, escrowToForkState } = useEscrowToFork();
  const { joinFork, joinForkState } = useJoinFork();
  // etc
  const { data: proposals } = useAllProposals();
  const isApprovedForAll = useIsApprovedForAll();
  const proposalsList = proposals
    ?.filter(proposal => proposal?.id)
    ?.map((proposal, i) => {
      return (
        <option
          key={i}
          value={proposal.id!}
          disabled={Boolean(proposal.id) && selectedProposals.includes(+proposal.id!)}
        >
          {proposal.id} - {proposal.title}
        </option>
      );
    })
    .reverse();

  const ownedNouns = useMemo(() => {
    let nounIds = props.ownedNouns || [];
    if (props.ownedNouns && props.userEscrowedNouns) {
      const nouns = [...props.ownedNouns, ...props.userEscrowedNouns];
      nounIds = [...nouns].sort((a, b) => a - b);
    }
    return nounIds;
  }, [props.ownedNouns, props.userEscrowedNouns]);

  const clearTransactionState = () => {
    // clear all transaction states
    setIsWaiting(false);
    setIsLoading(false);
    setIsTxSuccessful(false);
    setErrorMessage('');
    setIsApprovalWaiting(false);
    setIsApprovalLoading(false);
    setApprovalErrorMessage('');
    setIsApprovalTxSuccessful(false);
    setIsTwoStepProcess(false);
    props.setDataFetchPollInterval(0);
  };
  const clearState = () => {
    props.setIsConfirmModalOpen(false);
    props.setIsModalOpen(false);
    setSelectedNouns([]);
    setSelectedProposals([]);
    setReasonText('');
    clearTransactionState();
  };

  const handleSubmission = (selectedNouns: number[]) => {
    clearTransactionState();
    if (isApprovedForAll) {
      // if approved for all
      addNounsToEscrow(selectedNouns);
    } else {
      setIsTwoStepProcess(true);
      setApproval();
    }
  };

  const addNounsToEscrow = (selectedNouns: number[]) => {
    setIsWaiting(true);
    setIsLoading(false);
    if (props.isForkingPeriod) {
      joinFork({
        args: [
          map(selectedNouns, (n: number) => BigInt(n)),
          map(selectedProposals, (n: number) => BigInt(n)),
          reasonText,
        ],
      });
    } else {
      escrowToFork({
        args: [
          map(selectedNouns, n => BigInt(n)),
          map(selectedProposals, (n: number) => BigInt(n)),
          reasonText,
        ],
      });
    }
  };

  const handleSetApprovalForAllAndAddToEscrowStateChange = useCallback(
    (
      { errorMessage, status }: { errorMessage?: string; status: string },
      selectedNouns: number[],
    ) => {
      switch (status) {
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
          setIsApprovalTxSuccessful(true);
          // successfully approved, now escrow
          addNounsToEscrow(selectedNouns);
          break;
        case 'Fail':
          setApprovalErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsApprovalLoading(false);
          break;
        case 'Exception':
          setApprovalErrorMessage(errorMessage || <Trans>Please try again.</Trans>);
          setIsApprovalLoading(false);
          setIsApprovalWaiting(false);
          break;
      }
    },
    [
      setIsApprovalLoading,
      setIsApprovalWaiting,
      setIsApprovalTxSuccessful,
      setApprovalErrorMessage,
    ],
  );

  const handleAddToForkStateChange = useCallback(
    ({ errorMessage: errorMessage1, status }: { status: string; errorMessage?: string }) => {
      switch (status) {
        case 'None':
          setIsLoading(false);
          break;
        case 'PendingSignature':
          setIsWaiting(true);
          break;
        case 'Mining':
          setIsWaiting(false);
          setIsLoading(true);
          // poll for data to catch when nouns have been added to escrow, fallback if refresh doesn't catch it
          props.setDataFetchPollInterval(20);
          break;
        case 'Success':
          setIsLoading(false);
          setIsTxSuccessful(true);
          // if successful, disable nouns in list from being added to escrow again
          props.refetchData();
          setSelectedNouns([]);
          break;
        case 'Fail':
          setErrorMessage(errorMessage1 || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          props.setDataFetchPollInterval(0);
          break;
        case 'Exception':
          setErrorMessage(errorMessage1 || <Trans>Please try again.</Trans>);
          setIsLoading(false);
          setIsWaiting(false);
          props.setDataFetchPollInterval(0);
          break;
      }
    },
    [setIsLoading, setIsWaiting, setIsTxSuccessful, setErrorMessage, setSelectedNouns, props],
  );

  useEffect(() => {
    handleSetApprovalForAllAndAddToEscrowStateChange(setApprovalState, selectedNouns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setApprovalState, handleSetApprovalForAllAndAddToEscrowStateChange]);

  // Update your useEffect with complete dependency arrays
  useEffect(() => {
    if (props.isForkingPeriod) {
      handleAddToForkStateChange(joinForkState);
    } else {
      handleAddToForkStateChange(escrowToForkState);
    }
  }, [props.isForkingPeriod, escrowToForkState, joinForkState, handleAddToForkStateChange]);

  const confirmModalContent = (
    <div className="font-normal">
      <h2>Confirm</h2>
      <p>
        By joining this fork you are giving up your Nouns to be retrieved in the new fork. This
        cannot be undone.
      </p>
      <button
        type="button"
        className={cn(
          'font-pt h-fit rounded-lg border-0 px-4 py-[10px] text-[22px] font-bold leading-none text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
          'mb-4 bg-black text-white no-underline hover:opacity-75 disabled:bg-[#ccc] disabled:hover:opacity-100',
        )}
        onClick={() => {
          props.setIsConfirmModalOpen(false);
          props.setIsModalOpen(true);
        }}
      >
        Join
      </button>
      <button
        type="button"
        className={cn(
          'font-pt h-fit rounded-lg border-0 bg-[#faf4f8] px-4 py-[10px] text-[22px] font-bold leading-none text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
        )}
        onClick={() => {
          props.setIsConfirmModalOpen(false);
        }}
      >
        Cancel
      </button>
    </div>
  );

  const modalContent = (
    <div className="font-normal">
      <h2>{props.isForkingPeriod ? 'Join fork' : 'Add Nouns to escrow'}</h2>

      <p>
        {!props.isForkingPeriod ? (
          <>
            Nouners can withdraw their tokens from escrow as long as the forking period hasn&apos;t
            started. Nouns in escrow are not eligible to vote or submit proposals.
          </>
        ) : (
          <>
            By joining this fork you are giving up your Nouns to be retrieved in the new fork. This
            cannot be undone.
          </>
        )}
      </p>

      <div>
        <InputGroup className={'mb-[10px] flex w-full flex-col gap-[10px]'}>
          <div>
            <FormText>
              <strong>Reason</strong> (optional)
            </FormText>
            <FormControl
              aria-label="Your reason for forking"
              className="w-full rounded-[6px] px-[12px] py-[10px]"
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder={'Your reason for forking'}
            />
          </div>
          <div>
            <FormText>
              <strong>Proposals that triggered this decision</strong> (optional)
            </FormText>
            <FormSelect
              aria-label="Select proposal(s)"
              className="w-full rounded-[6px] px-[12px] py-[10px]"
              defaultValue="default"
              onChange={e => {
                setSelectedProposals([+e.target.value, ...selectedProposals]);
              }}
            >
              <option value="default" disabled={true}>
                Select proposal(s)
              </option>
              {proposalsList?.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}
            </FormSelect>
          </div>
        </InputGroup>
      </div>
      <div className="flex flex-col gap-[10px]">
        {selectedProposals.map((proposalId, i) => {
          const prop = proposals?.find(
            proposal => proposal?.id != null && +proposal.id === proposalId,
          );
          return (
            <div
              className="flex flex-row items-center justify-between rounded-[8px] border-2 border-[#d3d3d3] bg-white px-[10px] py-[6px] text-[16px]"
              key={i}
            >
              <span>
                <a
                  className="text-[#14161b] no-underline hover:underline"
                  href={`/vote/${prop?.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{prop?.id}</strong> {prop?.title}
                </a>
              </span>
              <button
                type="button"
                onClick={() => {
                  const newSelectedProposals = selectedProposals.filter(id => id !== proposalId);
                  setSelectedProposals(newSelectedProposals);
                }}
                className="size-[20px] cursor-pointer border-0 bg-transparent p-0 text-[20px] opacity-20 transition-all duration-200 ease-in-out hover:opacity-100"
              >
                <MinusCircleIcon />
              </button>
            </div>
          );
        })}
      </div>
      <div className="my-[20px] flex flex-row items-end justify-between max-[991px]:flex-col">
        <div className="w-[70%] max-[991px]:w-full">
          <p>
            <strong>Select Nouns to {props.isForkingPeriod ? 'join fork' : 'to escrow'}</strong>
          </p>
          <p>
            <Trans>
              Add as many or as few of your Nouns as you’d like. Additional Nouns can be added
              during the escrow and forking periods.
            </Trans>
          </p>
        </div>
        {props.userEscrowedNouns !== undefined &&
          ownedNouns.length > props.userEscrowedNouns.length && (
            <button
              type="button"
              onClick={() => {
                if (Boolean(approvalErrorMessage)) {
                  clearTransactionState();
                }
                if (props.ownedNouns && selectedNouns.length === props.ownedNouns.length) {
                  setSelectedNouns([]);
                } else {
                  setSelectedNouns(props.ownedNouns || []);
                }
              }}
              disabled={isWaiting || isLoading || isApprovalWaiting || isApprovalLoading}
            >
              {selectedNouns.length === props.ownedNouns?.length ? 'Unselect' : 'Select'} all
            </button>
          )}
      </div>
      <div className="mt-[10px] flex flex-row flex-wrap items-center justify-center gap-[10px]">
        {ownedNouns.map((nounId: number) => {
          return (
            <button
              type="button"
              onClick={() => {
                if (Boolean(approvalErrorMessage) || Boolean(errorMessage) || isTxSuccessful) {
                  clearTransactionState();
                }
                if (selectedNouns.includes(nounId)) {
                  setSelectedNouns(selectedNouns.filter(id => id !== nounId));
                } else {
                  setSelectedNouns([...selectedNouns, nounId]);
                }
              }}
              disabled={
                isWaiting ||
                isLoading ||
                isApprovalWaiting ||
                isApprovalLoading ||
                (props.userEscrowedNouns?.includes(nounId) ?? false)
              }
              className={cn(
                'font-londrina relative w-[calc(33%_-_6px)] cursor-pointer rounded-[12px] border-2 border-[rgba(0,0,0,0.25)] bg-white p-[10px] text-left text-[20px] leading-none transition-all duration-200 ease-in-out hover:shadow-[inset_0_0_0_2px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-50 max-[991px]:w-full',
                selectedNouns.includes(nounId) && 'border-2 border-[rgba(0,0,0,0.75)]',
                (props.userEscrowedNouns?.includes(nounId) ?? false) &&
                  'overflow-hidden border-[#e8e8e8] opacity-100 hover:border-[#e8e8e8] hover:shadow-none [&>div]:opacity-65',
              )}
              key={nounId}
            >
              <div>
                <img
                  src={`https://noun.pics/${nounId}`}
                  alt="noun"
                  className="max-w-[48px] rounded-[6px]"
                />
                Noun {nounId}
              </div>
              {(props.userEscrowedNouns?.includes(nounId) ?? false) && (
                <span className="font-pt absolute left-0 top-0 w-full rounded-[4px] border-b border-[#e6e6e6] bg-white p-0 text-center text-[10px] font-bold">
                  {props.isForkingPeriod ? 'in fork' : 'in escrow'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="my-[20px] text-center">
        {!(
          Boolean(approvalErrorMessage) ||
          Boolean(errorMessage) ||
          isTxSuccessful ||
          isApprovalTxSuccessful
        ) && (
          <button
            type="button"
            className={cn(
              'font-pt h-fit rounded-lg border-0 px-4 py-[10px] text-[22px] font-bold leading-none text-[var(--brand-gray-dark-text)] transition-all duration-150 ease-in-out',
              'mb-4 bg-black text-white no-underline hover:opacity-75 disabled:bg-[#ccc] disabled:hover:opacity-100',
              (isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) &&
                'font-pt mb-5 w-full rounded-[8px] border border-[#e6e6e6] bg-[rgba(0,0,0,0.05)] p-4 text-center text-[15px] font-bold text-[#14161b]',
            )}
            disabled={
              selectedNouns.length === 0 ||
              isWaiting ||
              isLoading ||
              isApprovalWaiting ||
              isApprovalLoading
            }
            onClick={() => {
              handleSubmission(selectedNouns);
            }}
          >
            {!isWaiting && !isLoading && !isApprovalWaiting && !isApprovalLoading && (
              <>
                Add {selectedNouns.length > 0 && selectedNouns.length} Noun
                {selectedNouns.length === 1 ? '' : 's'} to{' '}
                {props.isForkingPeriod ? 'fork' : 'escrow'}
              </>
            )}
            <span>
              {(isWaiting || isApprovalWaiting || isLoading || isApprovalLoading) && (
                <img
                  src="/loading-noggles.svg"
                  alt="loading"
                  className="mx-auto mb-2 block max-w-[45px]"
                />
              )}
              {isApprovalWaiting && 'Awaiting approval'}
              {isWaiting && 'Awaiting confirmation'}
              {isApprovalLoading && 'Approving'}
              {isLoading && `Adding to ${props.isForkingPeriod ? 'fork' : 'escrow'}`}
            </span>
          </button>
        )}
        {(Boolean(approvalErrorMessage) || Boolean(errorMessage)) && (
          <p
            className={cn(
              'font-pt mb-4 rounded-lg border border-[#e6e6e6] bg-white px-8 py-4 text-center text-[15px] font-bold text-[#14161b] transition-all duration-150 ease-in-out',
              'border-[var(--brand-color-red-translucent)] bg-[var(--brand-color-red-translucent)] text-[var(--brand-color-red)]',
            )}
          >
            {Boolean(approvalErrorMessage) ? approvalErrorMessage : errorMessage}
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
            <p
              className={cn(
                'font-pt mb-4 rounded-lg border border-[#e6e6e6] bg-white px-8 py-4 text-center text-[15px] font-bold text-[#14161b] transition-all duration-150 ease-in-out',
                'border-[var(--brand-color-green)] bg-[var(--brand-color-green-translucent)] text-[var(--brand-color-green)]',
              )}
            >
              <a
                href={
                  escrowToForkState.transaction?.hash
                    ? `${buildEtherscanTxLink(escrowToForkState.transaction.hash)}`
                    : undefined
                }
                target="_blank"
                rel="noreferrer"
              >
                Your Nouns have been added to {props.isForkingPeriod ? 'the fork' : 'escrow'}
                {escrowToForkState.transaction != null && (
                  <img src={link} width={16} alt="link symbol" />
                )}
              </a>
              {props.userEscrowedNouns !== undefined &&
                ownedNouns.length > props.userEscrowedNouns.length && (
                  <button
                    type="button"
                    onClick={() => {
                      clearTransactionState();
                    }}
                  >
                    Add additional Nouns
                  </button>
                )}
            </p>
          </>
        )}
        {isTwoStepProcess && (
          <>
            <ul className="m-0 list-none p-0">
              <li>
                <strong>
                  {(isApprovalWaiting || isApprovalLoading) && (
                    <span className={'mr-[3px] inline-block size-[20px]'}>
                      <Spinner animation="border" />
                    </span>
                  )}
                  {isApprovalTxSuccessful && (
                    <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                  )}
                  {Boolean(approvalErrorMessage) && (
                    <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                  )}
                </strong>
                <Trans>Set approval</Trans>
              </li>
              <li>
                <strong>
                  {(isWaiting || isLoading) && (
                    <span className={'mr-[3px] inline-block size-[20px]'}>
                      <Spinner animation="border" />
                    </span>
                  )}
                  {isTxSuccessful && (
                    <FontAwesomeIcon icon={faCircleCheck} height={20} width={20} color="green" />
                  )}
                  {(Boolean(errorMessage) || Boolean(approvalErrorMessage)) && (
                    <FontAwesomeIcon icon={faXmark} height={20} width={20} color="red" />
                  )}
                  {!(
                    isWaiting ||
                    isLoading ||
                    isTxSuccessful ||
                    Boolean(errorMessage) ||
                    Boolean(approvalErrorMessage)
                  ) && (
                    <span className="relative top-[3px] inline-block size-[18px] animate-pulse rounded-full bg-[rgba(0,0,0,0.3)] opacity-50"></span>
                  )}
                </strong>
                <Trans>Add to escrow</Trans>
              </li>
            </ul>
          </>
        )}
        {isApprovedForAll === false && (!isApprovalWaiting || !isApprovalLoading) && (
          <p>You&apos;ll be asked to approve access</p>
        )}
        {selectedNouns.length > 0 && !isTxSuccessful && (
          <>
            <p className={'text-[15px] text-[#14161b]'}>
              Adding {selectedNouns.map(nounId => `Noun ${nounId}`).join(', ')}
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SolidColorBackgroundModal
        show={props.isModalOpen && !props.isConfirmModalOpen}
        onDismiss={() => {
          setSelectedNouns([]);
          clearState();
        }}
        content={modalContent}
      />
      <SolidColorBackgroundModal
        show={props.isConfirmModalOpen}
        onDismiss={() => props.setIsConfirmModalOpen(false)}
        content={confirmModalContent}
      />
    </>
  );
};
export default AddNounsToForkModal;
