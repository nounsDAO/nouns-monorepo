import { Auction, AuctionHouseContractFunction } from '../../wrappers/nounsAuction';
import {
  connectContractToSigner,
  useEthers,
  useContractFunction,
  useContractCall,
} from '@usedapp/core';
import { useAppSelector } from '../../hooks';
import React, { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react';
import { utils, BigNumber as EthersBN, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import classes from './Bid.module.css';
import { Spinner, InputGroup, FormControl, Button, Col } from 'react-bootstrap';
import { useAuctionMinBidIncPercentage } from '../../wrappers/nounsAuction';
import { useAppDispatch } from '../../hooks';
import { AlertModal, setAlertModal } from '../../state/slices/application';
import { NounsAuctionHouseFactory } from '@digitalax/nouns-sdk';
import config from '../../config';
import WalletConnectModal from '../WalletConnectModal';
import SettleManuallyBtn from '../SettleManuallyBtn';
import ERC20ABI from '../../libs/abi/ERC20.json';
import { black, primary, white } from '../../utils/nounBgColors';

const computeMinimumNextBid = (
  currentBid: BigNumber,
  minBidIncPercentage: BigNumber | undefined,
): BigNumber => {
  return !minBidIncPercentage
    ? new BigNumber(0)
    : currentBid.times(minBidIncPercentage.div(100).plus(1));
};

const minBidEth = (minBid: BigNumber): string => {
  if (minBid.isZero()) {
    return '0.01';
  }

  const eth = Number(utils.formatEther(EthersBN.from(minBid.toString())));
  const roundedEth = Math.ceil(eth * 100) / 100;

  return roundedEth.toString();
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return new BigNumber(0);
  }
  return new BigNumber(utils.parseEther(bidInputRef.current.value).toString());
};

const Bid: React.FC<{
  auction: Auction;
  isEthereum?: boolean;
  auctionEnded: boolean;
}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { library } = useEthers();
  let { auction, auctionEnded, isEthereum } = props;

  const nounsAuctionHouseContract = new NounsAuctionHouseFactory().attach(
    config.addresses.nounsAuctionHouseProxy,
  );

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');
  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? 'Settle' : auction.bidder !== activeAccount ? 'Place bid' : 'Withdraw',
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const minBidIncPercentage = useAuctionMinBidIncPercentage();
  const minBid = computeMinimumNextBid(
    auction && new BigNumber(auction.amount.toString()),
    minBidIncPercentage,
  );

  const { send: placeBid, state: placeBidState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.createBid,
  );
  const { send: settleAuction, state: settleAuctionState } = useContractFunction(
    nounsAuctionHouseContract,
    AuctionHouseContractFunction.settleCurrentAndCreateNewAuction,
  );

  const { ethereum } = window;
  const web3Provider = new ethers.providers.Web3Provider(ethereum);
  const monaContract = new ethers.Contract(
    config.addresses.lidoToken ?? '',
    ERC20ABI,
    web3Provider,
  );

  const { send: approve, state: approveState } = useContractFunction(monaContract, 'approve');

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const confirmBid = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef).isLessThan(minBid)) {
      setModal({
        show: true,
        isEthereum,
        title: 'Insufficient bid amount 🤏',
        message: `Please place a bid higher than or equal to the minimum bid amount of ${minBidEth(
          minBid,
        )} ETH.`,
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    setModal({
      show: true,
      isEthereum,
      title: 'Confirm Bid',
      message:
        'Are you sure you want to place this bid? The contract is decentralised and you will not be able to withdraw your bid after placing it. If someone bids higher than you then you will be immediately refunded. ',
      onSuccess: handlePlaceBid,
    });
  };

  const handlePlaceBid = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    const value = utils.parseEther(bidInputRef.current.value.toString());
    const contract = connectContractToSigner(nounsAuctionHouseContract, undefined, library);
    const gasLimit = await contract.estimateGas.createBid(0, auction.nounId, {
      value,
    });
    const approval: BigNumber = await monaContract.allowance(
      account,
      config.addresses.nounsAuctionHouseProxy,
    );

    if (utils.parseEther(approval.toString()) < utils.parseEther('1000000000'))
      await approve(config.addresses.nounsAuctionHouseProxy, utils.parseEther('1000000000'));

    placeBid(value, auction.nounId);
  };

  const settleAuctionHandler = () => {
    settleAuction();
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = placeBidState.status === 'Mining';
    // allows user to rebid against themselves so long as it is not the same tx
    const isCorrectTx = currentBid(bidInputRef).isEqualTo(new BigNumber(auction.amount.toString()));
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      placeBidState.status = 'Success';
      setModal({
        title: 'Success',
        isEthereum,
        message: `Bid was placed successfully!`,
        show: true,
      });
      setBidButtonContent({ loading: false, content: 'Place bid' });
      clearBidInput();
    }
  }, [auction, placeBidState, account, setModal]);

  // placing bid transaction state hook
  useEffect(() => {
    switch (!auctionEnded && placeBidState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Place bid',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          isEthereum,
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
      case 'Success':
        setModal({
          title: 'Success',
          isEthereum,
          message: `Bid was placed successfully!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Place bid' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          isEthereum,
          message: placeBidState.errorMessage ? placeBidState.errorMessage : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Bid' });
        break;
    }
  }, [placeBidState, auctionEnded, setModal]);

  // settle auction transaction state hook
  useEffect(() => {
    switch (auctionEnded && settleAuctionState.status) {
      case 'None':
        setBidButtonContent({
          loading: false,
          content: 'Settle Auction',
        });
        break;
      case 'Mining':
        setBidButtonContent({ loading: true, content: '' });
        break;
      case 'Success':
        setModal({
          title: 'Success',
          isEthereum,
          message: `Success! Your bid was placed. You can withdraw your bid at anytime. If you are outbid your funds are sent back to your wallet. Good luck!`,
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Withdraw' });
        break;
      case 'Fail':
        setModal({
          title: 'Transaction Failed',
          isEthereum,
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
      case 'Exception':
        setModal({
          title: 'Error',
          isEthereum,
          message: settleAuctionState.errorMessage
            ? settleAuctionState.errorMessage
            : 'Please try again.',
          show: true,
        });
        setBidButtonContent({ loading: false, content: 'Settle Auction' });
        break;
    }
  }, [settleAuctionState, auctionEnded, setModal]);

  if (!auction) return null;

  const isDisabled =
    placeBidState.status === 'Mining' || settleAuctionState.status === 'Mining' || !activeAccount;

  const minBidCopy = `${minBidEth(minBid)} MONA or more`;
  const fomoNounsBtnOnClickHandler = () => {
    // Open Fomo Nouns in a new tab
    window.open('https://fomonouns.wtf', '_blank')?.focus();
  };

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span
              style={{ color: isEthereum ? primary : black }}
              className={classes.customPlaceholderBidAmt}
            >
              {!auctionEnded && !bidInput ? minBidCopy : ''}
            </span>
            <FormControl
              className={classes.bidInput}
              style={{
                backgroundColor: isEthereum ? 'rgba(30, 228, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                color: isEthereum ? 'rgba(30, 228, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
              }}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          <Button
            style={{
              backgroundColor: isEthereum ? primary : black,
              color: isEthereum ? black : white,
            }}
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={auctionEnded ? settleAuctionHandler : confirmBid}
            disabled={isDisabled}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </Button>
        ) : (
          <>
            {/* <Col lg={12} className={classes.voteForNextNounBtnWrapper}>
              <Button className={classes.bidBtnAuctionEnded} onClick={fomoNounsBtnOnClickHandler}>
                Vote for the next Noun ⌐◧-◧
              </Button>
            </Col> */}
            {/* Only show force settle button if wallet connected */}
            {/* {isWalletConnected && (
              <Col lg={12}>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </Col>
            )} */}
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Bid;
