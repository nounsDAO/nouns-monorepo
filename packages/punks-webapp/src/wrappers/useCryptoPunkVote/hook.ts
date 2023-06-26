import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import config from '../../config';
import abi from './abi.json';

const abiInterface = new utils.Interface(abi);
const contract = new Contract(config.addresses.cryptopunksVote, abiInterface);

export const useCryptoPunksVote = () => {
  const { send, state } = useContractFunction(contract, 'delegate');

  return { send, state };
};
