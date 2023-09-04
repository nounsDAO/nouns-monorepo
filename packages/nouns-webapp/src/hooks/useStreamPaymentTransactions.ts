import { utils } from 'ethers';
import { ProposalActionModalState } from '../components/ProposalActionsModal';
import { SupportedCurrency } from '../components/ProposalActionsModal/steps/TransferFundsDetailsStep';
import config from '../config';
import { human2ContractUSDCFormat } from '../utils/usdcUtils';
import StreamFactoryABI from '../utils/streamingPaymentUtils/streamFactory.abi.json';
import wethABIJSON from '../utils/wethUtils/weth.abi.json';
import payerABIJSON from '../utils/payerContractUtils/payerABI.json';
import {
  formatTokenAmount,
  getTokenAddressForCurrency,
} from '../utils/streamingPaymentUtils/streamingPaymentUtils';

const abi = new utils.Interface(StreamFactoryABI);
const wethABI = new utils.Interface(wethABIJSON);

interface UseStreamPaymentTransactionsProps {
  state: ProposalActionModalState;
  predictedAddress?: string;
}

export default function useStreamPaymentTransactions({
  state,
  predictedAddress,
}: UseStreamPaymentTransactionsProps) {
  if (!predictedAddress) {
    return [];
  }

  const fundStreamFunction = 'createStream(address,uint256,address,uint256,uint256,uint8,address)';
  const isUSDC = state.TransferFundsCurrency === SupportedCurrency.USDC;
  const amount = state.amount ?? '0';

  const actions = [
    {
      address: config.addresses.nounsStreamFactory ?? '',
      signature: fundStreamFunction,
      value: '0',
      usdcValue: isUSDC ? parseInt(human2ContractUSDCFormat(amount)) : 0,
      decodedCalldata: JSON.stringify([
        state.address,
        isUSDC ? human2ContractUSDCFormat(amount) : utils.parseEther(amount.toString()).toString(),
        isUSDC ? config.addresses.usdcToken : config.addresses.weth,
        state.streamStartTimestamp,
        state.streamEndTimestamp,
        0,
        predictedAddress,
      ]),
      calldata: abi._encodeParams(abi.functions[fundStreamFunction ?? '']?.inputs ?? [], [
        state.address,
        formatTokenAmount(state.amount, state.TransferFundsCurrency),
        getTokenAddressForCurrency(state.TransferFundsCurrency),
        state.streamStartTimestamp,
        state.streamEndTimestamp,
        0,
        predictedAddress,
      ]),
    },
  ];

  if (!isUSDC) {
    actions.push({
      address: config.addresses.weth ?? '',
      signature: 'deposit()',
      usdcValue: 0,
      value: state.amount ? utils.parseEther(state.amount.toString()).toString() : '0',
      decodedCalldata: JSON.stringify([]),
      calldata: '0x',
    });
    const wethTransfer = 'transfer(address,uint256)';
    actions.push({
      address: config.addresses.weth ?? '',
      signature: wethTransfer,
      usdcValue: 0,
      value: '0',
      decodedCalldata: JSON.stringify([
        predictedAddress,
        utils.parseEther((state.amount ?? 0).toString()).toString(),
      ]),
      calldata: wethABI._encodeParams(wethABI.functions[wethTransfer ?? '']?.inputs ?? [], [
        predictedAddress,
        utils.parseEther(amount.toString()).toString(),
      ]),
    });
  } else {
    const signature = 'sendOrRegisterDebt(address,uint256)';
    const payerABI = new utils.Interface(payerABIJSON);
    actions.push({
      address: config.addresses.payerContract ?? '',
      value: '0',
      usdcValue: parseInt(human2ContractUSDCFormat(amount)),
      signature: signature,
      decodedCalldata: JSON.stringify([predictedAddress, human2ContractUSDCFormat(amount)]),
      calldata: payerABI?._encodeParams(payerABI?.functions[signature]?.inputs, [
        predictedAddress,
        human2ContractUSDCFormat(amount),
      ]),
    });
  }

  return actions;
}
